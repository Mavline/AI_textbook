// File: server/src/services/cacheService.js

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  set(sessionId, key, value) {
    const item = {
      value,
      timestamp: Date.now()
    };
    if (!this.cache.has(sessionId)) {
      this.cache.set(sessionId, new Map());
    }
    this.cache.get(sessionId).set(key, item);
    this.cleanOldEntries(sessionId);
  }

  get(sessionId, key) {
    const session = this.cache.get(sessionId);
    if (session) {
      const item = session.get(key);
      if (item) {
        return item.value;
      }
    }
    return null;
  }

  cleanOldEntries(sessionId) {
    const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    if (this.cache.has(sessionId)) {
      for (let [key, item] of this.cache.get(sessionId).entries()) {
        if (item.timestamp < monthAgo) {
          this.cache.get(sessionId).delete(key);
        }
      }
    }
  }

  deleteSession(sessionId) {
    this.cache.delete(sessionId);
  }
}

module.exports = new CacheService();
