const ApiFeatures = require("../../utils/ApiFeatures");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const { setCache, clearCache, getCache } = require("../../utils/clearCache");

const createProduct = asyncHandler(async (req, res, next) => {
  const name = req.body.name?.trim();
  const description = req.body.description?.trim() || null;
  const menuCategoryId = req.body.menuCategoryId;

  const existingMenuCategory = await prisma.menuCategory.findFirst({
    where: {
      id: menuCategoryId,
      deletedAt: null,
      restaurant: {
        ownerId: req.user.id,
        status: "ACTIVE",
        deletedAt: null,
      },
    },
    select: {
      id: true,
      restaurantId: true,
    },
  });
  if (!existingMenuCategory) {
    return next(new ErrorHandler("Menu category not found", 404));
  }
  const existingProduct = await prisma.product.findFirst({
    where: {
      menuCategoryId,
      name: { equals: name, mode: "insensitive" },
      deletedAt: null,
    },
  });
  if (existingProduct) {
    return next(new ErrorHandler("Product already exists", 409));
  }
  const product = await prisma.product.create({
    data: {
      name,
      description,
      menuCategoryId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      menuCategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  const branches = await prisma.branch.findMany({
    where: {
      restaurantId: existingMenuCategory.restaurantId,
      deletedAt: null,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });

  await prisma.branchProduct.createMany({
    data: branches.map((branch) => ({
      branchId: branch.id,
      productId: product.id,
    })),
  });

  const keys = [];
  for await (const key of redis.scanIterator({
    MATCH: "products:*",
  })) {
    keys.push(key);
  }

  if (keys.length) {
    await redis.del(keys);
  }
  await clearCache("products:*");
  res.status(201).json({
    message: "Product created successfully",
    product,
  });
});

const getRestaurantProducts = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    return next(new ErrorHandler("restaurantId is required", 400));
  }
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
      status: "ACTIVE",
      deletedAt: null,
    },
  });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }
  const features = new ApiFeatures(req.query)
    .paginate()
    .search(["name", "description"])
    .sort(["createdAt", "name"]);

  const where = {
    ...features.where,
    deletedAt: null,
    status: "AVAILABLE",

    menuCategory: {
      restaurantId,
      deletedAt: null,
      restaurant: {
        status: "ACTIVE",
        deletedAt: null,
      },
    },
  };
  const cacheKey = `products:${restaurantId}:${JSON.stringify(req.query)}`;

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,

        menuCategory: {
          select: {
            id: true,
            name: true,
          },
        },

        variants: {
          where: {
            deletedAt: null,
            status: "AVAILABLE",
          },
          select: {
            id: true,
            name: true,
            price: true,
            discountPrice: true,
          },
        },

        images: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            url: true,
            publicId: true,
            type: true,
          },
        },
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  const response = {
    products,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.ceil(total / features.pagination.limit),
    },
  };

  await setCache(cacheKey, response);

  return res.status(200).json(response);
});

const getProductById = asyncHandler(async (req, res, next) => {
  const { id, restaurantId } = req.params;

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
      status: "ACTIVE",
      deletedAt: null,
    },
  });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
      status: "AVAILABLE",
      menuCategory: {
        restaurantId,
        deletedAt: null,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      menuCategory: {
        select: {
          id: true,
          name: true,
        },
      },

      variants: {
        where: {
          deletedAt: null,
          status: "AVAILABLE",
        },
        select: {
          id: true,
          name: true,
          price: true,
          discountPrice: true,
          status: true,
        },
      },

      images: {
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          url: true,
          publicId: true,
          type: true,
        },
      },

      options: {
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          values: true,
        },
      },
    },
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ product });
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const name = req.body.name?.trim();
  const description = req.body.description;
  const updates = {};

  if (name) updates.name = name;
  if (description !== undefined) {
    updates.description = description?.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No data provided", 400));
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
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
  });
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (name) {
    const existingName = await prisma.product.findFirst({
      where: {
        menuCategoryId: product.menuCategoryId,
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        NOT: { id },
      },
    });
    if (existingName) {
      return next(new ErrorHandler("Product name already exists", 409));
    }
  }
  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: updates,
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      menuCategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  await clearCache("products:*");

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

const updateProductStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const product = await prisma.product.findFirst({
    where: {
      id,
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
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (product.status === status) {
    return next(new ErrorHandler("Product already has this status", 400));
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      menuCategory: {
        select: { id: true, name: true },
      },
      variants: {
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          status: true,
        },
      },

      options: {
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          values: true,
        },
      },
    },
  });

  await clearCache("products:*");
  res.status(200).json({
    message: "Product status updated successfully",
    product: updatedProduct,
  });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id,
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
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.optionValue.updateMany({
      where: {
        productOption: {
          productId: id,
        },
        deletedAt: null,
      },
      data: {
        deletedAt: now,
      },
    }),

    prisma.productOption.updateMany({
      where: {
        productId: id,
        deletedAt: null,
      },
      data: {
        deletedAt: now,
      },
    }),

    prisma.productVariant.updateMany({
      where: {
        productId: id,
        deletedAt: null,
      },
      data: {
        deletedAt: now,
      },
    }),

    prisma.productImage.updateMany({
      where: {
        productId: id,
        deletedAt: null,
      },
      data: {
        deletedAt: now,
      },
    }),

    prisma.product.update({
      where: {
        id,
      },
      data: {
        deletedAt: now,
      },
    }),
  ]);
  await clearCache("products:*");

  res.status(200).json({
    message: "Product deleted successfully",
  });
});

module.exports = {
  createProduct,
  getRestaurantProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStatus,
};
