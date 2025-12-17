"use strict";
/**
 * QISDD Interactive Security Demo
 * Shows how quantum-inspired security stops hackers in real-time
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
exports.QISDDInteractiveTester = void 0;
exports.runInteractiveDemo = runInteractiveDemo;
var simple_demo_1 = require("./security/simple-demo");
function runInteractiveDemo() {
    return __awaiter(this, void 0, void 0, function () {
        var demo, results, threats, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 QISDD QUANTUM-INSPIRED SECURITY DEMONSTRATION');
                    console.log('===============================================');
                    console.log('This demo shows how QISDD protects your data from hackers\n');
                    demo = new simple_demo_1.QISDDDemo();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, demo.runCompleteDemo()];
                case 2:
                    results = _a.sent();
                    // Show detailed results
                    console.log('\n📋 DETAILED PROTECTION RESULTS:');
                    results.protectionResults.forEach(function (result, index) {
                        console.log("\n".concat(index + 1, ". ").concat(result.item.name, ":"));
                        console.log("   Status: ".concat(result.success ? '✅ Protected' : '❌ Failed'));
                        console.log("   Attacks Blocked: ".concat(result.attacksBlocked.filter(function (a) { return a.blocked; }).length, "/").concat(result.attacksBlocked.length));
                        console.log("   Protection Time: ".concat(result.item.protectionTime, "ms"));
                        // Show specific attacks blocked
                        result.attacksBlocked.forEach(function (attack) {
                            if (attack.blocked) {
                                console.log("   \uD83D\uDEE1\uFE0F  Blocked: ".concat(attack.threatId, " (").concat(attack.reason, ")"));
                            }
                        });
                    });
                    console.log('\n🚨 MAJOR ATTACK SIMULATION:');
                    console.log(results.majorAttackResult.summary);
                    console.log('\n📊 FINAL SECURITY STATISTICS:');
                    console.log("   Total Data Items: ".concat(results.finalStats.totalDataItems));
                    console.log("   Successfully Protected: ".concat(results.finalStats.successfullyProtected));
                    console.log("   Total Attacks Blocked: ".concat(results.finalStats.totalAttacksBlocked));
                    console.log("   Overall Success Rate: ".concat(results.finalStats.successRate, "%"));
                    console.log("   Average Response Time: ".concat(results.finalStats.averageProtectionTime, "ms"));
                    // Show threat intelligence
                    console.log('\n🔍 THREAT INTELLIGENCE - Types of Attacks QISDD Can Block:');
                    threats = demo.getKnownThreats();
                    threats.forEach(function (threat, index) {
                        console.log("".concat(index + 1, ". ").concat(threat.name, " (").concat(threat.severity.toUpperCase(), ")"));
                        console.log("   Vector: ".concat(threat.attackVector));
                        console.log("   Description: ".concat(threat.description));
                    });
                    return [2 /*return*/, results];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Demo failed:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Interactive functions for manual testing
var QISDDInteractiveTester = /** @class */ (function () {
    function QISDDInteractiveTester() {
        this.demo = new simple_demo_1.QISDDDemo();
    }
    /**
     * Protect a single piece of data (for manual testing)
     */
    QISDDInteractiveTester.prototype.protectMyData = function (name_1, content_1) {
        return __awaiter(this, arguments, void 0, function (name, content, type) {
            var result;
            if (type === void 0) { type = 'other'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\n\uD83D\uDD10 Protecting your data: \"".concat(name, "\""));
                        return [4 /*yield*/, this.demo.addData(name, content, type)];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            console.log("\u2705 Success! Your \"".concat(name, "\" is now quantum-protected"));
                            console.log("\uD83D\uDEE1\uFE0F  Blocked ".concat(result.attacksBlocked.filter(function (a) { return a.blocked; }).length, " hacker attacks during protection"));
                        }
                        else {
                            console.log("\u274C Protection failed: ".concat(result.message));
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Simulate hackers trying to attack your data
     */
    QISDDInteractiveTester.prototype.simulateHackerAttack = function () {
        console.log('\n💀 SIMULATING HACKER ATTACK ON YOUR PROTECTED DATA...');
        return this.demo.simulateMajorAttack();
    };
    /**
     * Get current protection status
     */
    QISDDInteractiveTester.prototype.getProtectionStatus = function () {
        var stats = this.demo.getStats();
        console.log('\n📊 YOUR DATA PROTECTION STATUS:');
        console.log("   \uD83D\uDCC1 Protected Items: ".concat(stats.successfullyProtected, "/").concat(stats.totalDataItems));
        console.log("   \uD83D\uDEE1\uFE0F  Attacks Blocked: ".concat(stats.totalAttacksBlocked));
        console.log("   \u26A1 Success Rate: ".concat(stats.successRate, "%"));
        console.log("   \uD83D\uDCCA Average Protection Time: ".concat(stats.averageProtectionTime, "ms"));
        return stats;
    };
    /**
     * Show what types of hackers QISDD can stop
     */
    QISDDInteractiveTester.prototype.showThreatIntelligence = function () {
        var threats = this.demo.getKnownThreats();
        console.log('\n🎯 HACKERS & THREATS QISDD CAN STOP:');
        threats.forEach(function (threat, index) {
            var severityEmoji = {
                low: '🟢',
                medium: '🟡',
                high: '🟠',
                critical: '🔴'
            }[threat.severity];
            console.log("\n".concat(index + 1, ". ").concat(severityEmoji, " ").concat(threat.name));
            console.log("   Attack Method: ".concat(threat.attackVector));
            console.log("   What It Does: ".concat(threat.description));
            console.log("   Techniques: ".concat(threat.techniques.join(', ')));
        });
        return threats;
    };
    return QISDDInteractiveTester;
}());
exports.QISDDInteractiveTester = QISDDInteractiveTester;
// Run demo if called directly
if (require.main === module) {
    runInteractiveDemo()
        .then(function () {
        console.log('\n✅ Demo completed successfully!');
        console.log('🔒 Your data is now protected by QISDD quantum-inspired security');
        process.exit(0);
    })
        .catch(function (error) {
        console.error('\n❌ Demo failed:', error);
        process.exit(1);
    });
}
