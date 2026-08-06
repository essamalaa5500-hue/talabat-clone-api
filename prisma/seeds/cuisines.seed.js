const prisma = require("../../utils/prisma");

module.exports = async () => {
  const cuisines = [
    "Pizza",
    "Burger",
    "Italian",
    "Chinese",
    "Seafood",
    "Desserts",
    "Grill",
    "Healthy",
    "Coffee",
    "Bakery",
  ];

  for (const name of cuisines) {
    await prisma.cuisine.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Cuisines Seeded");
};
