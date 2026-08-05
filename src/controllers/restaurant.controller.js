const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const apiFeatures = require("../../utils/ApiFeatures");
const redis = require("../../config/redis");
const { setCache, clearCache, getCache } = require("../../utils/clearCache");

const getAllRestaurants = asyncHandler(async (req, res) => {
  const features = new apiFeatures(req.query)
    .paginate()
    .search(["name", "description"])
    .filter({
      fields: ["status"],
    })
    .sort(["createdAt", "name", "status"]);

  const where = {
    ...features.where,
    deletedAt: null,
    status: "ACTIVE",
  };
  const cacheKey = `restaurants:${JSON.stringify(req.query)}`;

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  const [restaurants, total] = await prisma.$transaction([
    prisma.restaurant.findMany({
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

        cuisines: {
          select: {
            cuisine: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.restaurant.count({
      where,
    }),
  ]);

  const response = {
    restaurants,
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

const getAllRestaurantAdmin = asyncHandler(async (req, res) => {
  const features = new apiFeatures(req.query)
    .paginate()
    .search(["name", "description"])
    .filter({
      fields: ["status"],
    })
    .sort(["createdAt", "name", "status"]);

  const where = {
    ...features.where,
    deletedAt: null,
  };

  const [restaurants, total] = await prisma.$transaction([
    prisma.restaurant.findMany({
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

        cuisines: {
          select: {
            cuisine: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.restaurant.count({
      where,
    }),
  ]);

  res.status(200).json({
    restaurants,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.ceil(total / features.pagination.limit),
    },
  });
});

const getMyRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      ownerId: req.user.id,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,

      cuisines: {
        select: {
          cuisine: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  res.status(200).json({
    restaurants,
  });
});

const getRestaurantById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id,
      deletedAt: null,
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      cuisines: {
        select: {
          cuisine: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }
  res.status(200).json({
    restaurant,
  });
});

const getRestaurantByIdAdmin = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,

      cuisines: {
        select: {
          cuisine: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }
  res.status(200).json({
    restaurant,
  });
});

const createRestaurant = asyncHandler(async (req, res, next) => {
  const { name, description, cuisines } = req.body;
  const existingRestaurant = await prisma.restaurant.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      deletedAt: null,
    },
  });

  if (existingRestaurant) {
    return next(new ErrorHandler("Restaurant already exists", 409));
  }
  const existingCuisines = await prisma.cuisine.findMany({
    where: {
      id: {
        in: cuisines,
      },
    },
  });

  if (existingCuisines.length !== cuisines.length) {
    return next(new ErrorHandler("One or more cuisines are invalid", 400));
  }
  const restaurant = await prisma.restaurant.create({
    data: {
      ownerId: req.user.id,
      name,
      description,
      status: "PENDING",

      cuisines: {
        create: cuisines.map((id) => ({
          cuisine: {
            connect: { id },
          },
        })),
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      cuisines: {
        select: {
          cuisine: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  await clearCache("restaurants:*");

  res.status(201).json({
    message: "Restaurant created successfully",
    restaurant,
  });
});

const updateRestaurant = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const updates = {};

  if (name) updates.name = name;
  if (description) updates.description = description;

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No data provided", 400));
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id,
      ownerId: req.user.id,
      deletedAt: null,
    },
  });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  if (name) {
    const existingName = await prisma.restaurant.findFirst({
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
      return next(new ErrorHandler("Restaurant name already exists", 409));
    }
  }

  const updatedRestaurant = await prisma.restaurant.update({
    where: {
      id: restaurant.id,
    },
    data: updates,
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      cuisines: {
        select: {
          cuisine: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  await clearCache("restaurants:*");

  res.status(201).json({
    message: "Restaurant Updated successfully",
    restaurant,
  });
});

const updateRestaurantStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }
  if (restaurant.status === status) {
    return next(new ErrorHandler("Restaurant already has this status", 400));
  }

  const updatedRestaurant = await prisma.restaurant.update({
    where: {
      id: restaurant.id,
    },
    data: {
      status,
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,

      cuisines: {
        select: {
          cuisine: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  await clearCache("restaurants:*");

  res.status(201).json({
    message: "Restaurant status Updated successfully",
    restaurant,
  });
});

const deleteRestaurant = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  await prisma.$transaction([
    prisma.restaurant.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    }),
    prisma.branch.updateMany({
      where: {
        restaurantId: id,
      },
      data: {
        deletedAt: new Date(),
      },
    }),
  ]);

  await clearCache("restaurants:*");

  res.status(201).json({
    message: "Restaurant Deleted successfully",
    restaurant,
  });
});

module.exports = {
  getAllRestaurants,
  getAllRestaurantAdmin,
  getRestaurantById,
  getRestaurantByIdAdmin,
  createRestaurant,
  updateRestaurant,
  updateRestaurantStatus,
  deleteRestaurant,
  getMyRestaurants,
};
