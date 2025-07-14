"use strict";
// QISDD-SDK Quantum: Measurement (Collapse) Implementation
Object.defineProperty(exports, "__esModule", { value: true });
exports.Measurement = void 0;
var observer_effect_1 = require("./observer-effect");
var Measurement = /** @class */ (function () {
    function Measurement() {
        // Initialize measurement logic
    }
    // Collapse all states in a superposition to a single collapsed state
    Measurement.prototype.collapse = function (superposition, trigger) {
        superposition.collapseAll();
        return {
            collapsed: true,
            collapsedState: observer_effect_1.QuantumStateType.Collapsed,
            reason: "Collapse triggered by ".concat(trigger),
        };
    };
    // Read out the current active state (authorized access)
    Measurement.prototype.readState = function (superposition) {
        // Return the current active state if not collapsed
        var state = superposition.getActiveState();
        if (state && state.stateType !== observer_effect_1.QuantumStateType.Collapsed) {
            return state;
        }
        return null;
    };
    return Measurement;
}());
exports.Measurement = Measurement;
