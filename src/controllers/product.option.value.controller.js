const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");

const createProductOptionValue = asyncHandler(async (req, res, next) => {
  const { productOptionId } = req.params;
  const { name, extraPrice } = req.body;

  const productOption = await prisma.productOption.findFirst({
    where: {
      id: productOptionId,
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
    },
  });

  if (!productOption) {
    return next(new ErrorHandler("Product option not found", 404));
  }

  const existingValue = await prisma.optionValue.findFirst({
    where: {
      productOptionId,
      deletedAt: null,
      name: {
        equals: name.trim(),
        mode: "insensitive",
      },
    },
  });

  if (existingValue) {
    return next(new ErrorHandler("Value already exists", 409));
  }

  const value = await prisma.optionValue.create({
    data: {
      productOptionId,
      name: name.trim(),
      extraPrice,
    },
    select: {
      id: true,
      name: true,
      extraPrice: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(201).json({
    message: "Value created successfully",
    value,
  });
});

const getProductOptionValues = asyncHandler(async (req, res, next) => {
  const { productOptionId } = req.params;

  const productOption = await prisma.productOption.findFirst({
    where: {
      id: productOptionId,
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
      name: true,
    },
  });

  if (!productOption) {
    return next(new ErrorHandler("Product option not found", 404));
  }

  const values = await prisma.optionValue.findMany({
    where: {
      productOptionId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      extraPrice: true,

      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    option: productOption,
    total: values.length,
    values,
  });
});

const getProductOptionValue = asyncHandler(async (req, res, next) => {
  const { productOptionId, valueId } = req.params;

  const productOption = await prisma.productOption.findFirst({
    where: {
      id: productOptionId,
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
      name: true,
      isRequired: true,
      maxSelections: true,
    },
  });

  if (!productOption) {
    return next(new ErrorHandler("Product option not found", 404));
  }

  const value = await prisma.optionValue.findFirst({
    where: {
      id: valueId,
      productOptionId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      extraPrice: true,

      createdAt: true,
      updatedAt: true,
    },
  });

  if (!value) {
    return next(new ErrorHandler("Value not found", 404));
  }

  res.status(200).json({
    option: productOption,
    value,
  });
});

const updateProductOptionValue = asyncHandler(async (req, res, next) => {
  const { productOptionId, valueId } = req.params;
  const { name, extraPrice } = req.body;

  const updates = {};

  if (name !== undefined) updates.name = name.trim();
  if (extraPrice !== undefined) updates.extraPrice = extraPrice;

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No data provided", 400));
  }

  const productOption = await prisma.productOption.findFirst({
    where: {
      id: productOptionId,
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
    },
  });

  if (!productOption) {
    return next(new ErrorHandler("Product option not found", 404));
  }

  const value = await prisma.optionValue.findFirst({
    where: {
      id: valueId,
      productOptionId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!value) {
    return next(new ErrorHandler("Value not found", 404));
  }

  if (updates.name) {
    const existingValue = await prisma.optionValue.findFirst({
      where: {
        productOptionId,
        deletedAt: null,
        NOT: {
          id: valueId,
        },
        name: {
          equals: updates.name,
          mode: "insensitive",
        },
      },
    });

    if (existingValue) {
      return next(new ErrorHandler("Value already exists", 409));
    }
  }
  const updatedValue = await prisma.optionValue.update({
    where: {
      id: valueId,
    },
    data: updates,
    select: {
      id: true,
      name: true,
      extraPrice: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    message: "Value updated successfully",
    option: {
      id: productOption.id,
    },
    value: updatedValue,
  });
});

const deleteOptionValue = asyncHandler(async (req, res, next) => {
  const { productOptionId, valueId } = req.params;

  const productOption = await prisma.productOption.findFirst({
    where: {
      id: productOptionId,
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
    },
  });

  if (!productOption) {
    return next(new ErrorHandler("Product option not found", 404));
  }

  const value = await prisma.optionValue.findFirst({
    where: {
      id: valueId,
      productOptionId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!value) {
    return next(new ErrorHandler("Value not found", 404));
  }

  await prisma.optionValue.update({
    where: {
      id: valueId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  res.status(200).json({
    message: "Value deleted successfully",
  });
});

module.exports = {
  createProductOptionValue,
  getProductOptionValues,
  getProductOptionValue,
  updateProductOptionValue,
  deleteOptionValue,
};
