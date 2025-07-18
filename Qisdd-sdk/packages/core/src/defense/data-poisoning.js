"use strict";
// QISDD-SDK Defense: Data Poisoning
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPoisoning = void 0;
var DataPoisoning = /** @class */ (function () {
    function DataPoisoning(config) {
        this.poisoningStates = {};
        // Initialize poisoning config
    }
    // Apply light poisoning (minor data modification)
    DataPoisoning.prototype.applyLightPoison = function (data, dataId) {
        this.poisoningStates[dataId] = "light";
        return __assign(__assign({}, data), { poisoned: true, level: "light" });
    };
    // Apply heavy poisoning (major data modification)
    DataPoisoning.prototype.applyHeavyPoison = function (data, dataId) {
        this.poisoningStates[dataId] = "heavy";
        return __assign(__assign({}, data), { poisoned: true, level: "heavy" });
    };
    // Track poisoning state
    DataPoisoning.prototype.getPoisoningState = function (dataId) {
        return this.poisoningStates[dataId] || null;
    };
    return DataPoisoning;
}());
exports.DataPoisoning = DataPoisoning;
