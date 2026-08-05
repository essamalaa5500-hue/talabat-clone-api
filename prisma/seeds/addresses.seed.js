const prisma = require("../../utils/prisma");
const { Prisma } = require("@prisma/client");

module.exports = async () => {
  const branches = await prisma.branch.findMany();

  let index = 1;

  for (const branch of branches) {
    await prisma.branchAddress.upsert({
      where: {
        branchId: branch.id,
      },
      update: {},
      create: {
        branchId: branch.id,
        country: "Egypt",
        city: "Cairo",
        area: `Area ${index}`,
        street: `Street ${index}`,
        building: `${10 + index}`,
        floor: `${1 + index}`,
        apartment: `${100 + index}`,
        latitude: new Prisma.Decimal(30.04442 + index * 0.001),
        longitude: new Prisma.Decimal(31.235712 + index * 0.001),
      },
    });

    index++;
  }

  console.log("Branch Addresses Seeded");
};
