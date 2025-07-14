"use strict";
// QISDD-SDK Storage: State Manager
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
var StateManager = /** @class */ (function () {
    function StateManager(config) {
        this.stateMap = new Map();
        // Initialize state manager config, DB connection, etc.
    }
    // Save a new state record
    StateManager.prototype.saveState = function (record) {
        var states = this.stateMap.get(record.dataId) || [];
        states.push(record);
        this.stateMap.set(record.dataId, states);
    };
    // Get all states for a dataId
    StateManager.prototype.getStates = function (dataId) {
        return this.stateMap.get(dataId) || [];
    };
    // Set a state as active
    StateManager.prototype.setActiveState = function (dataId, stateIndex) {
        var states = this.stateMap.get(dataId) || [];
        states.forEach(function (s, i) { return (s.active = i === stateIndex); });
        this.stateMap.set(dataId, states);
    };
    // Delete a state record
    StateManager.prototype.deleteState = function (stateId) {
        var _this = this;
        Array.from(this.stateMap.entries()).forEach(function (_a) {
            var dataId = _a[0], states = _a[1];
            var filtered = states.filter(function (s) { return s.id !== stateId; });
            _this.stateMap.set(dataId, filtered);
        });
    };
    return StateManager;
}());
exports.StateManager = StateManager;
