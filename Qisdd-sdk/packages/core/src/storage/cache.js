"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
// QISDD-SDK Storage: Cache
var Cache = /** @class */ (function () {
    function Cache(config) {
        this.timeouts = new Map();
        // Initialize cache (Redis, in-memory, etc.)
    }
    // Get a value from cache
    Cache.prototype.get = function (key) {
        return this.cache.get(key);
    };
    // Set a value in cache
    Cache.prototype.set = function (key, value, ttl) {
        var _this = this;
        this.cache.set(key, value);
        if (ttl) {
            if (this.timeouts.has(key))
                clearTimeout(this.timeouts.get(key));
            var timeout = setTimeout(function () {
                _this.cache.delete(key);
                _this.timeouts.delete(key);
            }, ttl * 1000);
            this.timeouts.set(key, timeout);
        }
    };
    // Delete a value from cache
    Cache.prototype.delete = function (key) {
        this.cache.delete(key);
        if (this.timeouts.has(key)) {
            clearTimeout(this.timeouts.get(key));
            this.timeouts.delete(key);
        }
        else {
            this.console.error("has not deleted yet");
        }
    };
    return Cache;
}());
exports.Cache = Cache;
