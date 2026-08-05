const prisma = require("../../utils/prisma");
const { Prisma } = require("@prisma/client");

module.exports = async () => {
  const coupons = [
    {
      code: "WELCOME10",
      name: "Welcome Offer",
      description: "10% discount for new customers",
      type: "PERCENTAGE",
      value: "10.00",
      minimumOrderAmount: "100.00",
      maximumDiscount: "50.00",
      usageLimit: 1000,
      startsAt: new Date(),
      expiresAt: new Date("2027-01-01"),
      isActive: true,
    },

    {
      code: "SAVE50",
      name: "Save 50",
      description: "50 EGP discount",
      type: "FIXED_AMOUNT",
      value: "50.00",
      minimumOrderAmount: "300.00",
      maximumDiscount: "50.00",
      usageLimit: 500,
      startsAt: new Date(),
      expiresAt: new Date("2027-01-01"),
      isActive: true,
    },

    {
      code: "FREEDELIVERY",
      name: "Free Delivery",
      description: "Delivery discount",
      type: "FIXED_AMOUNT",
      value: "30.00",
      minimumOrderAmount: "150.00",
      maximumDiscount: "30.00",
      usageLimit: 300,
      startsAt: new Date(),
      expiresAt: new Date("2027-01-01"),
      isActive: true,
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: {
        code: coupon.code,
      },
      update: {},
      create: {
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: new Prisma.Decimal(coupon.value),
        minimumOrderAmount: new Prisma.Decimal(coupon.minimumOrderAmount),
        maximumDiscount: coupon.maximumDiscount
          ? new Prisma.Decimal(coupon.maximumDiscount)
          : null,
        usageLimit: coupon.usageLimit,
        startsAt: coupon.startsAt,
        expiresAt: coupon.expiresAt,
        isActive: coupon.isActive,
      },
    });
  }

  console.log(" Coupons Seeded");
};
