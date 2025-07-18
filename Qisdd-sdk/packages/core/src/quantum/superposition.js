"use strict";
// QISDD-SDK Quantum: Enhanced Superposition Implementation with Logging & Auditing
// packages/core/src/quantum/superposition.ts
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantumStateType = exports.Superposition = exports.SuperpositionFactory = exports.QuantumSuperposition = void 0;
var events_1 = require("events");
var crypto_1 = require("crypto");
var observer_effect_1 = require("./observer-effect");
Object.defineProperty(exports, "QuantumStateType", { enumerable: true, get: function () { return observer_effect_1.QuantumStateType; } });
// Enhanced Superposition Class with Complete Implementation
var QuantumSuperposition = /** @class */ (function (_super) {
    __extends(QuantumSuperposition, _super);
    function QuantumSuperposition(initialStates, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this) || this;
        _this.states = new Map();
        _this.activeStateId = null;
        _this.auditLogs = [];
        _this.stateTransitions = [];
        _this.observationCount = 0;
        _this.isCollapsed = false;
        _this.superpositionId = _this.generateId();
        _this.createdAt = new Date();
        _this.lastRotation = new Date();
        // Default configuration
        _this.config = __assign({ stateCount: 3, coherenceTimeMs: 300000, maxObservations: 1000, degradationThreshold: 0.8, autoRotationInterval: 60000, enableEntanglement: true, auditLevel: "detailed", compressionEnabled: true }, config);
        _this.initializeStates(initialStates);
        _this.setupAutoRotation();
        _this.setupCoherenceMonitoring();
        _this.log("superposition_created", {
            superpositionId: _this.superpositionId,
            stateCount: _this.states.size,
            config: _this.config,
        }, "info");
        return _this;
    }
    // Initialize quantum states with validation and setup
    QuantumSuperposition.prototype.initializeStates = function (initialStates) {
        var _this = this;
        if (initialStates.length === 0) {
            throw new Error("Superposition must have at least one quantum state");
        }
        initialStates.forEach(function (state, index) {
            var enhancedState = __assign(__assign({}, state), { id: state.id || _this.generateStateId(index), updatedAt: new Date(), accessCount: 0, degradationLevel: 0, poisonLevel: 0, entanglements: state.entanglements || [], metadata: __assign({ originalDataHash: _this.calculateHash(state.ciphertext), encryptionAlgorithm: "SEAL", keyId: "default", sizeBytes: state.ciphertext.length, noiseLevel: 0, operationsCount: 0, maxOperations: 100, coherenceTime: _this.config.coherenceTimeMs }, state.metadata) });
            _this.states.set(enhancedState.id, enhancedState);
            if (index === 0 || enhancedState.active) {
                _this.setActiveState(enhancedState.id);
            }
        });
        this.log("states_initialized", {
            count: this.states.size,
            activeStateId: this.activeStateId,
        }, "info");
    };
    // Enhanced state rotation with logging and validation
    QuantumSuperposition.prototype.rotateState = function () {
        if (this.isCollapsed) {
            this.log("rotation_blocked_collapsed", {}, "warning");
            return null;
        }
        var stateIds = Array.from(this.states.keys());
        if (stateIds.length === 0) {
            this.log("rotation_failed_no_states", {}, "error");
            return null;
        }
        var currentIndex = this.activeStateId
            ? stateIds.indexOf(this.activeStateId)
            : -1;
        var nextIndex = (currentIndex + 1) % stateIds.length;
        var nextStateId = stateIds[nextIndex];
        var previousStateId = this.activeStateId;
        this.setActiveState(nextStateId);
        this.lastRotation = new Date();
        var newState = this.states.get(nextStateId);
        this.log("state_rotated", {
            fromStateId: previousStateId,
            toStateId: nextStateId,
            rotationIndex: nextIndex,
            timestamp: this.lastRotation,
        }, "info");
        this.emit("stateRotated", {
            previousStateId: previousStateId,
            newStateId: nextStateId,
            state: newState,
        });
        return newState;
    };
    // Context-aware state selection with enhanced logic
    QuantumSuperposition.prototype.selectStateByContext = function (context) {
        if (this.isCollapsed) {
            this.log("selection_blocked_collapsed", { context: context }, "warning");
            return null;
        }
        var selectedStateId = null;
        // Trust score based selection
        if ((context === null || context === void 0 ? void 0 : context.trustScore) !== undefined) {
            var trustScore = Math.max(0, Math.min(1, context.trustScore));
            var stateIds = Array.from(this.states.keys());
            var index = Math.floor(trustScore * stateIds.length);
            selectedStateId = stateIds[Math.min(index, stateIds.length - 1)];
            this.log("context_selection_trust", {
                trustScore: trustScore,
                selectedIndex: index,
                selectedStateId: selectedStateId,
            }, "info");
        }
        // Environment-based selection
        else if (context === null || context === void 0 ? void 0 : context.environment) {
            selectedStateId = this.selectByEnvironment(context.environment);
        }
        // Risk-based selection
        else if ((context === null || context === void 0 ? void 0 : context.riskLevel) !== undefined) {
            selectedStateId = this.selectByRiskLevel(context.riskLevel);
        }
        // Default to current active state
        else {
            selectedStateId = this.activeStateId;
        }
        if (selectedStateId && this.states.has(selectedStateId)) {
            this.setActiveState(selectedStateId);
            var state = this.states.get(selectedStateId);
            this.log("context_selection_completed", {
                context: context,
                selectedStateId: selectedStateId,
                stateType: state.stateType,
            }, "info");
            return state;
        }
        this.log("context_selection_failed", { context: context }, "error");
        return null;
    };
    // Comprehensive state collapse with cleanup
    QuantumSuperposition.prototype.collapseAll = function (reason) {
        var _this = this;
        if (reason === void 0) { reason = "Manual collapse"; }
        this.log("collapse_initiated", { reason: reason }, "warning");
        this.states.forEach(function (state, stateId) {
            state.stateType = observer_effect_1.QuantumStateType.Collapsed;
            state.active = false;
            state.updatedAt = new Date();
            _this.recordStateTransition(state.stateType, observer_effect_1.QuantumStateType.Collapsed, reason);
        });
        this.activeStateId = null;
        this.isCollapsed = true;
        // Clean up timers
        this.clearTimers();
        this.log("collapse_completed", {
            reason: reason,
            collapsedStatesCount: this.states.size,
        }, "critical");
        this.emit("superpositionCollapsed", {
            reason: reason,
            timestamp: new Date(),
            statesCount: this.states.size,
        });
    };
    // Get active state with access logging
    QuantumSuperposition.prototype.getActiveState = function () {
        if (!this.activeStateId || this.isCollapsed) {
            this.log("active_state_access_blocked", {
                activeStateId: this.activeStateId,
                isCollapsed: this.isCollapsed,
            }, "warning");
            return null;
        }
        var state = this.states.get(this.activeStateId);
        if (state) {
            // Update access metrics
            state.accessCount++;
            state.lastAccessed = new Date();
            state.updatedAt = new Date();
            this.observationCount++;
            this.log("active_state_accessed", {
                stateId: this.activeStateId,
                accessCount: state.accessCount,
                observationCount: this.observationCount,
            }, "info");
            // Check observation limits
            if (this.observationCount >= this.config.maxObservations) {
                this.log("observation_limit_exceeded", {
                    count: this.observationCount,
                    limit: this.config.maxObservations,
                }, "warning");
                this.emit("observationLimitExceeded", {
                    count: this.observationCount,
                    limit: this.config.maxObservations,
                });
            }
            return __assign({}, state); // Return copy to prevent external mutation
        }
        this.log("active_state_not_found", {
            activeStateId: this.activeStateId,
        }, "error");
        return null;
    };
    // Add new quantum state with validation
    QuantumSuperposition.prototype.addState = function (state) {
        var stateId = state.id || this.generateStateId(this.states.size);
        var newState = {
            id: stateId,
            index: this.states.size,
            ciphertext: state.ciphertext || Buffer.alloc(0),
            nonce: state.nonce || (0, crypto_1.randomBytes)(16),
            mac: state.mac || "",
            createdAt: state.createdAt || new Date(),
            updatedAt: new Date(),
            active: false,
            stateType: state.stateType || observer_effect_1.QuantumStateType.Healthy,
            accessCount: 0,
            degradationLevel: 0,
            poisonLevel: 0,
            entanglements: [],
            metadata: __assign({ originalDataHash: this.calculateHash(state.ciphertext || Buffer.alloc(0)), encryptionAlgorithm: "SEAL", keyId: "default", sizeBytes: (state.ciphertext || Buffer.alloc(0)).length, noiseLevel: 0, operationsCount: 0, maxOperations: 100, coherenceTime: this.config.coherenceTimeMs }, state.metadata),
        };
        this.states.set(stateId, newState);
        this.log("state_added", {
            stateId: stateId,
            totalStates: this.states.size,
            stateType: newState.stateType,
        }, "info");
        this.emit("stateAdded", { stateId: stateId, state: newState });
        return stateId;
    };
    // Remove quantum state with cleanup
    QuantumSuperposition.prototype.removeState = function (stateId) {
        var state = this.states.get(stateId);
        if (!state) {
            this.log("state_removal_failed_not_found", { stateId: stateId }, "warning");
            return false;
        }
        // If removing active state, rotate to another
        if (this.activeStateId === stateId) {
            var remainingStates = Array.from(this.states.keys()).filter(function (id) { return id !== stateId; });
            if (remainingStates.length > 0) {
                this.setActiveState(remainingStates[0]);
            }
            else {
                this.activeStateId = null;
            }
        }
        this.states.delete(stateId);
        this.log("state_removed", {
            stateId: stateId,
            remainingStates: this.states.size,
            wasActive: this.activeStateId === stateId,
        }, "info");
        this.emit("stateRemoved", { stateId: stateId, remainingStates: this.states.size });
        return true;
    };
    // Get all states with filtering
    QuantumSuperposition.prototype.getAllStates = function (filter) {
        var states = Array.from(this.states.values());
        if (filter) {
            if (filter.stateType !== undefined) {
                states = states.filter(function (s) { return s.stateType === filter.stateType; });
            }
            if (filter.active !== undefined) {
                states = states.filter(function (s) { return s.active === filter.active; });
            }
            if (filter.minAccessCount !== undefined) {
                states = states.filter(function (s) { return s.accessCount >= filter.minAccessCount; });
            }
        }
        this.log("states_queried", {
            filter: filter,
            resultCount: states.length,
            totalStates: this.states.size,
        }, "info");
        return states.map(function (state) { return (__assign({}, state)); }); // Return copies
    };
    // Apply quantum decoherence
    QuantumSuperposition.prototype.applyDecoherence = function (factor) {
        var _this = this;
        if (factor === void 0) { factor = 0.1; }
        this.states.forEach(function (state, stateId) {
            state.degradationLevel = Math.min(1.0, state.degradationLevel + factor);
            state.metadata.noiseLevel += factor * 0.1;
            state.updatedAt = new Date();
            if (state.degradationLevel >= _this.config.degradationThreshold) {
                state.stateType = observer_effect_1.QuantumStateType.Degraded;
                _this.recordStateTransition(observer_effect_1.QuantumStateType.Healthy, observer_effect_1.QuantumStateType.Degraded, "Decoherence threshold exceeded");
            }
        });
        this.log("decoherence_applied", {
            factor: factor,
            degradedStates: this.getStateCountByType(observer_effect_1.QuantumStateType.Degraded),
        }, "info");
    };
    // Poison quantum state
    QuantumSuperposition.prototype.poisonState = function (stateId, poisonLevel) {
        if (poisonLevel === void 0) { poisonLevel = 0.5; }
        var state = this.states.get(stateId);
        if (!state) {
            this.log("poison_failed_state_not_found", { stateId: stateId }, "error");
            return false;
        }
        var previousType = state.stateType;
        state.poisonLevel = Math.min(1.0, state.poisonLevel + poisonLevel);
        state.stateType = observer_effect_1.QuantumStateType.Poisoned;
        state.updatedAt = new Date();
        this.recordStateTransition(previousType, observer_effect_1.QuantumStateType.Poisoned, "Poisoning applied");
        this.log("state_poisoned", {
            stateId: stateId,
            poisonLevel: state.poisonLevel,
            previousType: previousType,
        }, "warning");
        this.emit("statePoisoned", { stateId: stateId, poisonLevel: state.poisonLevel });
        return true;
    };
    // Get comprehensive metrics
    QuantumSuperposition.prototype.getMetrics = function () {
        var states = Array.from(this.states.values());
        var metrics = {
            totalStates: states.length,
            activeStates: states.filter(function (s) { return s.active; }).length,
            collapsedStates: this.getStateCountByType(observer_effect_1.QuantumStateType.Collapsed),
            poisonedStates: this.getStateCountByType(observer_effect_1.QuantumStateType.Poisoned),
            degradedStates: this.getStateCountByType(observer_effect_1.QuantumStateType.Degraded),
            totalObservations: this.observationCount,
            unauthorizedAttempts: this.auditLogs.filter(function (log) {
                return log.event.includes("unauthorized");
            }).length,
            averageCoherenceTime: this.calculateAverageCoherenceTime(),
            entropyLevel: this.calculateEntropy(),
            systemHealth: this.calculateSystemHealth(),
        };
        this.log("metrics_calculated", metrics, "info");
        return metrics;
    };
    // Get audit logs with filtering
    QuantumSuperposition.prototype.getAuditLogs = function (filter) {
        var logs = __spreadArray([], this.auditLogs, true);
        if (filter) {
            if (filter.severity) {
                logs = logs.filter(function (log) { return log.severity === filter.severity; });
            }
            if (filter.event) {
                logs = logs.filter(function (log) { return log.event.includes(filter.event); });
            }
            if (filter.stateId) {
                logs = logs.filter(function (log) { return log.stateId === filter.stateId; });
            }
            if (filter.since) {
                logs = logs.filter(function (log) { return log.timestamp >= filter.since; });
            }
        }
        return logs;
    };
    // Export state for persistence
    QuantumSuperposition.prototype.exportState = function () {
        return {
            superpositionId: this.superpositionId,
            states: Array.from(this.states.entries()),
            activeStateId: this.activeStateId,
            config: this.config,
            observationCount: this.observationCount,
            createdAt: this.createdAt,
            lastRotation: this.lastRotation,
            isCollapsed: this.isCollapsed,
            auditLogs: this.auditLogs.slice(-100), // Last 100 logs
            stateTransitions: this.stateTransitions.slice(-50), // Last 50 transitions
        };
    };
    // Import state from persistence
    QuantumSuperposition.fromExportedState = function (exportedState) {
        var states = exportedState.states.map(function (_a) {
            var id = _a[0], state = _a[1];
            return state;
        });
        var superposition = new QuantumSuperposition(states, exportedState.config);
        superposition.activeStateId = exportedState.activeStateId;
        superposition.observationCount = exportedState.observationCount;
        superposition.lastRotation = new Date(exportedState.lastRotation);
        superposition.isCollapsed = exportedState.isCollapsed;
        if (exportedState.auditLogs) {
            superposition.auditLogs = exportedState.auditLogs;
        }
        if (exportedState.stateTransitions) {
            superposition.stateTransitions = exportedState.stateTransitions;
        }
        return superposition;
    };
    // Cleanup and destroy
    QuantumSuperposition.prototype.destroy = function () {
        this.clearTimers();
        this.removeAllListeners();
        this.states.clear();
        this.log("superposition_destroyed", {
            superpositionId: this.superpositionId,
        }, "info");
    };
    // Private helper methods
    QuantumSuperposition.prototype.setActiveState = function (stateId) {
        if (!this.states.has(stateId)) {
            throw new Error("State ".concat(stateId, " does not exist"));
        }
        // Deactivate all states
        this.states.forEach(function (state) {
            state.active = false;
        });
        // Activate the selected state
        var newActiveState = this.states.get(stateId);
        newActiveState.active = true;
        newActiveState.updatedAt = new Date();
        this.activeStateId = stateId;
        this.log("active_state_changed", {
            newActiveStateId: stateId,
            stateType: newActiveState.stateType,
        }, "info");
    };
    QuantumSuperposition.prototype.selectByEnvironment = function (environment) {
        // Environment-based selection logic
        var stateIds = Array.from(this.states.keys());
        var hash = (0, crypto_1.createHash)("sha256").update(environment).digest();
        var index = hash[0] % stateIds.length;
        return stateIds[index];
    };
    QuantumSuperposition.prototype.selectByRiskLevel = function (riskLevel) {
        // Risk-based selection logic
        var stateIds = Array.from(this.states.keys());
        var safeIndex = Math.floor((1 - riskLevel) * stateIds.length);
        return stateIds[Math.min(safeIndex, stateIds.length - 1)];
    };
    QuantumSuperposition.prototype.setupAutoRotation = function () {
        var _this = this;
        if (this.config.autoRotationInterval > 0) {
            this.autoRotationTimer = setInterval(function () {
                if (!_this.isCollapsed && _this.states.size > 1) {
                    _this.rotateState();
                }
            }, this.config.autoRotationInterval);
        }
    };
    QuantumSuperposition.prototype.setupCoherenceMonitoring = function () {
        var _this = this;
        this.coherenceTimer = setInterval(function () {
            _this.monitorCoherence();
        }, 10000); // Check every 10 seconds
    };
    QuantumSuperposition.prototype.monitorCoherence = function () {
        var now = new Date();
        var decoherenceApplied = false;
        this.states.forEach(function (state, stateId) {
            var age = now.getTime() - state.createdAt.getTime();
            if (age > state.metadata.coherenceTime) {
                var factor = ((age - state.metadata.coherenceTime) /
                    state.metadata.coherenceTime) *
                    0.1;
                state.degradationLevel = Math.min(1.0, state.degradationLevel + factor);
                decoherenceApplied = true;
            }
        });
        if (decoherenceApplied) {
            this.log("coherence_monitoring_decoherence", {
                timestamp: now,
            }, "info");
        }
    };
    QuantumSuperposition.prototype.clearTimers = function () {
        if (this.autoRotationTimer) {
            clearInterval(this.autoRotationTimer);
            this.autoRotationTimer = undefined;
        }
        if (this.coherenceTimer) {
            clearInterval(this.coherenceTimer);
            this.coherenceTimer = undefined;
        }
    };
    QuantumSuperposition.prototype.generateId = function () {
        return "qsp_".concat(Date.now(), "_").concat((0, crypto_1.randomBytes)(8).toString("hex"));
    };
    QuantumSuperposition.prototype.generateStateId = function (index) {
        return "qs_".concat(this.superpositionId, "_").concat(index, "_").concat((0, crypto_1.randomBytes)(4).toString("hex"));
    };
    QuantumSuperposition.prototype.calculateHash = function (data) {
        return (0, crypto_1.createHash)("sha256").update(data).digest("hex");
    };
    QuantumSuperposition.prototype.getStateCountByType = function (type) {
        return Array.from(this.states.values()).filter(function (s) { return s.stateType === type; })
            .length;
    };
    QuantumSuperposition.prototype.calculateAverageCoherenceTime = function () {
        var states = Array.from(this.states.values());
        if (states.length === 0)
            return 0;
        var total = states.reduce(function (sum, state) { return sum + state.metadata.coherenceTime; }, 0);
        return total / states.length;
    };
    QuantumSuperposition.prototype.calculateEntropy = function () {
        var _this = this;
        var stateTypes = Object.values(observer_effect_1.QuantumStateType);
        var typeCounts = stateTypes.map(function (type) { return _this.getStateCountByType(type); });
        var total = typeCounts.reduce(function (sum, count) { return sum + count; }, 0);
        if (total === 0)
            return 0;
        var entropy = 0;
        typeCounts.forEach(function (count) {
            if (count > 0) {
                var probability = count / total;
                entropy -= probability * Math.log2(probability);
            }
        });
        return entropy;
    };
    QuantumSuperposition.prototype.calculateSystemHealth = function () {
        var states = Array.from(this.states.values());
        if (states.length === 0)
            return 0;
        var healthyStates = states.filter(function (s) {
            return s.stateType === observer_effect_1.QuantumStateType.Healthy && s.degradationLevel < 0.5;
        }).length;
        return healthyStates / states.length;
    };
    QuantumSuperposition.prototype.recordStateTransition = function (from, to, trigger) {
        var transition = {
            fromState: from,
            toState: to,
            trigger: trigger,
            timestamp: new Date(),
        };
        this.stateTransitions.push(transition);
        // Keep only last 1000 transitions
        if (this.stateTransitions.length > 1000) {
            this.stateTransitions = this.stateTransitions.slice(-1000);
        }
        this.emit("stateTransition", transition);
    };
    QuantumSuperposition.prototype.log = function (event, details, severity) {
        if (details === void 0) { details = {}; }
        if (severity === void 0) { severity = "info"; }
        var logEntry = {
            id: this.generateId(),
            timestamp: new Date(),
            event: event,
            details: __assign({ superpositionId: this.superpositionId }, details),
            severity: severity,
            context: this.config.auditLevel === "forensic"
                ? {
                    observationCount: this.observationCount,
                    activeStateId: this.activeStateId,
                    isCollapsed: this.isCollapsed,
                    statesCount: this.states.size,
                }
                : undefined,
        };
        this.auditLogs.push(logEntry);
        // Keep only last 10000 logs to prevent memory issues
        if (this.auditLogs.length > 10000) {
            this.auditLogs = this.auditLogs.slice(-10000);
        }
        // Emit for external logging systems
        this.emit("auditLog", logEntry);
        // Console logging based on severity
        if (severity === "error" || severity === "critical") {
            console.error("[QISDD-Superposition] ".concat(event, ":"), details);
        }
        else if (severity === "warning") {
            console.warn("[QISDD-Superposition] ".concat(event, ":"), details);
        }
        else if (this.config.auditLevel === "forensic") {
            console.log("[QISDD-Superposition] ".concat(event, ":"), details);
        }
    };
    return QuantumSuperposition;
}(events_1.EventEmitter));
exports.QuantumSuperposition = QuantumSuperposition;
exports.Superposition = QuantumSuperposition;
// Export additional utilities
var SuperpositionFactory = /** @class */ (function () {
    function SuperpositionFactory() {
    }
    SuperpositionFactory.createFromData = function (data, stateCount, config) {
        if (stateCount === void 0) { stateCount = 3; }
        if (config === void 0) { config = {}; }
        var states = [];
        for (var i = 0; i < stateCount; i++) {
            var stateData = JSON.stringify(data);
            var nonce = (0, crypto_1.randomBytes)(16);
            var ciphertext = Buffer.from(stateData); // In real implementation, use actual encryption
            states.push({
                id: "state_".concat(i, "_").concat((0, crypto_1.randomBytes)(4).toString("hex")),
                index: i,
                ciphertext: ciphertext,
                nonce: nonce,
                mac: (0, crypto_1.createHash)("sha256").update(ciphertext).digest("hex"),
                createdAt: new Date(),
                updatedAt: new Date(),
                active: i === 0,
                stateType: observer_effect_1.QuantumStateType.Healthy,
                accessCount: 0,
                degradationLevel: 0,
                poisonLevel: 0,
                entanglements: [],
                metadata: {
                    originalDataHash: (0, crypto_1.createHash)("sha256")
                        .update(stateData)
                        .digest("hex"),
                    encryptionAlgorithm: "SEAL",
                    keyId: "default",
                    sizeBytes: ciphertext.length,
                    noiseLevel: 0,
                    operationsCount: 0,
                    maxOperations: 100,
                    coherenceTime: config.coherenceTimeMs || 300000,
                },
            });
        }
        return new QuantumSuperposition(states, config);
    };
    return SuperpositionFactory;
}());
exports.SuperpositionFactory = SuperpositionFactory;
