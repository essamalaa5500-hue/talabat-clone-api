const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const ApiFeatures = require("../../utils/ApiFeatures");
const { setCache, clearCache, getCache } = require("../../utils/clearCache");

const getMyProfile = asyncHandler(async (req, res, next) => {
  const driver = await prisma.driver.findFirst({
    where: {
      userId: req.user.id,
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          avatar: true,
        },
      },

      _count: {
        select: {
          deliveries: true,
          driverReviews: true,
        },
      },
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  return res.status(200).json({
    driver,
  });
});

const updateMyProfile = asyncHandler(async (req, res, next) => {
  const { fullName, phone, avatar } = req.body;

  const updates = {};

  if (fullName) updates.fullName = fullName;
  if (phone) updates.phone = phone;
  if (avatar) updates.avatar = avatar;

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No data provided", 400));
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (phone) {
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone,
        NOT: {
          id: req.user.id,
        },
      },
    });

    if (existingPhone) {
      return next(new ErrorHandler("Phone already exists", 409));
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: updates,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      avatar: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  await clearCache("users:*");

  res.status(200).json({
    message: "User updated successfully",
    user: updatedUser,
  });
});

const changeStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!["ONLINE", "OFFLINE"].includes(status)) {
    return next(new ErrorHandler("Invalid status", 400));
  }

  const driverStatus = status === "ONLINE" ? "AVAILABLE" : "OFFLINE";

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.role !== "DRIVER") {
    return next(new ErrorHandler("Only drivers can change this status", 403));
  }

  const updatedDriver = await prisma.driver.update({
    where: {
      userId: req.user.id,
    },
    data: {
      status: driverStatus,
    },
  });

  await clearCache("drivers:*");

  return res.status(200).json({
    message: "Driver status updated successfully",
    driver: updatedDriver,
  });
});

const getAllDrivers = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(req.query)
    .paginate()
    .filter({
      fields: ["status", "vehicleType"],
    })
    .sort(["createdAt", "status"]);

  const where = {
    deletedAt: null,
    status: "AVAILABLE",
    ...features.where,
  };

  const [drivers, total] = await prisma.$transaction([
    prisma.driver.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      select: {
        id: true,
        nationalId: true,
        licenseNumber: true,
        vehicleType: true,
        vehiclePlateNumber: true,
        status: true,
        rating: true,
        createdAt: true,
        updatedAt: true,

        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    }),

    prisma.driver.count({
      where,
    }),
  ]);

  res.status(200).json({
    drivers,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.ceil(total / features.pagination.limit),
    },
  });
});

const getDriverById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const driver = await prisma.driver.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          avatar: true,
          status: true,
          role: true,
          isEmailVerified: true,
          emailVerifiedAt: true,
          phoneVerifiedAt: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      nationalId: true,
      licenseNumber: true,
      vehicleType: true,
      vehiclePlateNumber: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }
  res.status(200).json({
    driver,
  });
});

const updateDriver = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    fullName,
    phone,
    avatar,
    nationalId,
    licenseNumber,
    vehicleType,
    vehiclePlateNumber,
    status,
  } = req.body;

  const driver = await prisma.driver.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      user: true,
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  if (fullName) {
    const existingName = await prisma.user.findFirst({
      where: {
        fullName: {
          equals: fullName,
          mode: "insensitive",
        },
        NOT: {
          id: driver.userId,
        },
      },
    });

    if (existingName) {
      return next(new ErrorHandler("Full name already exists", 409));
    }
  }

  if (phone) {
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone,
        NOT: {
          id: driver.userId,
        },
      },
    });

    if (existingPhone) {
      return next(new ErrorHandler("Phone already exists", 409));
    }
  }

  if (nationalId) {
    const existingNationalId = await prisma.driver.findFirst({
      where: {
        nationalId,
        NOT: {
          id,
        },
      },
    });

    if (existingNationalId) {
      return next(new ErrorHandler("National ID already exists", 409));
    }
  }

  if (licenseNumber) {
    const existingLicense = await prisma.driver.findFirst({
      where: {
        licenseNumber,
        NOT: {
          id,
        },
      },
    });

    if (existingLicense) {
      return next(new ErrorHandler("License number already exists", 409));
    }
  }

  if (vehiclePlateNumber) {
    const existingPlate = await prisma.driver.findFirst({
      where: {
        vehiclePlateNumber,
        NOT: {
          id,
        },
      },
    });

    if (existingPlate) {
      return next(new ErrorHandler("Vehicle plate already exists", 409));
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: driver.userId,
      },
      data: {
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
      },
    });

    await tx.driver.update({
      where: {
        id,
      },
      data: {
        ...(nationalId && { nationalId }),
        ...(licenseNumber && { licenseNumber }),
        ...(vehicleType && { vehicleType }),
        ...(vehiclePlateNumber && { vehiclePlateNumber }),
        ...(status && { status }),
      },
    });
  });

  const updatedDriver = await prisma.driver.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          avatar: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  await clearCache("drivers:*");

  res.status(200).json({
    message: "Driver updated successfully",
    driver: updatedDriver,
  });
});

const deleteDriver = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const driver = await prisma.driver.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  await prisma.$transaction(async (tx) => {
    await tx.driver.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        status: "OFFLINE",
      },
    });

    await tx.user.update({
      where: {
        id: driver.userId,
      },
      data: {
        deletedAt: new Date(),
        status: "SUSPENDED",
      },
    });
  });

  await clearCache("drivers:*");

  return res.status(200).json({
    message: "Driver deleted successfully",
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  changeStatus,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
