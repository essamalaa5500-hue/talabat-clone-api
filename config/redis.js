const { createClient } = require("redis");

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("connect", () => {
  console.log("Redis Connected");
});

redis.on("ready", () => {
  console.log("Redis Ready");
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

(async () => {
  try {
    await redis.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

module.exports = redis;
