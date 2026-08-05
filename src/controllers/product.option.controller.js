const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");

const createProductOption = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { name, isRequired, maxSelections } = req.body;

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
    select: {
      id: true,
    },
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const existingOption = await prisma.productOption.findFirst({
    where: {
      productId,
      name: {
        equals: name.trim(),
        mode: "insensitive",
      },
      deletedAt: null,
    },
  });

  if (existingOption) {
    return next(new ErrorHandler("Option already exists", 409));
  }

  const option = await prisma.productOption.create({
    data: {
      productId,
      name: name.trim(),
      isRequired,
      maxSelections,
    },
    select: {
      id: true,
      name: true,
      isRequired: true,
      maxSelections: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(201).json({
    message: "Option created successfully",
    option,
  });
});

const getProductOptions = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
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
    select: {
      id: true,
    },
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const options = await prisma.productOption.findMany({
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
      isRequired: true,
      maxSelections: true,

      values: {
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          extraPrice: true,
        },
      },

      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    total: options.length,
    options,
  });
});

const getProductOption = asyncHandler(async (req, res, next) => {
  const { productId, optionId } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
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
    select: {
      id: true,
    },
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const option = await prisma.productOption.findFirst({
    where: {
      id: optionId,
      productId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      isRequired: true,
      maxSelections: true,

      values: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          name: true,
          extraPrice: true,
        },
      },

      createdAt: true,
      updatedAt: true,
    },
  });

  if (!option) {
    return next(new ErrorHandler("Option not found", 404));
  }

  res.status(200).json({
    option,
  });
});

const updateProductOption = asyncHandler(async (req, res, next) => {
  const { productId, optionId } = req.params;
  const { name, isRequired, maxSelections } = req.body;

  const updates = {};

  if (name !== undefined) updates.name = name.trim();
  if (isRequired !== undefined) updates.isRequired = isRequired;
  if (maxSelections !== undefined) updates.maxSelections = maxSelections;

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No data provided", 400));
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
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
    select: {
      id: true,
    },
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const option = await prisma.productOption.findFirst({
    where: {
      id: optionId,
      productId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!option) {
    return next(new ErrorHandler("Option not found", 404));
  }

  if (name !== undefined) {
    const existingOption = await prisma.productOption.findFirst({
      where: {
        productId,
        deletedAt: null,
        NOT: {
          id: optionId,
        },
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingOption) {
      return next(new ErrorHandler("Option already exists", 409));
    }
  }

  const updatedOption = await prisma.productOption.update({
    where: {
      id: optionId,
    },
    data: updates,
    select: {
      id: true,
      name: true,
      isRequired: true,
      maxSelections: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    message: "Option updated successfully",
    option: updatedOption,
  });
});

const deleteProductOption = asyncHandler(async (req, res, next) => {
  const { productId, optionId } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
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
    select: {
      id: true,
    },
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const option = await prisma.productOption.findFirst({
    where: {
      id: optionId,
      productId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!option) {
    return next(new ErrorHandler("Option not found", 404));
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.optionValue.updateMany({
      where: {
        productOptionId: optionId,
        deletedAt: null,
      },
      data: {
        deletedAt: now,
      },
    }),

    prisma.productOption.update({
      where: {
        id: optionId,
      },
      data: {
        deletedAt: now,
      },
    }),
  ]);

  res.status(200).json({
    message: "Option deleted successfully",
  });
});
module.exports = {
  createProductOption,
  getProductOptions,
  getProductOption,
  updateProductOption,
  deleteProductOption,
};
