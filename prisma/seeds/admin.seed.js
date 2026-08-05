const bcrypt = require("bcrypt");
const prisma = require("../../utils/prisma");

module.exports = async () => {
  const password = await bcrypt.hash("12345678", 10);

  const users = [
    {
      fullName: "System Admin",
      email: "admin@test.com",
      phone: "01000000001",
      password,
      role: "ADMIN",
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
    },

    {
      fullName: "Restaurant Owner",
      email: "owner@test.com",
      phone: "01000000002",
      password,
      role: "RESTAURANT_OWNER",
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
    },

    {
      fullName: "Driver One",
      email: "driver@test.com",
      phone: "01000000003",
      password,
      role: "DRIVER",
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
    },

    {
      fullName: "Customer One",
      email: "customer@test.com",
      phone: "01000000004",
      password,
      role: "CUSTOMER",
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: user,
    });
  }

  console.log(" Users Seeded");
};
