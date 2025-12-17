"use strict";
/**
 * Simple Interactive Demo - Shows how QISDD protects data and blocks hackers
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
exports.QISDDDemo = void 0;
var index_1 = require("../index");
var threat_simulator_1 = require("./threat-simulator");
var QISDDDemo = /** @class */ (function () {
    function QISDDDemo() {
        this.protectedData = [];
        this.totalAttacksBlocked = 0;
        this.qisddClient = new index_1.QISDDIntegratedClient();
        this.threatSimulator = new threat_simulator_1.ThreatSimulator();
    }
    /**
     * Add and protect new data - this is what users will see
     */
    QISDDDemo.prototype.addData = function (name_1, content_1) {
        return __awaiter(this, arguments, void 0, function (name, content, type) {
            var startTime, dataId, attacksDetected, numAttacks, i, attack, protectionTime, blockedCount, item, message, error_1, item;
            if (type === void 0) { type = 'other'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        dataId = "QISDD_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 6));
                        console.log("\n\uD83D\uDD12 Protecting \"".concat(name, "\" with QISDD quantum security..."));
                        attacksDetected = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        numAttacks = Math.floor(Math.random() * 3) + 1;
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < numAttacks)) return [3 /*break*/, 5];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 3:
                        _a.sent(); // Realistic timing
                        attack = this.threatSimulator.simulateAttack();
                        attacksDetected.push(attack);
                        if (attack.blocked) {
                            console.log("\uD83D\uDEE1\uFE0F  BLOCKED: ".concat(attack.reason));
                            this.totalAttacksBlocked++;
                        }
                        else {
                            console.log("\u26A0\uFE0F  DETECTED: ".concat(attack.reason, " (analyzing...)"));
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: 
                    // Use actual QISDD protection
                    return [4 /*yield*/, this.qisddClient.protectData(content)];
                    case 6:
                        // Use actual QISDD protection
                        _a.sent();
                        protectionTime = Date.now() - startTime;
                        blockedCount = attacksDetected.filter(function (a) { return a.blocked; }).length;
                        item = {
                            id: dataId,
                            name: name,
                            content: content,
                            type: type,
                            protected: true,
                            timestamp: new Date(),
                            protectionTime: protectionTime,
                            attacksBlocked: blockedCount
                        };
                        this.protectedData.push(item);
                        message = "\u2705 \"".concat(name, "\" protected! Blocked ").concat(blockedCount, "/").concat(attacksDetected.length, " attacks in ").concat(protectionTime, "ms");
                        console.log(message);
                        return [2 /*return*/, {
                                success: true,
                                item: item,
                                attacksBlocked: attacksDetected,
                                message: message
                            }];
                    case 7:
                        error_1 = _a.sent();
                        item = {
                            id: dataId,
                            name: name,
                            content: content,
                            type: type,
                            protected: false,
                            timestamp: new Date(),
                            protectionTime: Date.now() - startTime
                        };
                        return [2 /*return*/, {
                                success: false,
                                item: item,
                                attacksBlocked: attacksDetected,
                                message: "\u274C Failed to protect \"".concat(name, "\": ").concat(error_1)
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Simulate a major coordinated attack on all protected data
     */
    QISDDDemo.prototype.simulateMajorAttack = function () {
        var _this = this;
        console.log('\n🚨 SIMULATING COORDINATED HACKER ATTACK ON ALL PROTECTED DATA...');
        console.log('💀 Advanced Persistent Threat (APT) detected!');
        var attacks = [];
        // Simulate APT attack phases
        attacks.push.apply(attacks, this.threatSimulator.simulateAdvancedPersistentThreat());
        // Add individual attacks targeting each data type
        var dataTypes = Array.from(new Set(this.protectedData.map(function (d) { return d.type; })));
        dataTypes.forEach(function (type) {
            attacks.push(_this.threatSimulator.simulateAttack());
        });
        var blockedCount = attacks.filter(function (a) { return a.blocked; }).length;
        var successRate = Math.round((blockedCount / attacks.length) * 100);
        console.log("\n\uD83D\uDEE1\uFE0F  QISDD DEFENSE RESULTS:");
        console.log("   \u2705 Blocked: ".concat(blockedCount, "/").concat(attacks.length, " attacks"));
        console.log("   \uD83D\uDCCA Success Rate: ".concat(successRate, "%"));
        console.log("   \u26A1 Average Response: ".concat(Math.round(attacks.reduce(function (sum, a) { return sum + a.responseTime; }, 0) / attacks.length), "ms"));
        var summary = "MAJOR ATTACK NEUTRALIZED! QISDD blocked ".concat(blockedCount, "/").concat(attacks.length, " attacks (").concat(successRate, "% success rate)");
        this.totalAttacksBlocked += blockedCount;
        return { attacks: attacks, summary: summary };
    };
    /**
     * Get demo statistics for dashboard
     */
    QISDDDemo.prototype.getStats = function () {
        var totalItems = this.protectedData.length;
        var protectedItems = this.protectedData.filter(function (d) { return d.protected; }).length;
        var totalSize = this.protectedData.reduce(function (sum, item) { return sum + item.content.length; }, 0);
        var avgProtectionTime = this.protectedData.reduce(function (sum, item) { return sum + (item.protectionTime || 0); }, 0) / totalItems || 0;
        return {
            totalDataItems: totalItems,
            successfullyProtected: protectedItems,
            totalAttacksBlocked: this.totalAttacksBlocked,
            successRate: totalItems > 0 ? Math.round((protectedItems / totalItems) * 100) : 0,
            totalDataSize: totalSize,
            averageProtectionTime: Math.round(avgProtectionTime),
            protectedData: this.protectedData
        };
    };
    /**
     * Run the complete demo scenario
     */
    QISDDDemo.prototype.runCompleteDemo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sampleData, protectionResults, _i, sampleData_1, data, result, majorAttackResult, finalStats, demoSummary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🎯 STARTING QISDD COMPLETE SECURITY DEMO');
                        console.log('=======================================');
                        sampleData = [
                            { name: 'Customer Credit Cards', content: 'CC: 4532-1234-5678-9012, 5555-4444-3333-2222', type: 'financial' },
                            { name: 'Medical Records', content: 'Patient: John Doe, SSN: 123-45-6789, Diagnosis: Confidential', type: 'medical' },
                            { name: 'API Keys & Passwords', content: 'AWS_KEY=AKIAIOSFODNN7EXAMPLE, DB_PASS=SuperSecret123!', type: 'business' },
                            { name: 'Employee Personal Info', content: 'Employees: alice@company.com, bob@company.com, SSNs: 987-65-4321', type: 'personal' },
                            { name: 'Business Contracts', content: 'Contract #2024-001: $2.5M deal with ACME Corp, confidential terms...', type: 'business' }
                        ];
                        protectionResults = [];
                        _i = 0, sampleData_1 = sampleData;
                        _a.label = 1;
                    case 1:
                        if (!(_i < sampleData_1.length)) return [3 /*break*/, 5];
                        data = sampleData_1[_i];
                        return [4 /*yield*/, this.addData(data.name, data.content, data.type)];
                    case 2:
                        result = _a.sent();
                        protectionResults.push(result);
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 3:
                        _a.sent(); // Realistic timing
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        majorAttackResult = this.simulateMajorAttack();
                        finalStats = this.getStats();
                        demoSummary = "\n\uD83C\uDFAF QISDD SECURITY DEMO COMPLETE!\n================================\n\uD83D\uDCCA DATA PROTECTED: ".concat(finalStats.totalDataItems, " items (").concat(finalStats.totalDataSize, " bytes)\n\uD83D\uDEE1\uFE0F  ATTACKS BLOCKED: ").concat(finalStats.totalAttacksBlocked, " total threats neutralized  \n\u26A1 PERFORMANCE: ").concat(finalStats.averageProtectionTime, "ms average protection time\n\uD83C\uDFAF SUCCESS RATE: ").concat(finalStats.successRate, "% data protection success\n\uD83D\uDEAB HACKERS STOPPED: SQL injection, ransomware, phishing, DDoS, zero-day exploits\n\n\u2705 Your sensitive data is now protected by quantum-inspired security!\n");
                        console.log(demoSummary);
                        return [2 /*return*/, {
                                protectionResults: protectionResults,
                                majorAttackResult: majorAttackResult,
                                finalStats: finalStats,
                                demoSummary: demoSummary
                            }];
                }
            });
        });
    };
    /**
     * Get all threats for educational purposes
     */
    QISDDDemo.prototype.getKnownThreats = function () {
        return this.threatSimulator.getAllThreats();
    };
    return QISDDDemo;
}());
exports.QISDDDemo = QISDDDemo;
