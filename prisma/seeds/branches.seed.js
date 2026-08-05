const prisma = require("../../utils/prisma");

module.exports = async () => {
  const restaurants = await prisma.restaurant.findMany();

  let index = 1;

  for (const restaurant of restaurants) {
    const exists = await prisma.branch.findFirst({
      where: {
        restaurantId: restaurant.id,
      },
    });

    if (exists) continue;

    await prisma.branch.create({
      data: {
        restaurantId: restaurant.id,
        name: `Main Branch ${index}`,
        description: `Main branch for Restaurant ${index}`,
        phone: `01000000${100 + index}`,
        deliveryFee: 30,
        minimumOrderAmount: 100,
        averageDeliveryTime: 45,
        status: "ACTIVE",
      },
    });

    index++;
  }

  console.log("Branches Seeded");
};
