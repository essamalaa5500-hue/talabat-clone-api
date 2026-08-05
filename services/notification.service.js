const notificationQueue = require("../queues/notification.queue");

const sendNotification = async ({
  room,
  userId,
  orderId = null,
  type,
  title,
  body,
}) => {
  await notificationQueue.add("create-notification", {
    room,
    userId,
    orderId,
    type,
    title,
    body,
  });
};

module.exports = {
  sendNotification,
};
