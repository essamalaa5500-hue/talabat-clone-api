const { Redis } = require("ioredis");

const connection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log(" BullMQ Redis Connected");
});

connection.on("error", (err) => {
  console.error(" BullMQ Redis Error:", err);
});

module.exports = connection;
