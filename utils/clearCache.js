const redis = require("../config/redis");

const getCache = async (key) => {
  const data = await redis.get(key);

  if (!data) return null;

  return JSON.parse(data);
};

const setCache = async (key, value, ttl = 300) => {
  await redis.set(key, JSON.stringify(value), {
    EX: ttl,
  });
};
const clearCache = async (pattern) => {
  const keys = [];

  for await (const batch of redis.scanIterator({
    MATCH: pattern,
  })) {
    keys.push(...batch);
  }

  console.log(keys);

  if (!keys.length) return;

  await redis.del(...keys);
};
module.exports = {
  getCache,
  setCache,
  clearCache,
};
