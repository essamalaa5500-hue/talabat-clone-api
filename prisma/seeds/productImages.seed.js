const prisma = require("../../utils/prisma");

module.exports = async () => {
  const products = await prisma.product.findMany();

  for (const product of products) {
    await prisma.productImage.upsert({
      where: {
        productId_url: {
          productId: product.id,
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        },
      },
      update: {},
      create: {
        productId: product.id,
        publicId: "sample-product",
        url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        type: "MAIN",
      },
    });
  }

  console.log("Product Images Seeded");
};
