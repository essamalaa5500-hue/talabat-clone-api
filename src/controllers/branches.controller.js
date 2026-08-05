const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const ApiFeatures = require("../../utils/ApiFeatures");
const { setCache, clearCache, getCache } = require("../../utils/clearCache");

const createBranch = asyncHandler(async (req, res, next) => {
  const {
    restaurantId,
    name,
    description,
    phone,
    deliveryFee,
    minimumOrderAmount,
    averageDeliveryTime,
  } = req.body;
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
      ownerId: req.user.id,
      deletedAt: null,
    },
  });
  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }
  const existingPhone = await prisma.branch.findFirst({
    where: {
      phone,
      deletedAt: null,
    },
  });
  if (existingPhone) {
    return next(new ErrorHandler("Phone already exists", 409));
  }
  const existingBranch = await prisma.branch.findFirst({
    where: {
      restaurantId,
      name: {
        equals: name,
        mode: "insensitive",
      },
      deletedAt: null,
    },
  });
  if (existingBranch) {
    return next(new ErrorHandler("Branch already exists", 409));
  }
  if (restaurant.status !== "ACTIVE") {
    return next(
      new ErrorHandler(
        "You cannot create branches until the restaurant is approved",
        400,
      ),
    );
  }
  const branch = await prisma.branch.create({
    data: {
      name,
      description,
      phone,
      deliveryFee,
      minimumOrderAmount,
      averageDeliveryTime,
      restaurantId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      phone: true,
      deliveryFee: true,
      minimumOrderAmount: true,
      averageDeliveryTime: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  await clearCache("branches:*");
  res.status(201).json({
    message: "Branch created successfully",
    branch,
  });
});

const getBranchesAdmin = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(req.query)
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

  const [branches, total] = await prisma.$transaction([
    prisma.branch.findMany({
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

        restaurant: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    }),
    prisma.branch.count({
      where,
    }),
  ]);

  res.status(200).json({
    branches,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.ceil(total / features.pagination.limit),
    },
  });
});

const updateBranch = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    phone,
    deliveryFee,
    minimumOrderAmount,
    averageDeliveryTime,
  } = req.body;
  const updates = {};

  if (name) updates.name = name;
  if (description) updates.description = description;
  if (phone) updates.phone = phone;
  if (deliveryFee) updates.deliveryFee = deliveryFee;
  if (minimumOrderAmount) updates.minimumOrderAmount = minimumOrderAmount;
  if (averageDeliveryTime) updates.averageDeliveryTime = averageDeliveryTime;

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No data provided", 400));
  }

  const existingBranch = await prisma.branch.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!existingBranch) {
    return next(new ErrorHandler("Branch not found", 404));
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: existingBranch.restaurantId,
      ownerId: req.user.id,
      deletedAt: null,
    },
  });

  if (!restaurant) {
    return next(new ErrorHandler("You are not authorized", 403));
  }
  if (restaurant.status !== "ACTIVE") {
    return next(
      new ErrorHandler(
        "You cannot update branches until the restaurant is approved",
        403,
      ),
    );
  }
  if (phone) {
    const existingPhone = await prisma.branch.findFirst({
      where: {
        phone,
        deletedAt: null,
        NOT: {
          id,
        },
      },
    });

    if (existingPhone) {
      return next(new ErrorHandler("Phone already exists", 409));
    }
  }
  if (name) {
    const existingName = await prisma.branch.findFirst({
      where: {
        restaurantId: existingBranch.restaurantId,
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
      return next(new ErrorHandler("Branch name already exists", 409));
    }
  }
  const branch = await prisma.branch.update({
    where: {
      id,
    },
    data: updates,
    select: {
      id: true,
      name: true,
      description: true,
      phone: true,
      deliveryFee: true,
      minimumOrderAmount: true,
      averageDeliveryTime: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  await clearCache("branches:*");
  res.status(200).json({
    message: "Branch updated successfully",
    branch,
  });
});

const updateBranchStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const branch = await prisma.branch.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!branch) {
    return next(new ErrorHandler("Branch not found", 404));
  }
  if (branch.status === status) {
    return next(new ErrorHandler("Branch already has this status", 400));
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: branch.restaurantId,
      deletedAt: null,
    },
  });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  if (restaurant.status !== "ACTIVE") {
    return next(
      new ErrorHandler(
        "Cannot activate a branch of an inactive restaurant",
        400,
      ),
    );
  }

  const updatedBranch = await prisma.branch.update({
    where: {
      id: branch.id,
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

      restaurant: {
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  res.status(200).json({
    message: "Branch status updated successfully",
    branch: updatedBranch,
  });
});

const deleteBranch = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const branch = await prisma.branch.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!branch) {
    return next(new ErrorHandler("Branch not found", 404));
  }

  const activeOrders = await prisma.order.count({
    where: {
      branchId: id,
      status: {
        in: ["PENDING", "ACCEPTED", "PREPARING", "READY", "ON_THE_WAY"],
      },
    },
  });

  if (activeOrders > 0) {
    return next(
      new ErrorHandler("Cannot delete branch while it has active orders", 400),
    );
  }

  await prisma.branch.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
  await clearCache("branches:*");
  res.status(200).json({
    message: "Branch deleted successfully",
  });
});

const getMyBranches = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(req.query)
    .paginate()
    .search(["name", "description"])
    .filter({
      fields: ["status"],
    })
    .sort(["createdAt", "name", "status"]);

  const where = {
    ...features.where,
    deletedAt: null,
    restaurant: {
      ownerId: req.user.id,
    },
  };

  const [branches, total] = await prisma.$transaction([
    prisma.branch.findMany({
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

        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.branch.count({
      where,
    }),
  ]);

  res.status(200).json({
    branches,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.ceil(total / features.pagination.limit),
    },
  });
});

const getAllBranches = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(req.query)
    .paginate()
    .search(["name", "description"])
    .sort(["createdAt", "name", "status"]);

  const where = {
    ...features.where,
    deletedAt: null,
    status: "ACTIVE",
  };

  const cacheKey = `branches:${JSON.stringify(req.query)}`;

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  const [branches, total] = await prisma.$transaction([
    prisma.branch.findMany({
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

        restaurant: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    }),
    prisma.branch.count({
      where,
    }),
  ]);

  const response = {
    branches,
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

const getBranchById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const branch = await prisma.branch.findFirst({
    where: {
      id,
      deletedAt: null,
      status: "ACTIVE",

      restaurant: {
        status: "ACTIVE",
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

      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!branch) {
    return next(new ErrorHandler("Branch not found", 404));
  }
  res.status(200).json({
    branch,
  });
});

const getMyBranchById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const branch = await prisma.branch.findFirst({
    where: {
      id,
      deletedAt: null,
      restaurant: {
        ownerId: req.user.id,
        deletedAt: null,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,

      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!branch) {
    return next(new ErrorHandler("Branch not found", 404));
  }
  res.status(200).json({
    branch,
  });
});

const getBranchByIdAdmin = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const branch = await prisma.branch.findFirst({
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

      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!branch) {
    return next(new ErrorHandler("Branch not found", 404));
  }
  res.status(200).json({
    branch,
  });
});

module.exports = {
  getAllBranches,
  getBranchesAdmin,
  getMyBranches,
  getBranchById,
  getMyBranchById,
  getBranchByIdAdmin,
  createBranch,
  updateBranch,
  updateBranchStatus,
  deleteBranch,
};
