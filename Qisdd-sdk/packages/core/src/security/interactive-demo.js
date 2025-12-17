"use strict";
/**
 * Interactive Data Protection Demo - Shows how QISDD protects user data
 */
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
exports.InteractiveDataProtection = void 0;
var index_1 = require("../index");
var threat_simulator_1 = require("./threat-simulator");
var InteractiveDataProtection = /** @class */ (function () {
    function InteractiveDataProtection() {
        this.protectedData = new Map();
        this.qisddCore = new index_1.QISDDIntegratedClient();
        this.threatSimulator = new threat_simulator_1.ThreatSimulator();
    }
    /**
     * Add and protect new data with quantum-inspired security
     */
    InteractiveDataProtection.prototype.addProtectedData = function (name_1, content_1) {
        return __awaiter(this, arguments, void 0, function (name, content, type, protectionLevel) {
            var startTime, dataId, attacksDetected, protectionResult, quantumStates, zkProofGenerated, error_1, endTime, encryptionTime, dataItem, error_2, dataItem;
            if (type === void 0) { type = 'other'; }
            if (protectionLevel === void 0) { protectionLevel = 'enhanced'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        dataId = "QISDD_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
                        attacksDetected = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.qisddCore.protectData(dataId, content, {
                                enableCrypto: protectionLevel !== 'basic',
                                enableSuperposition: true,
                                enableLogging: true,
                                trustThreshold: protectionLevel === 'quantum' ? 0.9 : 0.7
                            })];
                    case 2:
                        protectionResult = _a.sent();
                        // Simulate attack during protection
                        if (Math.random() > 0.7) {
                            attacksDetected.push(this.threatSimulator.simulateAttack());
                        }
                        quantumStates = protectionLevel === 'quantum' ? 3 : protectionLevel === 'enhanced' ? 2 : 1;
                        zkProofGenerated = false;
                        if (!(protectionLevel !== 'basic')) return [3 /*break*/, 6];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.qisddCore.observeData(dataId, {
                                includeMetrics: true,
                                validateIntegrity: true
                            })];
                    case 4:
                        _a.sent();
                        zkProofGenerated = true;
                        // Simulate advanced attack during observation
                        if (Math.random() > 0.5) {
                            attacksDetected.push(this.threatSimulator.simulateAttack());
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        endTime = Date.now();
                        encryptionTime = endTime - startTime;
                        dataItem = {
                            id: dataId,
                            name: name,
                            type: type,
                            size: content.length,
                            protectionLevel: protectionLevel,
                            timestamp: new Date(),
                            quantumStateId: quantumStateId,
                            encryptionKey: encryptionResult.encryptedData.substring(0, 16) + '...', // Show partial key
                            zkProofId: zkProofId
                        };
                        this.protectedData.set(dataId, dataItem);
                        return [2 /*return*/, {
                                success: true,
                                dataItem: dataItem,
                                protectionDetails: {
                                    quantumStatesUsed: quantumStates,
                                    encryptionTime: encryptionTime,
                                    zkProofGenerated: !!zkProofId,
                                    trustScore: this.calculateDataTrustScore(attacksDetected, protectionLevel)
                                },
                                securityEvents: attacksDetected
                            }];
                    case 7:
                        error_2 = _a.sent();
                        // Even if protection fails, simulate some attacks
                        attacksDetected.push(this.threatSimulator.simulateAttack());
                        dataItem = {
                            id: dataId,
                            name: name,
                            type: type,
                            size: content.length,
                            protectionLevel: 'basic', // Fallback to basic
                            timestamp: new Date()
                        };
                        return [2 /*return*/, {
                                success: false,
                                dataItem: dataItem,
                                protectionDetails: {
                                    quantumStatesUsed: 0,
                                    encryptionTime: Date.now() - startTime,
                                    zkProofGenerated: false,
                                    trustScore: 25 // Low trust due to failure
                                },
                                securityEvents: attacksDetected
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Simulate a coordinated attack on all protected data
     */
    InteractiveDataProtection.prototype.simulateMajorAttack = function () {
        console.log('🚨 SIMULATING MAJOR COORDINATED ATTACK ON PROTECTED DATA...');
        var attacks = [];
        // Simulate APT (Advanced Persistent Threat)
        attacks.push.apply(attacks, this.threatSimulator.simulateAdvancedPersistentThreat());
        // Add some individual attacks
        for (var i = 0; i < Math.random() * 3 + 2; i++) {
            attacks.push(this.threatSimulator.simulateAttack());
        }
        // Show how QISDD blocked them
        var blockedCount = attacks.filter(function (a) { return a.blocked; }).length;
        console.log("\u2705 QISDD SUCCESSFULLY BLOCKED ".concat(blockedCount, "/").concat(attacks.length, " ATTACKS"));
        return attacks;
    };
    /**
     * Get all protected data items
     */
    InteractiveDataProtection.prototype.getProtectedData = function () {
        return Array.from(this.protectedData.values());
    };
    /**
     * Get protection statistics
     */
    InteractiveDataProtection.prototype.getProtectionStats = function () {
        var data = this.getProtectedData();
        var totalSize = data.reduce(function (sum, item) { return sum + item.size; }, 0);
        var typeDistribution = data.reduce(function (dist, item) {
            dist[item.type] = (dist[item.type] || 0) + 1;
            return dist;
        }, {});
        return {
            totalItems: data.length,
            totalSizeBytes: totalSize,
            typeDistribution: typeDistribution,
            protectionLevels: {
                basic: data.filter(function (d) { return d.protectionLevel === 'basic'; }).length,
                enhanced: data.filter(function (d) { return d.protectionLevel === 'enhanced'; }).length,
                quantum: data.filter(function (d) { return d.protectionLevel === 'quantum'; }).length
            }
        };
    };
    InteractiveDataProtection.prototype.calculateDataTrustScore = function (attacks, protectionLevel) {
        var baseScore = protectionLevel === 'quantum' ? 95 : protectionLevel === 'enhanced' ? 85 : 70;
        var attackPenalty = attacks.filter(function (a) { return !a.blocked; }).length * 10;
        var attackBonus = attacks.filter(function (a) { return a.blocked; }).length * 2;
        return Math.max(10, Math.min(100, baseScore - attackPenalty + attackBonus));
    };
    /**
     * Demo scenario: Protect different types of sensitive data
     */
    InteractiveDataProtection.prototype.runDataProtectionDemo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var demoData, results, _i, demoData_1, data, result, majorAttack, stats, blockedAttacks, summary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔒 Starting QISDD Data Protection Demo...\n');
                        demoData = [
                            { name: 'Customer Credit Cards', content: 'Credit card numbers: 4532-1234-5678-9012, 5678-9012-3456-7890', type: 'financial', protection: 'quantum' },
                            { name: 'Medical Records', content: 'Patient ID: 12345, Diagnosis: Confidential medical information', type: 'medical', protection: 'quantum' },
                            { name: 'Employee SSNs', content: 'Social Security Numbers: 123-45-6789, 987-65-4321', type: 'personal', protection: 'enhanced' },
                            { name: 'API Keys', content: 'AWS_KEY=abc123def456, DB_PASSWORD=supersecret789', type: 'business', protection: 'enhanced' },
                            { name: 'User Emails', content: 'user@example.com, admin@company.com, support@domain.org', type: 'personal', protection: 'basic' }
                        ];
                        results = [];
                        _i = 0, demoData_1 = demoData;
                        _a.label = 1;
                    case 1:
                        if (!(_i < demoData_1.length)) return [3 /*break*/, 4];
                        data = demoData_1[_i];
                        console.log("Protecting: ".concat(data.name, "..."));
                        return [4 /*yield*/, this.addProtectedData(data.name, data.content, data.type, data.protection)];
                    case 2:
                        result = _a.sent();
                        results.push(result);
                        console.log("\u2705 ".concat(data.name, " protected with ").concat(result.protectionDetails.quantumStatesUsed, " quantum states"));
                        if (result.securityEvents.length > 0) {
                            console.log("\uD83D\uDEE1\uFE0F  Blocked ".concat(result.securityEvents.filter(function (e) { return e.blocked; }).length, " attacks during protection"));
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        // Simulate major attack after all data is protected
                        console.log('\n🚨 SIMULATING COORDINATED HACKER ATTACK...');
                        majorAttack = this.simulateMajorAttack();
                        stats = this.getProtectionStats();
                        blockedAttacks = majorAttack.filter(function (a) { return a.blocked; }).length;
                        summary = "\n\uD83C\uDFAF DEMO COMPLETE! \n\uD83D\uDCCA Protected ".concat(stats.totalItems, " data items (").concat(stats.totalSizeBytes, " bytes)\n\uD83D\uDEE1\uFE0F  Generated ").concat(results.reduce(function (sum, r) { return sum + r.protectionDetails.quantumStatesUsed; }, 0), " quantum states\n\uD83D\uDEAB Blocked ").concat(blockedAttacks, "/").concat(majorAttack.length, " coordinated attacks (").concat(Math.round(blockedAttacks / majorAttack.length * 100), "% success rate)\n\u26A1 Average protection time: ").concat(Math.round(results.reduce(function (sum, r) { return sum + r.protectionDetails.encryptionTime; }, 0) / results.length), "ms\n");
                        console.log(summary);
                        return [2 /*return*/, { results: results, majorAttack: majorAttack, summary: summary }];
                }
            });
        });
    };
    return InteractiveDataProtection;
}());
exports.InteractiveDataProtection = InteractiveDataProtection;
