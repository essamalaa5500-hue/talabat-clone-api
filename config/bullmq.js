const { Redis } = require("ioredis");

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("BullMQ Redis Connected");
});

connection.on("error", (err) => {
  console.error("BullMQ Redis Error:", err);
});

module.exports = connection;
