const prisma = require("../../utils/prisma");

module.exports = async () => {
  const owners = await prisma.user.findMany({
    where: {
      role: "RESTAURANT_OWNER",
    },
  });

  let index = 1;

  for (const owner of owners) {
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        ownerId: owner.id,
      },
    });

    if (!restaurant) {
      await prisma.restaurant.create({
        data: {
          ownerId: owner.id,
          name: `Restaurant ${index}`,
          description: `Description for Restaurant ${index}`,
          status: "ACTIVE",
        },
      });
    }

    index++;
  }

  console.log(" Restaurants Seeded");
};
