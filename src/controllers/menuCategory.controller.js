const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const ApiFeatures = require("../../utils/ApiFeatures");
const { getCache, setCache, clearCache } = require("../../utils/clearCache");

const createMenuCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name.trim();

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId: req.user.id,
      status: "ACTIVE",
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  const existingCategory = await prisma.menuCategory.findFirst({
    where: {
      restaurantId: restaurant.id,
      deletedAt: null,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existingCategory) {
    return next(new ErrorHandler("Menu category already exists", 409));
  }

  const menuCategory = await prisma.menuCategory.create({
    data: {
      name,
      restaurantId: restaurant.id,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  await clearCache(`menu-categories:${req.user.id}:*`);
  res.status(201).json({
    message: "Menu category created successfully",
    menuCategory,
  });
});

const getAllMenuCategories = asyncHandler(async (req, res, next) => {
  const menuCategory = await prisma.menuCategory.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!menuCategory) {
    return next(new ErrorHandler("Menu category not found", 404));
  }

  res.status(200).json({
    menuCategory,
  });
});

const getMyMenuCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const menuCategory = await prisma.menuCategory.findFirst({
    where: {
      id,
      deletedAt: null,
      restaurant: {
        ownerId: req.user.id,
        status: "ACTIVE",
        deletedAt: null,
      },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!menuCategory) {
    return next(new ErrorHandler("Menu category not found", 404));
  }

  res.status(200).json({
    menuCategory,
  });
});

const getAllMyMenuCategories = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(req.query)
    .paginate()
    .search(["name"])
    .sort(["createdAt", "name"]);

  const where = {
    ...features.where,
    deletedAt: null,
    restaurant: {
      ownerId: req.user.id,
      deletedAt: null,
    },
  };

  const cacheKey = `menu-categories:${req.user.id}:${JSON.stringify(req.query)}`;

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  const [menuCategories, total] = await prisma.$transaction([
    prisma.menuCategory.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      select: {
        id: true,
        name: true,
        createdAt: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.menuCategory.count({
      where,
    }),
  ]);

  const response = {
    menuCategories,
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

const updateMenuCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const name = req.body.name?.trim();

  const updates = {};

  if (name) updates.name = name;

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No data provided", 400));
  }

  const menuCategory = await prisma.menuCategory.findFirst({
    where: {
      id,
      deletedAt: null,
      restaurant: {
        ownerId: req.user.id,
        deletedAt: null,
      },
    },
  });

  if (!menuCategory) {
    return next(new ErrorHandler("Menu category not found", 404));
  }

  if (name) {
    const existingName = await prisma.menuCategory.findFirst({
      where: {
        restaurantId: menuCategory.restaurantId,
        deletedAt: null,
        NOT: {
          id,
        },
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingName) {
      return next(new ErrorHandler("Menu category name already exists", 409));
    }
  }

  const updatedMenuCategory = await prisma.menuCategory.update({
    where: {
      id,
    },
    data: updates,
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  await clearCache(`menu-categories:${req.user.id}:*`);
  res.status(200).json({
    message: "Menu category updated successfully",
    menuCategory: updatedMenuCategory,
  });
});

const deleteMenuCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const menuCategory = await prisma.menuCategory.findFirst({
    where: {
      id,
      deletedAt: null,
      restaurant: {
        ownerId: req.user.id,
        deletedAt: null,
      },
    },
  });

  if (!menuCategory) {
    return next(new ErrorHandler("Menu category not found", 404));
  }

  const productsCount = await prisma.product.count({
    where: {
      menuCategoryId: id,
      deletedAt: null,
    },
  });

  if (productsCount > 0) {
    return next(
      new ErrorHandler(
        "Cannot delete menu category because it contains products",
        400,
      ),
    );
  }

  await prisma.menuCategory.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
  await clearCache(`menu-categories:${req.user.id}:*`);
  res.status(200).json({
    message: "Menu category deleted successfully",
  });
});

module.exports = {
  getAllMenuCategories,
  getMyMenuCategoryById,
  getAllMyMenuCategories,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
};
