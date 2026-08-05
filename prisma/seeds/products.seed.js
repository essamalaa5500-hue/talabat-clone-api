const prisma = require("../../utils/prisma");

module.exports = async () => {
  const meals = await prisma.menuCategory.findFirst({
    where: {
      name: "Meals",
    },
  });

  const sandwiches = await prisma.menuCategory.findFirst({
    where: {
      name: "Sandwiches",
    },
  });

  const drinks = await prisma.menuCategory.findFirst({
    where: {
      name: "Drinks",
    },
  });

  const desserts = await prisma.menuCategory.findFirst({
    where: {
      name: "Desserts",
    },
  });

  const products = [
    {
      name: "Zinger Meal",
      description: "Crispy chicken meal with fries and drink",
      menuCategoryId: meals.id,
    },
    {
      name: "Mighty Zinger",
      description: "Double crispy chicken sandwich",
      menuCategoryId: sandwiches.id,
    },
    {
      name: "Twister",
      description: "Chicken wrap with special sauce",
      menuCategoryId: sandwiches.id,
    },
    {
      name: "Pepsi",
      description: "Soft Drink",
      menuCategoryId: drinks.id,
    },
    {
      name: "Mirinda",
      description: "Orange Soft Drink",
      menuCategoryId: drinks.id,
    },
    {
      name: "Chocolate Cake",
      description: "Rich chocolate dessert",
      menuCategoryId: desserts.id,
    },
  ];

  for (const product of products) {
    const exists = await prisma.product.findFirst({
      where: {
        name: product.name,
        menuCategoryId: product.menuCategoryId,
      },
    });

    if (!exists) {
      await prisma.product.create({
        data: product,
      });
    }
  }

  console.log(" Products Seeded");
};
