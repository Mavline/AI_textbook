// File: server/src/services/cacheService.js

class CacheService {
    constructor() {
      this.cache = new Map();
    }
  
    set(key, value) {
      const item = {
        value,
        timestamp: Date.now()
      };
      this.cache.set(key, item);
      this.cleanOldEntries();
    }
  
    get(key) {
      const item = this.cache.get(key);
      if (item) {
        return item.value;
      }
      return null;
    }
  
    cleanOldEntries() {
      const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      for (let [key, item] of this.cache.entries()) {
        if (item.timestamp < monthAgo) {
          this.cache.delete(key);
        }
      }
    }
  }
  
  module.exports = new CacheService();
  