const asyncHandler = require("express-async-handler");
const prisma = require("../../utils/prisma");
const ErrorHandler = require("../../utils/ErrorHandler");

const createProductVariant = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { name, price, discountPrice } = req.body;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
      status: "AVAILABLE",
      menuCategory: {
        deletedAt: null,
        restaurant: {
          ownerId: req.user.id,
          deletedAt: null,
          status: "ACTIVE",
        },
      },
    },
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const existingVariant = await prisma.productVariant.findFirst({
    where: {
      productId,
      name: {
        equals: name.trim(),
        mode: "insensitive",
      },
      deletedAt: null,
    },
  });

  if (existingVariant) {
    return next(new ErrorHandler("Variant already exists", 409));
  }

  const variant = await prisma.productVariant.create({
    data: {
      productId,
      name: name.trim(),
      price,
      discountPrice,
    },
    select: {
      id: true,
      name: true,
      price: true,
      discountPrice: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(201).json({
    message: "Variant created successfully",
    variant,
  });
});

const getProductVariantsOwner = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
      status: "AVAILABLE",
      menuCategory: {
        deletedAt: null,
        restaurant: {
          ownerId: req.user.id,
          deletedAt: null,
          status: "ACTIVE",
        },
      },
    },
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const variants = await prisma.productVariant.findMany({
    where: {
      productId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      price: true,
      discountPrice: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    total: variants.length,
    variants,
  });
});

const getProductVariants = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
      status: "AVAILABLE",
      menuCategory: {
        deletedAt: null,
        restaurant: {
          deletedAt: null,
          status: "ACTIVE",
        },
      },
    },
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const variants = await prisma.productVariant.findMany({
    where: {
      productId,
      deletedAt: null,
      status: "AVAILABLE",
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      price: true,
      discountPrice: true,
    },
  });

  res.status(200).json({
    total: variants.length,
    variants,
  });
});

const updateProductVariant = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, discountPrice } = req.body;

  const updates = {};

  if (name) updates.name = name.trim();
  if (price !== undefined) updates.price = price;
  if (discountPrice !== undefined) updates.discountPrice = discountPrice;

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No data provided", 400));
  }

  const variant = await prisma.productVariant.findFirst({
    where: {
      id,
      deletedAt: null,
      product: {
        deletedAt: null,
        menuCategory: {
          deletedAt: null,
          restaurant: {
            ownerId: req.user.id,
            deletedAt: null,
            status: "ACTIVE",
          },
        },
      },
    },
    select: {
      id: true,
      productId: true,
      name: true,
      price: true,
      discountPrice: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!variant) {
    return next(new ErrorHandler("Variant not found", 404));
  }

  if (name) {
    const existingName = await prisma.productVariant.findFirst({
      where: {
        productId: variant.productId,
        deletedAt: null,
        NOT: {
          id,
        },
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingName) {
      return next(new ErrorHandler("Variant name already exists", 409));
    }
  }

  const updatedVariant = await prisma.productVariant.update({
    where: {
      id,
    },
    data: updates,
    select: {
      id: true,
      name: true,
      price: true,
      discountPrice: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.status(200).json({
    message: "Variant updated successfully",
    variant: updatedVariant,
  });
});

const updateProductVariantStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["AVAILABLE", "OUT_OF_STOCK", "UNAVAILABLE"];

  if (!status || !validStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid status value", 400));
  }

  const variant = await prisma.productVariant.findFirst({
    where: {
      id,
      deletedAt: null,
      product: {
        deletedAt: null,
        menuCategory: {
          deletedAt: null,
          restaurant: {
            ownerId: req.user.id,
            deletedAt: null,
            status: "ACTIVE",
          },
        },
      },
    },
  });

  if (!variant) {
    return next(new ErrorHandler("Variant not found", 404));
  }

  if (variant.status === status) {
    return next(new ErrorHandler("Variant already has this status", 400));
  }

  const updatedVariant = await prisma.productVariant.update({
    where: {
      id,
    },
    data: {
      status,
    },
    select: {
      id: true,
      name: true,
      price: true,
      discountPrice: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.status(200).json({
    message: "Variant status updated successfully",
    variant: updatedVariant,
  });
});

const deleteProductVariant = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const variant = await prisma.productVariant.findFirst({
    where: {
      id,
      deletedAt: null,
      product: {
        deletedAt: null,
        menuCategory: {
          deletedAt: null,
          restaurant: {
            ownerId: req.user.id,
            deletedAt: null,
            status: "ACTIVE",
          },
        },
      },
    },
  });

  if (!variant) {
    return next(new ErrorHandler("Variant not found", 404));
  }

  await prisma.productVariant.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  res.status(200).json({
    message: "Variant deleted successfully",
  });
});

module.exports = {
  createProductVariant,
  getProductVariantsOwner,
  getProductVariants,
  updateProductVariant,
  updateProductVariantStatus,
  deleteProductVariant,
};
