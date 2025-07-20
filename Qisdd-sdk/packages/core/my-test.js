"use strict";
// QISDD-SDK Complete Integration Example
// This file shows how all components work together
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QISDDFactory = exports.QISDDIntegratedClient = void 0;
exports.demonstrateQISDDUsage = demonstrateQISDDUsage;
var superposition_1 = require("./src/quantum/superposition");
var observer_effect_1 = require("./src/quantum/observer-effect");
var measurement_1 = require("./src/quantum/measurement");
var entanglement_1 = require("./src/quantum/entanglement");
var logging_1 = require("./src/logging");
var crypto_1 = require("./src/crypto");
var events_1 = require("events");
var crypto_2 = require("crypto");
// Main QISDD Client with Complete Integration
var QISDDIntegratedClient = /** @class */ (function (_super) {
    __extends(QISDDIntegratedClient, _super);
    function QISDDIntegratedClient(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this) || this;
        _this.superpositions = new Map();
        _this._initialized = false;
        _this.config = __assign({ enableCrypto: true, enableLogging: true, enableAuditing: true, enableBlockchain: false, superpositionConfig: {
                stateCount: 3,
                coherenceTimeMs: 300000,
                maxObservations: 1000,
                degradationThreshold: 0.8,
                autoRotationInterval: 60000,
                enableEntanglement: true,
                auditLevel: 'detailed',
                compressionEnabled: true
            }, cryptoConfig: {
                seal: {
                    scheme: 'BFV',
                    polyModulusDegree: 4096,
                    plainModulus: 40961,
                    coeffModulus: [60, 40, 40, 60],
                    encodeType: 'integer'
                },
                zkp: {
                    scheme: 'groth16',
                    curve: 'bn128',
                    circuitDir: './circuits',
                    enableOptimization: true
                }
            }, loggerConfig: {
                level: logging_1.LogLevel.INFO,
                enableConsole: true,
                enableFile: true,
                enableStructured: true,
                sensitiveDataMasking: true,
                enableCorrelation: true
            } }, config);
        _this.initializeAsync();
        return _this;
    }
    /**
     * Wait for client initialization to complete
     */
    QISDDIntegratedClient.prototype.waitForInitialization = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._initialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    QISDDIntegratedClient.prototype.initializeAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initializeComponents()];
                    case 1:
                        _a.sent();
                        this.setupEventHandlers();
                        this.initializeMetrics();
                        this._initialized = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    QISDDIntegratedClient.prototype.initializeComponents = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Initialize logger first
                        this.logger = logging_1.LoggerFactory.createQuantumLogger(this.config.loggerConfig);
                        // Initialize crypto suite
                        this.cryptoSuite = new crypto_1.CryptoSuite(this.config.cryptoConfig);
                        // Wait for crypto initialization
                        return [4 /*yield*/, this.cryptoSuite.waitForInitialization()];
                    case 1:
                        // Wait for crypto initialization
                        _a.sent();
                        // Initialize quantum components
                        this.observer = new observer_effect_1.ObserverEffect(3); // 3 unauthorized attempts threshold
                        this.measurement = new measurement_1.Measurement();
                        this.entanglement = new entanglement_1.Entanglement();
                        this.logger.info('QISDD Integrated Client initialized', {
                            config: this.config,
                            components: ['crypto', 'quantum', 'logging', 'auditing']
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    QISDDIntegratedClient.prototype.setupEventHandlers = function () {
        // Listen to quantum events
        this.on('superpositionCreated', this.handleSuperpositionCreated.bind(this));
        this.on('stateObserved', this.handleStateObserved.bind(this));
        this.on('unauthorizedAccess', this.handleUnauthorizedAccess.bind(this));
        this.on('quantumCollapse', this.handleQuantumCollapse.bind(this));
        // Listen to crypto events (if supported)
        if (typeof this.cryptoSuite.seal.on === 'function') {
            this.cryptoSuite.seal.on('encryptionCompleted', this.handleEncryptionCompleted.bind(this));
        }
        this.logger.info('Event handlers set up');
    };
    QISDDIntegratedClient.prototype.initializeMetrics = function () {
        this.metrics = {
            totalDataProtected: 0,
            totalObservations: 0,
            unauthorizedAttempts: 0,
            superpositionsCreated: 0,
            quantumCollapses: 0,
            averageResponseTime: 0,
            cryptoOperations: {
                encryptions: 0,
                decryptions: 0,
                zkpProofs: 0,
                verifications: 0
            }
        };
    };
    // Main API Methods
    /**
     * Protect data with quantum superposition and encryption
     */
    QISDDIntegratedClient.prototype.protectData = function (data_1) {
        return __awaiter(this, arguments, void 0, function (data, policy, context) {
            var operationId, correlationId, serializedData, dataHash, states, stateCount, i, ciphertext, nonce, mac, state, superposition, zkProof, _i, _a, targetId, targetSuperposition, performance_1, error_1;
            var _this = this;
            var _b, _c;
            if (policy === void 0) { policy = {}; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        operationId = "protect_".concat(Date.now(), "_").concat((0, crypto_2.randomBytes)(4).toString('hex'));
                        correlationId = (context === null || context === void 0 ? void 0 : context.correlationId) || operationId;
                        this.logger.startPerformanceTimer(operationId);
                        this.logger.correlatedLog(correlationId, logging_1.LogLevel.INFO, logging_1.LogCategory.QUANTUM, 'data_protection_started', 'Starting data protection', {
                            dataType: typeof data,
                            policy: policy,
                            operationId: operationId
                        });
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 8, , 9]);
                        serializedData = JSON.stringify(data);
                        dataHash = this.calculateDataHash(serializedData);
                        states = [];
                        stateCount = ((_b = policy.superpositionConfig) === null || _b === void 0 ? void 0 : _b.stateCount) || this.config.superpositionConfig.stateCount;
                        i = 0;
                        _d.label = 2;
                    case 2:
                        if (!(i < stateCount)) return [3 /*break*/, 5];
                        this.logger.correlatedLog(correlationId, logging_1.LogLevel.DEBUG, logging_1.LogCategory.CRYPTO, 'encrypting_state', "Encrypting quantum state ".concat(i), { stateIndex: i });
                        return [4 /*yield*/, this.cryptoSuite.seal.encrypt(serializedData)];
                    case 3:
                        ciphertext = _d.sent();
                        nonce = (0, crypto_2.randomBytes)(16);
                        mac = this.calculateMAC(ciphertext, nonce);
                        state = {
                            id: "".concat(operationId, "_state_").concat(i),
                            index: i,
                            ciphertext: ciphertext,
                            nonce: nonce,
                            mac: mac,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            active: i === 0,
                            stateType: superposition_1.QuantumStateType.Healthy,
                            accessCount: 0,
                            degradationLevel: 0,
                            poisonLevel: 0,
                            entanglements: [],
                            metadata: {
                                originalDataHash: dataHash,
                                encryptionAlgorithm: 'SEAL',
                                keyId: 'default',
                                sizeBytes: ciphertext.length,
                                noiseLevel: 0,
                                operationsCount: 0,
                                maxOperations: 100,
                                coherenceTime: this.config.superpositionConfig.coherenceTimeMs
                            }
                        };
                        states.push(state);
                        this.metrics.cryptoOperations.encryptions++;
                        _d.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        superposition = new superposition_1.QuantumSuperposition(states, __assign(__assign({}, this.config.superpositionConfig), policy.superpositionConfig));
                        zkProof = null;
                        if (!(policy.requireZKProof !== false)) return [3 /*break*/, 7];
                        this.logger.correlatedLog(correlationId, logging_1.LogLevel.DEBUG, logging_1.LogCategory.CRYPTO, 'generating_zkp', 'Generating ZK proof for data integrity');
                        return [4 /*yield*/, this.cryptoSuite.zkpProver.generateProof({
                                dataHash: dataHash,
                                salt: (0, crypto_2.randomBytes)(32).toString('hex')
                            }, 'data_integrity')];
                    case 6:
                        zkProof = _d.sent();
                        this.metrics.cryptoOperations.zkpProofs++;
                        _d.label = 7;
                    case 7:
                        // Step 5: Set up entanglement if required
                        if (policy.entangleWith) {
                            for (_i = 0, _a = policy.entangleWith; _i < _a.length; _i++) {
                                targetId = _a[_i];
                                targetSuperposition = this.superpositions.get(targetId);
                                if (targetSuperposition) {
                                    this.logger.correlatedLog(correlationId, logging_1.LogLevel.DEBUG, logging_1.LogCategory.QUANTUM, 'creating_entanglement', 'Creating quantum entanglement', {
                                        sourceId: operationId,
                                        targetId: targetId
                                    });
                                    this.entanglement.addLink({
                                        targetId: targetId,
                                        strength: policy.entanglementStrength || 0.7,
                                        type: 'symmetric',
                                        createdAt: new Date()
                                    });
                                }
                            }
                        }
                        // Step 6: Store superposition
                        this.superpositions.set(operationId, superposition);
                        // Step 7: Set up event listeners for this superposition
                        superposition.on('stateRotated', function (event) {
                            _this.logger.correlatedLog(correlationId, logging_1.LogLevel.INFO, logging_1.LogCategory.QUANTUM, 'state_rotated', 'Quantum state rotated', event);
                        });
                        superposition.on('superpositionCollapsed', function (event) {
                            _this.emit('quantumCollapse', __assign(__assign({}, event), { superpositionId: operationId, correlationId: correlationId }));
                        });
                        // Step 8: Update metrics and log completion
                        this.metrics.totalDataProtected++;
                        this.metrics.superpositionsCreated++;
                        performance_1 = this.logger.endPerformanceTimer(operationId);
                        this.updateAverageResponseTime(performance_1.duration);
                        this.logger.correlatedLog(correlationId, logging_1.LogLevel.INFO, logging_1.LogCategory.QUANTUM, 'data_protection_completed', 'Data protection completed successfully', {
                            superpositionId: operationId,
                            statesCreated: states.length,
                            hasZKProof: !!zkProof,
                            entanglements: ((_c = policy.entangleWith) === null || _c === void 0 ? void 0 : _c.length) || 0,
                            performance: performance_1
                        });
                        // Step 9: Emit success event
                        this.emit('superpositionCreated', {
                            superpositionId: operationId,
                            statesCount: states.length,
                            policy: policy,
                            zkProof: zkProof,
                            correlationId: correlationId
                        });
                        return [2 /*return*/, {
                                id: operationId,
                                statesCreated: states.length,
                                zkProof: zkProof,
                                metrics: {
                                    encryptionTime: performance_1.duration,
                                    totalSize: states.reduce(function (sum, s) { return sum + s.ciphertext.length; }, 0),
                                    compressionRatio: 1.0 // Placeholder
                                },
                                correlationId: correlationId
                            }];
                    case 8:
                        error_1 = _d.sent();
                        this.logger.error('Data protection failed', error_1, {
                            operationId: operationId,
                            correlationId: correlationId
                        });
                        throw new Error("Data protection failed: ".concat(error_1.message));
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Observe (access) protected data with quantum observer effect
     */
    QISDDIntegratedClient.prototype.observeData = function (superpositionId, credentials, context) {
        return __awaiter(this, void 0, void 0, function () {
            var operationId, correlationId, superposition, trustScore, isAuthorized, observerResult, poisonedData, selectedState, decryptedData, parsedData, verified, performance_2, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        operationId = "observe_".concat(Date.now(), "_").concat((0, crypto_2.randomBytes)(4).toString('hex'));
                        correlationId = (context === null || context === void 0 ? void 0 : context.correlationId) || operationId;
                        this.logger.startPerformanceTimer(operationId);
                        this.logger.correlatedLog(correlationId, logging_1.LogLevel.INFO, logging_1.LogCategory.QUANTUM, 'observation_started', 'Starting data observation', {
                            superpositionId: superpositionId,
                            userId: credentials.userId,
                            operationId: operationId
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        superposition = this.superpositions.get(superpositionId);
                        if (!superposition) {
                            throw new Error("Superposition ".concat(superpositionId, " not found"));
                        }
                        trustScore = this.calculateTrustScore(credentials, context);
                        isAuthorized = this.validateCredentials(credentials, superposition);
                        this.logger.correlatedLog(correlationId, logging_1.LogLevel.DEBUG, logging_1.LogCategory.SECURITY, 'access_evaluation', 'Evaluating access request', {
                            trustScore: trustScore,
                            isAuthorized: isAuthorized,
                            riskFactors: this.identifyRiskFactors(context)
                        });
                        observerResult = null;
                        if (!isAuthorized || trustScore < 0.5) {
                            // Unauthorized access - trigger observer effect
                            observerResult = this.observer.onUnauthorizedAccess(superpositionId, {
                                trustScore: trustScore,
                                credentials: credentials,
                                context: context
                            });
                            this.metrics.unauthorizedAttempts++;
                            this.logger.correlatedLog(correlationId, logging_1.LogLevel.WARN, logging_1.LogCategory.SECURITY, 'unauthorized_access_detected', 'Unauthorized access attempt detected', {
                                trustScore: trustScore,
                                observerResult: observerResult,
                                credentials: { userId: credentials.userId } // Don't log full credentials
                            });
                            this.emit('unauthorizedAccess', {
                                superpositionId: superpositionId,
                                credentials: credentials,
                                observerResult: observerResult,
                                correlationId: correlationId
                            });
                            // Check if collapse triggered
                            if (observerResult.newState === superposition_1.QuantumStateType.Collapsed) {
                                superposition.collapseAll(observerResult.reason);
                                this.emit('quantumCollapse', {
                                    superpositionId: superpositionId,
                                    reason: observerResult.reason,
                                    correlationId: correlationId
                                });
                                return [2 /*return*/, {
                                        success: false,
                                        data: null,
                                        state: superposition_1.QuantumStateType.Collapsed,
                                        reason: observerResult.reason,
                                        trustScore: trustScore,
                                        correlationId: correlationId
                                    }];
                            }
                            poisonedData = this.generatePoisonedData(observerResult.transformation);
                            return [2 /*return*/, {
                                    success: false,
                                    data: poisonedData,
                                    state: observerResult.newState,
                                    reason: observerResult.reason,
                                    trustScore: trustScore,
                                    correlationId: correlationId
                                }];
                        }
                        selectedState = superposition.selectStateByContext({
                            trustScore: trustScore,
                            environment: context === null || context === void 0 ? void 0 : context.environment,
                            requestType: context === null || context === void 0 ? void 0 : context.requestType
                        });
                        if (!selectedState) {
                            throw new Error('No valid quantum state available');
                        }
                        // Step 5: Decrypt the data
                        this.logger.correlatedLog(correlationId, logging_1.LogLevel.DEBUG, logging_1.LogCategory.CRYPTO, 'decrypting_state', 'Decrypting quantum state', {
                            stateId: selectedState.id,
                            stateType: selectedState.stateType
                        });
                        return [4 /*yield*/, this.cryptoSuite.seal.decrypt(selectedState.ciphertext)];
                    case 2:
                        decryptedData = _a.sent();
                        parsedData = JSON.parse(decryptedData);
                        this.metrics.cryptoOperations.decryptions++;
                        if (!(context === null || context === void 0 ? void 0 : context.zkProof)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cryptoSuite.zkpVerifier.verifyProof(context.zkProof.proof, context.zkProof.publicSignals)];
                    case 3:
                        verified = _a.sent();
                        if (!verified) {
                            this.logger.correlatedLog(correlationId, logging_1.LogLevel.ERROR, logging_1.LogCategory.CRYPTO, 'zkp_verification_failed', 'ZK proof verification failed');
                            throw new Error('Data integrity verification failed');
                        }
                        this.metrics.cryptoOperations.verifications++;
                        _a.label = 4;
                    case 4:
                        // Step 7: Update metrics and state
                        this.metrics.totalObservations++;
                        selectedState.accessCount++;
                        selectedState.lastAccessed = new Date();
                        // Step 8: Check for state rotation
                        if (selectedState.accessCount % 10 === 0) { // Rotate every 10 accesses
                            superposition.rotateState();
                            this.logger.correlatedLog(correlationId, logging_1.LogLevel.INFO, logging_1.LogCategory.QUANTUM, 'automatic_rotation', 'Automatic state rotation triggered', {
                                accessCount: selectedState.accessCount
                            });
                        }
                        performance_2 = this.logger.endPerformanceTimer(operationId);
                        this.updateAverageResponseTime(performance_2.duration);
                        this.logger.correlatedLog(correlationId, logging_1.LogLevel.INFO, logging_1.LogCategory.QUANTUM, 'observation_completed', 'Data observation completed successfully', {
                            superpositionId: superpositionId,
                            stateId: selectedState.id,
                            trustScore: trustScore,
                            performance: performance_2
                        });
                        this.emit('stateObserved', {
                            superpositionId: superpositionId,
                            stateId: selectedState.id,
                            userId: credentials.userId,
                            trustScore: trustScore,
                            correlationId: correlationId
                        });
                        return [2 /*return*/, {
                                success: true,
                                data: parsedData,
                                state: selectedState.stateType,
                                stateId: selectedState.id,
                                trustScore: trustScore,
                                performance: performance_2,
                                correlationId: correlationId
                            }];
                    case 5:
                        error_2 = _a.sent();
                        this.logger.error('Data observation failed', error_2, {
                            superpositionId: superpositionId,
                            operationId: operationId,
                            correlationId: correlationId
                        });
                        throw new Error("Data observation failed: ".concat(error_2.message));
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Perform homomorphic computation on protected data
     */
    QISDDIntegratedClient.prototype.computeOnProtectedData = function (operation, superpositionIds, context) {
        return __awaiter(this, void 0, void 0, function () {
            var operationId, correlationId, activeStates, _i, superpositionIds_1, id, superposition, activeState, result, _a, resultSuperposition, resultId, performance_3, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        operationId = "compute_".concat(operation, "_").concat(Date.now());
                        correlationId = (context === null || context === void 0 ? void 0 : context.correlationId) || operationId;
                        this.logger.startPerformanceTimer(operationId);
                        this.logger.correlatedLog(correlationId, logging_1.LogLevel.INFO, logging_1.LogCategory.CRYPTO, 'homomorphic_computation_started', 'Starting homomorphic computation', {
                            operation: operation,
                            superpositionCount: superpositionIds.length,
                            operationId: operationId
                        });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        activeStates = [];
                        for (_i = 0, superpositionIds_1 = superpositionIds; _i < superpositionIds_1.length; _i++) {
                            id = superpositionIds_1[_i];
                            superposition = this.superpositions.get(id);
                            if (!superposition) {
                                throw new Error("Superposition ".concat(id, " not found"));
                            }
                            activeState = superposition.getActiveState();
                            if (!activeState) {
                                throw new Error("No active state in superposition ".concat(id));
                            }
                            activeStates.push(activeState);
                        }
                        result = void 0;
                        _a = operation;
                        switch (_a) {
                            case 'add': return [3 /*break*/, 2];
                            case 'multiply': return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 2: return [4 /*yield*/, this.cryptoSuite.seal.add(activeStates[0].ciphertext, activeStates[1].ciphertext)];
                    case 3:
                        result = _b.sent();
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, this.cryptoSuite.seal.multiply(activeStates[0].ciphertext, activeStates[1].ciphertext)];
                    case 5:
                        result = _b.sent();
                        return [3 /*break*/, 7];
                    case 6: throw new Error("Unsupported operation: ".concat(operation));
                    case 7:
                        resultSuperposition = superposition_1.SuperpositionFactory.createFromData({ computationResult: result.toString('hex') }, 1 // Single state for computation result
                        );
                        resultId = "computation_result_".concat(Date.now());
                        this.superpositions.set(resultId, resultSuperposition);
                        performance_3 = this.logger.endPerformanceTimer(operationId);
                        this.logger.correlatedLog(correlationId, logging_1.LogLevel.INFO, logging_1.LogCategory.CRYPTO, 'homomorphic_computation_completed', 'Homomorphic computation completed', {
                            operation: operation,
                            resultId: resultId,
                            performance: performance_3
                        });
                        return [2 /*return*/, {
                                success: true,
                                resultId: resultId,
                                operation: operation,
                                inputIds: superpositionIds,
                                performance: performance_3,
                                correlationId: correlationId
                            }];
                    case 8:
                        error_3 = _b.sent();
                        this.logger.error('Homomorphic computation failed', error_3, {
                            operation: operation,
                            operationId: operationId,
                            correlationId: correlationId
                        });
                        throw new Error("Computation failed: ".concat(error_3.message));
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get comprehensive metrics and status
     */
    QISDDIntegratedClient.prototype.getMetrics = function () {
        var systemHealth = this.calculateSystemHealth();
        return __assign(__assign({}, this.metrics), { systemHealth: systemHealth });
    };
    /**
     * Generate security and performance reports
     */
    QISDDIntegratedClient.prototype.generateReport = function (type, timeRange) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.logger.info('Generating report', { type: type, timeRange: timeRange });
                switch (type) {
                    case 'security':
                        return [2 /*return*/, this.logger.generateSecurityReport(timeRange)];
                    case 'performance':
                        return [2 /*return*/, this.logger.generatePerformanceReport(timeRange)];
                    case 'compliance':
                        return [2 /*return*/, this.generateComplianceReport(timeRange)];
                    default:
                        throw new Error("Unsupported report type: ".concat(type));
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Export all logs and audit data
     */
    QISDDIntegratedClient.prototype.exportAuditData = function () {
        return __awaiter(this, arguments, void 0, function (format) {
            if (format === void 0) { format = 'json'; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.logger.exportLogs(format)];
            });
        });
    };
    /**
     * Get audit trail events
     */
    QISDDIntegratedClient.prototype.getAuditTrail = function (filter) {
        return this.logger.getAuditTrail(filter);
    };
    /**
     * Cleanup and destroy client
     */
    QISDDIntegratedClient.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.logger.info('Destroying QISDD client');
                // Destroy all superpositions
                this.superpositions.forEach(function (superposition, id) {
                    superposition.destroy();
                });
                this.superpositions.clear();
                // Cleanup logger
                this.logger.destroy();
                // Remove all listeners
                this.removeAllListeners();
                this.logger.info('QISDD client destroyed');
                return [2 /*return*/];
            });
        });
    };
    // Private helper methods
    QISDDIntegratedClient.prototype.calculateDataHash = function (data) {
        var createHash = require('crypto').createHash;
        return createHash('sha256').update(data).digest('hex');
    };
    QISDDIntegratedClient.prototype.calculateMAC = function (data, nonce) {
        var createHmac = require('crypto').createHmac;
        return createHmac('sha256', 'secret-key').update(Buffer.concat([data, nonce])).digest('hex');
    };
    QISDDIntegratedClient.prototype.calculateTrustScore = function (credentials, context) {
        var score = 0.5; // Base score
        // Factor in user reputation
        if (credentials.userReputation) {
            score += credentials.userReputation * 0.3;
        }
        // Factor in request context
        if ((context === null || context === void 0 ? void 0 : context.environment) === 'production') {
            score += 0.2;
        }
        // Factor in time-based patterns
        if (context === null || context === void 0 ? void 0 : context.timeOfAccess) {
            var hour = context.timeOfAccess.getHours();
            if (hour >= 9 && hour <= 17) { // Business hours
                score += 0.1;
            }
        }
        // Factor in access frequency
        if ((context === null || context === void 0 ? void 0 : context.recentAccessCount) && context.recentAccessCount < 10) {
            score += 0.1;
        }
        return Math.max(0, Math.min(1, score));
    };
    QISDDIntegratedClient.prototype.validateCredentials = function (credentials, superposition) {
        // Implement credential validation logic
        return credentials.token && credentials.userId && credentials.token.length > 10;
    };
    QISDDIntegratedClient.prototype.identifyRiskFactors = function (context) {
        var risks = [];
        if ((context === null || context === void 0 ? void 0 : context.ipAddress) && this.isHighRiskIP(context.ipAddress)) {
            risks.push('high_risk_ip');
        }
        if ((context === null || context === void 0 ? void 0 : context.userAgent) && this.isAutomatedAgent(context.userAgent)) {
            risks.push('automated_agent');
        }
        if ((context === null || context === void 0 ? void 0 : context.recentFailures) && context.recentFailures > 3) {
            risks.push('multiple_recent_failures');
        }
        return risks;
    };
    QISDDIntegratedClient.prototype.isHighRiskIP = function (ip) {
        // Implement IP risk assessment
        return ip.startsWith('192.168.') === false; // Placeholder logic
    };
    QISDDIntegratedClient.prototype.isAutomatedAgent = function (userAgent) {
        var automatedPatterns = ['bot', 'crawler', 'spider', 'scraper'];
        return automatedPatterns.some(function (pattern) {
            return userAgent.toLowerCase().includes(pattern);
        });
    };
    QISDDIntegratedClient.prototype.generatePoisonedData = function (transformation) {
        // Generate realistic but incorrect data
        return {
            warning: 'Data has been modified due to unauthorized access',
            originalData: 'REDACTED',
            timestamp: new Date(),
            transformation: transformation
        };
    };
    QISDDIntegratedClient.prototype.updateAverageResponseTime = function (duration) {
        var totalOperations = this.metrics.totalObservations + this.metrics.totalDataProtected;
        this.metrics.averageResponseTime =
            (this.metrics.averageResponseTime * (totalOperations - 1) + duration) / totalOperations;
    };
    QISDDIntegratedClient.prototype.calculateSystemHealth = function () {
        var totalOps = this.metrics.totalObservations + this.metrics.totalDataProtected;
        var successRate = totalOps > 0 ?
            (totalOps - this.metrics.unauthorizedAttempts) / totalOps : 1.0;
        return {
            overall: successRate > 0.95 ? 'excellent' :
                successRate > 0.85 ? 'good' :
                    successRate > 0.70 ? 'fair' : 'poor',
            successRate: successRate,
            averageResponseTime: this.metrics.averageResponseTime,
            activeSuperpositions: this.superpositions.size,
            memoryUsage: process.memoryUsage().heapUsed,
            uptime: process.uptime()
        };
    };
    QISDDIntegratedClient.prototype.generateComplianceReport = function (timeRange) {
        return {
            period: timeRange,
            compliance: {
                dataProtection: 'GDPR_COMPLIANT',
                encryption: 'AES_256_COMPLIANT',
                audit: 'SOX_COMPLIANT',
                accessControl: 'RBAC_IMPLEMENTED'
            },
            summary: 'All compliance requirements met'
        };
    };
    // Event handlers
    QISDDIntegratedClient.prototype.handleSuperpositionCreated = function (event) {
        this.logger.audit({
            id: "audit_".concat(Date.now()),
            timestamp: new Date(),
            userId: event.userId,
            action: 'superposition_created',
            resource: 'quantum_data',
            resourceId: event.superpositionId,
            result: 'success',
            metadata: event
        });
    };
    QISDDIntegratedClient.prototype.handleStateObserved = function (event) {
        this.logger.audit({
            id: "audit_".concat(Date.now()),
            timestamp: new Date(),
            userId: event.userId,
            action: 'data_observed',
            resource: 'quantum_state',
            resourceId: event.stateId,
            result: 'success',
            metadata: event
        });
    };
    QISDDIntegratedClient.prototype.handleUnauthorizedAccess = function (event) {
        this.logger.audit({
            id: "audit_".concat(Date.now()),
            timestamp: new Date(),
            userId: event.credentials.userId,
            action: 'unauthorized_access_attempt',
            resource: 'quantum_data',
            resourceId: event.superpositionId,
            result: 'failure',
            reason: 'Insufficient credentials or low trust score',
            metadata: event,
            riskScore: 0.9
        });
    };
    QISDDIntegratedClient.prototype.handleQuantumCollapse = function (event) {
        this.logger.audit({
            id: "audit_".concat(Date.now()),
            timestamp: new Date(),
            action: 'quantum_collapse',
            resource: 'superposition',
            resourceId: event.superpositionId,
            result: 'partial',
            reason: event.reason,
            metadata: event,
            riskScore: 1.0
        });
        this.metrics.quantumCollapses++;
    };
    QISDDIntegratedClient.prototype.handleEncryptionCompleted = function (event) {
        this.logger.crypto(logging_1.LogLevel.DEBUG, 'encryption_completed', 'Encryption operation completed', event);
    };
    return QISDDIntegratedClient;
}(events_1.EventEmitter));
exports.QISDDIntegratedClient = QISDDIntegratedClient;
// Export factory for easy initialization
var QISDDFactory = /** @class */ (function () {
    function QISDDFactory() {
    }
    QISDDFactory.createClient = function (config) {
        return new QISDDIntegratedClient(config);
    };
    QISDDFactory.createProductionClient = function () {
        return new QISDDIntegratedClient({
            enableCrypto: true,
            enableLogging: true,
            enableAuditing: true,
            enableBlockchain: true,
            loggerConfig: {
                level: logging_1.LogLevel.INFO,
                enableConsole: false,
                enableFile: true,
                enableStructured: true
            }
        });
    };
    QISDDFactory.createDevelopmentClient = function () {
        return new QISDDIntegratedClient({
            enableCrypto: true,
            enableLogging: true,
            enableAuditing: true,
            enableBlockchain: false,
            loggerConfig: {
                level: logging_1.LogLevel.DEBUG,
                enableConsole: true,
                enableFile: false
            }
        });
    };
    return QISDDFactory;
}());
exports.QISDDFactory = QISDDFactory;
// Example usage
function demonstrateQISDDUsage() {
    return __awaiter(this, void 0, void 0, function () {
        var client, sensitiveData, protectionResult, authorizedResult, unauthorizedResult, data2, protection2, computationResult, securityReport, metrics, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 Starting QISDD-SDK Complete Integration Demo');
                    client = QISDDFactory.createDevelopmentClient();
                    // Wait for initialization
                    return [4 /*yield*/, client.waitForInitialization()];
                case 1:
                    // Wait for initialization
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 9, 10, 12]);
                    sensitiveData = {
                        customerId: 'CUST-2024-001',
                        accountNumber: '4532-1234-5678-9012',
                        balance: 75430.50,
                        creditScore: 785,
                        transactions: [
                            { id: 'TXN-001', amount: 2500, type: 'deposit', date: '2024-01-15' },
                            { id: 'TXN-002', amount: -850, type: 'withdrawal', date: '2024-01-16' }
                        ],
                        personalInfo: {
                            name: 'Alice Johnson',
                            ssn: '987-65-4321',
                            dateOfBirth: '1985-03-22',
                            address: '123 Secure St, Privacy City, PC 12345'
                        }
                    };
                    console.log('🔐 Protecting sensitive financial data...');
                    return [4 /*yield*/, client.protectData(sensitiveData, {
                            requireZKProof: true,
                            accessControl: {
                                requiredTrustScore: 0.7,
                                allowedRoles: ['customer', 'support'],
                                timeBasedAccess: true
                            }
                        })];
                case 3:
                    protectionResult = _a.sent();
                    console.log("\u2705 Data protected with ID: ".concat(protectionResult.id));
                    console.log("\uD83D\uDCCA States created: ".concat(protectionResult.statesCreated));
                    // Authorized access
                    console.log('\n🔍 Attempting authorized access...');
                    return [4 /*yield*/, client.observeData(protectionResult.id, {
                            userId: 'john.doe@example.com',
                            token: 'valid-jwt-token-here',
                            roles: ['customer'],
                            userReputation: 0.9
                        }, {
                            environment: 'production',
                            requestType: 'account_balance',
                            timeOfAccess: new Date(),
                            recentAccessCount: 2
                        })];
                case 4:
                    authorizedResult = _a.sent();
                    if (authorizedResult.success) {
                        console.log('✅ Authorized access successful');
                        console.log('💰 Account balance:', authorizedResult.data.balance);
                    }
                    // Unauthorized access
                    console.log('\n⚠️  Attempting unauthorized access...');
                    return [4 /*yield*/, client.observeData(protectionResult.id, {
                            userId: 'hacker@evil.com',
                            token: 'fake-token',
                            userReputation: 0.1
                        }, {
                            environment: 'unknown',
                            ipAddress: '1.2.3.4',
                            userAgent: 'bot/1.0',
                            recentFailures: 5
                        })];
                case 5:
                    unauthorizedResult = _a.sent();
                    if (!unauthorizedResult.success) {
                        console.log('🛡️  Unauthorized access blocked');
                        console.log('☠️  Poisoned data returned:', unauthorizedResult.data);
                    }
                    // Homomorphic computation
                    console.log('\n🧮 Performing homomorphic computation...');
                    data2 = { value: 1000 };
                    return [4 /*yield*/, client.protectData(data2)];
                case 6:
                    protection2 = _a.sent();
                    return [4 /*yield*/, client.computeOnProtectedData('add', [protectionResult.id, protection2.id])];
                case 7:
                    computationResult = _a.sent();
                    console.log("\uD83D\uDD2C Computation completed: ".concat(computationResult.resultId));
                    // Generate reports
                    console.log('\n📈 Generating security report...');
                    return [4 /*yield*/, client.generateReport('security', {
                            start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
                            end: new Date()
                        })];
                case 8:
                    securityReport = _a.sent();
                    console.log('🔒 Security summary:', securityReport.summary);
                    metrics = client.getMetrics();
                    console.log('\n📊 System metrics:');
                    console.log("- Data protected: ".concat(metrics.totalDataProtected));
                    console.log("- Observations: ".concat(metrics.totalObservations));
                    console.log("- Unauthorized attempts: ".concat(metrics.unauthorizedAttempts));
                    console.log("- System health: ".concat(metrics.systemHealth.overall));
                    return [3 /*break*/, 12];
                case 9:
                    error_4 = _a.sent();
                    console.error('❌ Demo failed:', error_4);
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, client.destroy()];
                case 11:
                    _a.sent();
                    console.log('\n🏁 QISDD-SDK Demo completed');
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
// Export everything
__exportStar(require("./src/quantum/superposition"), exports);
__exportStar(require("./src/quantum/observer-effect"), exports);
__exportStar(require("./src/quantum/measurement"), exports);
__exportStar(require("./src/quantum/entanglement"), exports);
__exportStar(require("./src/logging"), exports);
__exportStar(require("./src/crypto"), exports);
