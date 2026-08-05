const { Worker } = require("bullmq");
const prisma = require("../utils/prisma");
const connection = require("../config/bullmq");
const { getIO } = require("../socket/socket");

new Worker(
  "notifications",
  async (job) => {
    if (job.name === "create-notification") {
      const notification = await prisma.notification.create({
        data: {
          userId: job.data.userId,
          orderId: job.data.orderId,
          type: job.data.type,
          title: job.data.title,
          body: job.data.body,
        },
      });

      const io = getIO();

      const sockets = await io.in(job.data.room).fetchSockets();

      console.log(
        `Room ${job.data.room} has ${sockets.length} connected socket(s)`,
      );

      io.to(job.data.room).emit("notification", notification);

      console.log(" Notification Created & Sent");
    }
  },
  {
    connection,
  },
);
