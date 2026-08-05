const prisma = require("../../utils/prisma");

module.exports = async () => {
  const products = await prisma.product.findMany();

  const options = [
    {
      name: "Size",
      isRequired: true,
      maxSelections: 1,
    },
    {
      name: "Extras",
      isRequired: false,
      maxSelections: 3,
    },
  ];

  for (const product of products) {
    for (const option of options) {
      await prisma.productOption.upsert({
        where: {
          productId_name: {
            productId: product.id,
            name: option.name,
          },
        },
        update: {},
        create: {
          productId: product.id,
          name: option.name,
          isRequired: option.isRequired,
          maxSelections: option.maxSelections,
        },
      });
    }
  }

  console.log(" Product Options Seeded");
};
