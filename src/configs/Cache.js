const Redis = require("ioredis")

const cache = new Redis(6379, process.env.REDIS_HOST);

module.exports = cache