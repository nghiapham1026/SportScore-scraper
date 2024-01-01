const NodeCache = require('node-cache');

class Cache {
  constructor(ttl = 60 * 60 * 24) {
    // TTL set to 24 hours
    this.cache = new NodeCache({ stdTTL: ttl });
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    this.cache.set(key, value);
  }
}

module.exports = new Cache(); // Export an instance of the cache
