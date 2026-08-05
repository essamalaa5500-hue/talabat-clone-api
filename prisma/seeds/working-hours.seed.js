const prisma = require("../../utils/prisma");

module.exports = async () => {
  const branches = await prisma.branch.findMany();

  const workingHours = [
    { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "23:00" },
    { dayOfWeek: "TUESDAY", startTime: "09:00", endTime: "23:00" },
    { dayOfWeek: "WEDNESDAY", startTime: "09:00", endTime: "23:00" },
    { dayOfWeek: "THURSDAY", startTime: "09:00", endTime: "23:00" },
    { dayOfWeek: "FRIDAY", startTime: "09:00", endTime: "23:59" },
    { dayOfWeek: "SATURDAY", startTime: "09:00", endTime: "23:59" },
    { dayOfWeek: "SUNDAY", startTime: "09:00", endTime: "23:00" },
  ];

  for (const branch of branches) {
    for (const hour of workingHours) {
      await prisma.workingHour.upsert({
        where: {
          branchId_dayOfWeek: {
            branchId: branch.id,
            dayOfWeek: hour.dayOfWeek,
          },
        },
        update: {},
        create: {
          branchId: branch.id,
          dayOfWeek: hour.dayOfWeek,
          startTime: hour.startTime,
          endTime: hour.endTime,
        },
      });
    }
  }

  console.log("Working Hours Seeded");
};
