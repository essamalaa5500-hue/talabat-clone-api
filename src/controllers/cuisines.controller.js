const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const apiFeatures = require("../../utils/ApiFeatures");
const { getCache, setCache, clearCache } = require("../../utils/clearCache");

const createCuisine = asyncHandler(async (req, res, next) => {
  const name = req.body.name.trim();
  const existingCuisine = await prisma.cuisine.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      deletedAt: null,
    },
  });
  if (existingCuisine) {
    return next(new ErrorHandler("Cuisine already exists", 409));
  }
  const cuisine = await prisma.cuisine.create({
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  await clearCache("cuisines:*");
  res.status(201).json({
    message: "Cuisine created successfully",
    cuisine,
  });
});

const getAllCuisines = asyncHandler(async (req, res) => {
  const features = new apiFeatures(req.query)
    .paginate()
    .search(["name"])
    .sort(["createdAt", "name"]);

  const where = {
    ...features.where,
    deletedAt: null,
  };
  const cacheKey = `cuisines:${JSON.stringify(req.query)}`;

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  const [cuisines, total] = await prisma.$transaction([
    prisma.cuisine.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    }),
    prisma.cuisine.count({
      where,
    }),
  ]);

  const response = {
    cuisines,
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

const getCuisineById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cuisine = await prisma.cuisine.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!cuisine) {
    return next(new ErrorHandler("Cuisine not found", 404));
  }
  res.status(200).json({
    cuisine,
  });
});

const updateCuisine = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updates = {};

  if (name) updates.name = name;

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No data provided", 400));
  }

  const cuisine = await prisma.cuisine.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!cuisine) {
    return next(new ErrorHandler("Cuisine not found", 404));
  }

  if (name) {
    const existingName = await prisma.cuisine.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        deletedAt: null,
        NOT: {
          id,
        },
      },
    });

    if (existingName) {
      return next(new ErrorHandler("Cuisine name already exists", 409));
    }
  }

  const updatedCuisine = await prisma.cuisine.update({
    where: {
      id,
    },
    data: updates,
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  await clearCache("cuisines:*");
  res.status(200).json({
    message: "Cuisine updated successfully",
    cuisine: updatedCuisine,
  });
});

const deleteCuisine = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cuisine = await prisma.cuisine.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!cuisine) {
    return next(new ErrorHandler("Cuisine not found", 404));
  }
  const usedCuisine = await prisma.restaurantCuisine.findFirst({
    where: {
      cuisineId: id,
    },
  });

  if (usedCuisine) {
    return next(
      new ErrorHandler(
        "Cannot delete cuisine because it is used by one or more restaurants",
        400,
      ),
    );
  }
  await prisma.cuisine.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
  await clearCache("cuisines:*");

  res.status(200).json({
    message: "Cuisine deleted successfully",
  });
});

module.exports = {
  getAllCuisines,
  getCuisineById,
  createCuisine,
  updateCuisine,
  deleteCuisine,
};
