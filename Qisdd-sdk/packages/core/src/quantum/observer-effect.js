"use strict";
// QISDD-SDK Quantum: Observer Effect Implementation
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObserverEffect = exports.TransformationType = exports.QuantumStateType = void 0;
var QuantumStateType;
(function (QuantumStateType) {
    QuantumStateType["Healthy"] = "healthy";
    QuantumStateType["Poisoned"] = "poisoned";
    QuantumStateType["Degraded"] = "degraded";
    QuantumStateType["Collapsed"] = "collapsed";
})(QuantumStateType || (exports.QuantumStateType = QuantumStateType = {}));
var TransformationType;
(function (TransformationType) {
    TransformationType["LightPoison"] = "light_poison";
    TransformationType["ProgressivePoison"] = "progressive_poison";
    TransformationType["QuantumCollapse"] = "quantum_collapse";
})(TransformationType || (exports.TransformationType = TransformationType = {}));
var ObserverEffect = /** @class */ (function () {
    function ObserverEffect(threshold) {
        if (threshold === void 0) { threshold = 3; }
        this.state = QuantumStateType.Healthy;
        this.unauthorizedAttempts = 0;
        this.threshold = threshold;
    }
    // Triggered on unauthorized access
    ObserverEffect.prototype.onUnauthorizedAccess = function (dataId, context) {
        this.unauthorizedAttempts++;
        if (this.unauthorizedAttempts >= this.threshold) {
            this.state = QuantumStateType.Collapsed;
            return {
                stateChanged: true,
                newState: this.state,
                transformation: TransformationType.QuantumCollapse,
                reason: 'Threshold exceeded: quantum collapse triggered',
            };
        }
        else {
            this.state = QuantumStateType.Poisoned;
            return {
                stateChanged: true,
                newState: this.state,
                transformation: TransformationType.LightPoison,
                reason: 'Unauthorized access detected: data poisoned',
            };
        }
    };
    // Triggered on suspicious pattern
    ObserverEffect.prototype.onSuspiciousPattern = function (dataId, pattern) {
        this.state = QuantumStateType.Degraded;
        return {
            stateChanged: true,
            newState: this.state,
            transformation: TransformationType.ProgressivePoison,
            reason: 'Suspicious pattern detected: progressive degradation',
        };
    };
    // Triggered when threshold is exceeded
    ObserverEffect.prototype.onThresholdExceeded = function (dataId, metrics) {
        this.state = QuantumStateType.Collapsed;
        return {
            stateChanged: true,
            newState: this.state,
            transformation: TransformationType.QuantumCollapse,
            reason: 'Threshold exceeded: quantum collapse',
        };
    };
    // Get current state
    ObserverEffect.prototype.getState = function () {
        return this.state;
    };
    // Reset state (for testing or recovery)
    ObserverEffect.prototype.reset = function () {
        this.state = QuantumStateType.Healthy;
        this.unauthorizedAttempts = 0;
    };
    return ObserverEffect;
}());
exports.ObserverEffect = ObserverEffect;
