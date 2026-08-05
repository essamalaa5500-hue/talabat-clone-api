const prisma = require("../../utils/prisma");

module.exports = async () => {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
    },
  });

  const cuisines = await prisma.cuisine.findMany({
    select: {
      id: true,
    },
  });

  if (!restaurants.length || !cuisines.length) {
    console.log("No restaurants or cuisines found");
    return;
  }

  for (const restaurant of restaurants) {
    const randomCuisines = cuisines.sort(() => 0.5 - Math.random()).slice(0, 3);

    for (const cuisine of randomCuisines) {
      await prisma.restaurantCuisine.upsert({
        where: {
          restaurantId_cuisineId: {
            restaurantId: restaurant.id,
            cuisineId: cuisine.id,
          },
        },
        update: {},
        create: {
          restaurantId: restaurant.id,
          cuisineId: cuisine.id,
        },
      });
    }
  }

  console.log("Restaurant Cuisines Seeded");
};
