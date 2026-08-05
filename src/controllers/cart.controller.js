const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const asyncHandler = require("express-async-handler");

const addToCart = asyncHandler(async (req, res, next) => {
  let { branchId, productVariantId, quantity, optionValueIds = [] } = req.body;

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return next(new ErrorHandler("Invalid quantity", 400));
  }

  optionValueIds = [...new Set(optionValueIds)];

  const variant = await prisma.productVariant.findFirst({
    where: {
      id: productVariantId,
      deletedAt: null,
      status: "AVAILABLE",
    },
    include: {
      product: {
        include: {
          menuCategory: {
            include: {
              restaurant: true,
            },
          },
        },
      },
    },
  });

  if (!variant) {
    return next(new ErrorHandler("Variant not found", 404));
  }

  const branch = await prisma.branch.findFirst({
    where: {
      id: branchId,
      deletedAt: null,
      status: "ACTIVE",
    },
  });

  if (!branch) {
    return next(new ErrorHandler("Branch not found", 404));
  }

  const branchProduct = await prisma.branchProduct.findUnique({
    where: {
      branchId_productId: {
        branchId,
        productId: variant.productId,
      },
    },
  });

  if (!branchProduct || !branchProduct.isAvailable) {
    return next(
      new ErrorHandler("Product is not available in this branch", 400),
    );
  }

  const selectedOptions = await prisma.optionValue.findMany({
    where: {
      id: {
        in: optionValueIds,
      },
      deletedAt: null,
      productOption: {
        productId: variant.productId,
        deletedAt: null,
      },
    },
    include: {
      productOption: true,
    },
  });

  if (selectedOptions.length !== optionValueIds.length) {
    return next(new ErrorHandler("One or more option values are invalid", 400));
  }

  const requiredOptions = await prisma.productOption.findMany({
    where: {
      productId: variant.productId,
      deletedAt: null,
      isRequired: true,
    },
    include: {
      values: {
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
        },
      },
    },
  });

  for (const option of requiredOptions) {
    const exists = option.values.some((value) =>
      optionValueIds.includes(value.id),
    );

    if (!exists) {
      return next(new ErrorHandler(`${option.name} is required`, 400));
    }
  }

  const groupedOptions = {};

  for (const option of selectedOptions) {
    groupedOptions[option.productOptionId] =
      (groupedOptions[option.productOptionId] || 0) + 1;
  }

  for (const option of selectedOptions) {
    if (
      groupedOptions[option.productOptionId] >
      option.productOption.maxSelections
    ) {
      return next(
        new ErrorHandler(
          `Maximum selections exceeded for ${option.productOption.name}`,
          400,
        ),
      );
    }
  }

  let unitPrice = Number(variant.discountPrice ?? variant.price);

  unitPrice += selectedOptions.reduce(
    (sum, option) => sum + Number(option.extraPrice),
    0,
  );

  const restaurantId = variant.product.menuCategory.restaurant.id;

  let cart = await prisma.cart.findFirst({
    where: {
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: req.user.id,
        restaurantId,
        branchId,
      },
    });
  } else {
    if (cart.restaurantId !== restaurantId) {
      return next(
        new ErrorHandler(
          "You cannot order from multiple restaurants at the same time",
          400,
        ),
      );
    }

    if (cart.branchId !== branchId) {
      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          branchId,
        },
      });

      cart.branchId = branchId;
    }
  }

  const existingItems = await prisma.cartItem.findMany({
    where: {
      cartId: cart.id,
      productVariantId,
      deletedAt: null,
    },
    include: {
      options: {
        select: {
          optionValueId: true,
        },
      },
    },
  });

  const selectedIds = [...optionValueIds].sort();

  let duplicateItem = null;

  for (const item of existingItems) {
    const itemIds = item.options.map((o) => o.optionValueId).sort();

    if (
      itemIds.length === selectedIds.length &&
      itemIds.every((id, index) => id === selectedIds[index])
    ) {
      duplicateItem = item;
      break;
    }
  }

  if (duplicateItem) {
    const newQuantity = duplicateItem.quantity + quantity;

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: duplicateItem.id,
      },
      data: {
        quantity: newQuantity,
        totalPrice: unitPrice * newQuantity,
      },
      include: {
        productVariant: {
          select: {
            id: true,
            name: true,
            price: true,
            discountPrice: true,
          },
        },
        options: {
          include: {
            optionValue: {
              select: {
                id: true,
                name: true,
                extraPrice: true,
                productOption: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: "Cart updated successfully",
      item: updatedItem,
    });
  }

  const item = await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.create({
      data: {
        cartId: cart.id,
        productVariantId,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      },
    });

    if (selectedOptions.length) {
      await tx.cartItemOption.createMany({
        data: selectedOptions.map((option) => ({
          cartItemId: cartItem.id,
          optionValueId: option.id,
          extraPrice: option.extraPrice,
        })),
      });
    }

    return tx.cartItem.findUnique({
      where: {
        id: cartItem.id,
      },
      include: {
        productVariant: {
          select: {
            id: true,
            name: true,
            price: true,
            discountPrice: true,
          },
        },
        options: {
          include: {
            optionValue: {
              select: {
                id: true,
                name: true,
                extraPrice: true,
                productOption: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  return res.status(201).json({
    message: "Product added to cart successfully",
    item,
  });
});

const getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const cart = await prisma.cart.findFirst({
    where: {
      userId,
      deletedAt: null,
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },

      branch: {
        select: {
          id: true,
          name: true,
        },
      },

      items: {
        where: {
          deletedAt: null,
        },
        include: {
          productVariant: {
            select: {
              id: true,
              name: true,
              price: true,
              discountPrice: true,
            },
          },

          options: {
            include: {
              optionValue: {
                select: {
                  id: true,
                  name: true,
                  extraPrice: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.totalPrice),
    0,
  );

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return res.status(200).json({
    cart,
    totalItems,
    subtotal,
  });
});

const updateQuantity = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return next(new ErrorHandler("Quantity must be greater than 0", 400));
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      deletedAt: null,
      cart: {
        userId: req.user.id,
        deletedAt: null,
      },
    },
    include: {
      options: true,
    },
  });

  if (!item) {
    return next(new ErrorHandler("Cart item not found", 404));
  }

  const totalPrice = Number(item.unitPrice) * quantity;

  const updatedItem = await prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
      totalPrice,
    },
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      totalPrice: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({
    message: "Quantity updated successfully",
    item: updatedItem,
  });
});

const deleteCartItem = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      deletedAt: null,
      cart: {
        userId: req.user.id,
        deletedAt: null,
      },
    },
  });

  if (!item) {
    return next(new ErrorHandler("Cart item not found", 404));
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.cartItemOption.deleteMany({
      where: {
        cartItemId: itemId,
      },
    });

    await tx.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        deletedAt: now,
      },
    });

    const remainingItems = await tx.cartItem.count({
      where: {
        cartId: item.cartId,
        deletedAt: null,
      },
    });

    if (remainingItems === 0) {
      await tx.cart.update({
        where: {
          id: item.cartId,
        },
        data: {
          deletedAt: now,
        },
      });
    }
  });

  return res.status(200).json({
    message: "Cart item deleted successfully",
  });
});

const clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const cart = await prisma.cart.findFirst({
    where: {
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.cartItemOption.deleteMany({
      where: {
        cartItem: {
          cartId: cart.id,
        },
      },
    });

    await tx.cartItem.updateMany({
      where: {
        cartId: cart.id,
        deletedAt: null,
      },
      data: {
        deletedAt: now,
      },
    });

    await tx.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        deletedAt: now,
      },
    });
  });

  return res.status(200).json({
    message: "Cart cleared successfully",
  });
});

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  deleteCartItem,
  clearCart,
};
