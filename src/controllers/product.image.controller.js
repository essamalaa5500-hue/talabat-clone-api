const asyncHandler = require("express-async-handler");
const prisma = require("../../utils/prisma");
const ErrorHandler = require("../../utils/ErrorHandler");
const cloudinary = require("../../utils/cloudinary");
const streamifier = require("streamifier");
const notificationQueue = require("../../queues/notification.queue");
const { sendNotification } = require("../../services/notification.service");

const uploadImage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!req.file) {
    return next(new ErrorHandler("No image provided", 400));
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

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "talabat/products",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });

  const uploadedImage = await prisma.productImage.create({
    data: {
      productId: id,
      url: result.secure_url,
      publicId: result.public_id,
      type: "GALLERY",
    },
    select: {
      id: true,
      url: true,
      publicId: true,
      type: true,
      createdAt: true,
    },
  });
  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    type: "PRODUCT_IMAGE_UPLOAD",
    title: "Product Image Uploaded",
    body: "Your product image has been uploaded.",
  });

  res.status(201).json({
    message: "Image uploaded successfully",
    image: uploadedImage,
  });
});

const getProductImages = asyncHandler(async (req, res, next) => {
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
    select: {
      id: true,
      name: true,
      images: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          url: true,
          publicId: true,
          type: true,
          createdAt: true,
        },
      },
    },
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    product: {
      id: product.id,
      name: product.name,
    },
    total: product.images.length,
    images: product.images,
  });
});

const deleteProductImage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const image = await prisma.productImage.findFirst({
    where: {
      id,
      deletedAt: null,
      type: "GALLERY",
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
      publicId: true,
    },
  });

  if (!image) {
    return next(new ErrorHandler("Image not found", 404));
  }

  const result = await cloudinary.uploader.destroy(image.publicId);

  if (result.result !== "ok") {
    return next(
      new ErrorHandler("Failed to delete image from Cloudinary", 500),
    );
  }

  await prisma.productImage.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    type: "PRODUCT_IMAGE_UPDATE",
    title: "Product Image Updated",
    body: "Your product image has been updated.",
  });

  res.status(200).json({
    message: "Image deleted successfully",
  });
});

const setMainImage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const image = await prisma.productImage.findFirst({
    where: {
      id,
      deletedAt: null,
      type: "GALLERY",
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
      type: true,
    },
  });

  if (!image) {
    return next(new ErrorHandler("Image not found", 404));
  }

  if (image.type === "MAIN") {
    return next(new ErrorHandler("Image is already the main image", 400));
  }

  const [, mainImage] = await prisma.$transaction([
    prisma.productImage.updateMany({
      where: {
        productId: image.productId,
        type: "MAIN",
        deletedAt: null,
      },
      data: {
        type: "GALLERY",
      },
    }),

    prisma.productImage.update({
      where: {
        id,
      },
      data: {
        type: "MAIN",
      },
      select: {
        id: true,
        url: true,
        publicId: true,
        type: true,
      },
    }),
  ]);
  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    type: "PRODUCT_IMAGE_UPDATE",
    title: "Product Image Updated",
    body: "Your product image has been updated.",
  });

  res.status(200).json({
    message: "Main image updated successfully",
    image: mainImage,
  });
});

module.exports = {
  uploadImage,
  getProductImages,
  deleteProductImage,
  setMainImage,
};
