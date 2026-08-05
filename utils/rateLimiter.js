const { RateLimiterRedis } = require("rate-limiter-flexible");
const redis = require("../config/redis");

const loginLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "login",
  points: 5,
  duration: 900,
});

module.exports = {
  loginLimiter,
};
