const prisma = require("../../utils/prisma");

module.exports = async () => {
  const user = await prisma.user.findFirst({
    where: {
      role: "DRIVER",
    },
  });

  if (!user) {
    throw new Error("No driver user found. Run users seed first.");
  }

  const exists = await prisma.driver.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (exists) {
    console.log("Driver already exists");
    return;
  }

  await prisma.driver.create({
    data: {
      userId: user.id,
      nationalId: "29801011234567",
      licenseNumber: "LIC-0001",
      vehicleType: "MOTORCYCLE",
      vehiclePlateNumber: "ABC-1234",
      status: "OFFLINE",
      rating: 5.0,
    },
  });

  console.log(" Driver Seeded");
};
