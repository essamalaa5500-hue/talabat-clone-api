const prisma = require("../../utils/prisma");

module.exports = async () => {
  const restaurants = await prisma.restaurant.findMany();

  const categories = ["Sandwiches", "Meals", "Drinks", "Desserts", "Sides"];

  for (const restaurant of restaurants) {
    for (const name of categories) {
      await prisma.menuCategory.upsert({
        where: {
          restaurantId_name: {
            restaurantId: restaurant.id,
            name,
          },
        },
        update: {},
        create: {
          restaurantId: restaurant.id,
          name,
        },
      });
    }
  }

  console.log(" Menu Categories Seeded");
};
