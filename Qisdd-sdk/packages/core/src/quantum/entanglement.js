"use strict";
// QISDD-SDK Quantum: Entanglement Implementation
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entanglement = void 0;
var Entanglement = /** @class */ (function () {
    function Entanglement(initialLinks) {
        if (initialLinks === void 0) { initialLinks = []; }
        this.links = [];
        this.links = initialLinks;
    }
    // Add a new entanglement link
    Entanglement.prototype.addLink = function (link) {
        this.links.push(link);
    };
    // Get all entanglement links
    Entanglement.prototype.getLinks = function () {
        return this.links;
    };
    // Propagate a state change to all entangled data
    Entanglement.prototype.propagateStateChange = function (state, propagateFn) {
        for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
            var link = _a[_i];
            // For symmetric, propagate both ways; for asymmetric, only one way
            propagateFn(link.targetId, state, link.strength);
        }
    };
    // Update entanglement strength
    Entanglement.prototype.updateStrength = function (targetId, newStrength) {
        var link = this.links.find(function (l) { return l.targetId === targetId; });
        if (link) {
            link.strength = newStrength;
        }
    };
    // Remove a link (e.g., on data erasure)
    Entanglement.prototype.removeLink = function (targetId) {
        this.links = this.links.filter(function (link) { return link.targetId !== targetId; });
    };
    return Entanglement;
}());
exports.Entanglement = Entanglement;
