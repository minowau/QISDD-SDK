"use strict";
// QISDD-SDK Defense: Circuit Breaker
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
var CircuitBreaker = /** @class */ (function () {
    function CircuitBreaker(config) {
        this.brokenCircuits = new Set();
        // Initialize circuit breaker config
    }
    // Trigger a circuit break (stop data flow)
    CircuitBreaker.prototype.trigger = function (dataId, reason) {
        this.brokenCircuits.add(dataId);
        return true;
    };
    // Check if circuit is broken
    CircuitBreaker.prototype.isBroken = function (dataId) {
        return this.brokenCircuits.has(dataId);
    };
    return CircuitBreaker;
}());
exports.CircuitBreaker = CircuitBreaker;
