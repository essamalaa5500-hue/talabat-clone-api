const prisma = require("../../utils/prisma");
const { Prisma } = require("@prisma/client");

module.exports = async () => {
  const options = await prisma.productOption.findMany();

  for (const option of options) {
    let values = [];

    if (option.name === "Size") {
      values = [
        {
          name: "Small",
          extraPrice: "0.00",
        },
        {
          name: "Medium",
          extraPrice: "20.00",
        },
        {
          name: "Large",
          extraPrice: "40.00",
        },
      ];
    }

    if (option.name === "Extras") {
      values = [
        {
          name: "Extra Cheese",
          extraPrice: "15.00",
        },
        {
          name: "Extra Sauce",
          extraPrice: "10.00",
        },
        {
          name: "Fries",
          extraPrice: "30.00",
        },
      ];
    }

    for (const value of values) {
      await prisma.optionValue.upsert({
        where: {
          productOptionId_name: {
            productOptionId: option.id,
            name: value.name,
          },
        },
        update: {},
        create: {
          productOptionId: option.id,
          name: value.name,
          extraPrice: new Prisma.Decimal(value.extraPrice),
        },
      });
    }
  }

  console.log("Option Values Seeded");
};
