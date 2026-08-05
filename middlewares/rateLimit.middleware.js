const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redis = require("../config/redis");

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    status: 429,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.sendCommand(args),
  }),
});

module.exports = loginRateLimit;
