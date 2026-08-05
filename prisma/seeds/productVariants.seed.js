const prisma = require("../../utils/prisma");
const { Prisma } = require("@prisma/client");

module.exports = async () => {
  const products = await prisma.product.findMany();

  const variants = [
    {
      product: "Zinger Meal",
      items: [
        {
          name: "Regular",
          price: "180.00",
        },
        {
          name: "Large",
          price: "220.00",
        },
      ],
    },

    {
      product: "Mighty Zinger",
      items: [
        {
          name: "Regular",
          price: "140.00",
        },
        {
          name: "Large",
          price: "170.00",
        },
      ],
    },

    {
      product: "Twister",
      items: [
        {
          name: "Regular",
          price: "120.00",
        },
      ],
    },

    {
      product: "Pepsi",
      items: [
        {
          name: "Can",
          price: "20.00",
        },
        {
          name: "1 Liter",
          price: "35.00",
        },
      ],
    },

    {
      product: "Chocolate Cake",
      items: [
        {
          name: "Piece",
          price: "60.00",
        },
      ],
    },
  ];

  for (const variant of variants) {
    const product = products.find((p) => p.name === variant.product);

    if (!product) continue;

    for (const item of variant.items) {
      await prisma.productVariant.upsert({
        where: {
          productId_name: {
            productId: product.id,
            name: item.name,
          },
        },
        update: {},
        create: {
          productId: product.id,
          name: item.name,
          price: new Prisma.Decimal(item.price),
        },
      });
    }
  }

  console.log(" Product Variants Seeded");
};
