"use strict";
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
// run-basic.ts
// Update the import path to the correct location of QISDDFactory
var complete_integration_example_1 = require("../src/complete-integration-example");
function runBasicTest() {
    return __awaiter(this, void 0, void 0, function () {
        var client, testData, protection, authorized, unauthorized, auditTrail, metrics;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 Starting QISDD Quantum Superposition Test\n');
                    client = complete_integration_example_1.QISDDFactory.createDevelopmentClient();
                    // Wait for initialization
                    return [4 /*yield*/, client.waitForInitialization()];
                case 1:
                    // Wait for initialization
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 7]);
                    testData = {
                        message: 'Hello Quantum World!',
                        secret: 'classified-123',
                        timestamp: new Date()
                    };
                    console.log('1️⃣ Protecting data with quantum superposition...');
                    return [4 /*yield*/, client.protectData(testData)];
                case 3:
                    protection = _a.sent();
                    console.log("   \u2705 Protected with ID: ".concat(protection.id));
                    console.log("   \uD83D\uDD22 Quantum states: ".concat(protection.statesCreated));
                    console.log('\n2️⃣ Testing authorized access...');
                    return [4 /*yield*/, client.observeData(protection.id, {
                            userId: 'test@example.com',
                            token: 'valid-token',
                            userReputation: 0.9
                        })];
                case 4:
                    authorized = _a.sent();
                    console.log("   \u2705 Success: ".concat(authorized.success));
                    console.log("   \uD83D\uDCCA Trust: ".concat(authorized.trustScore));
                    console.log('\n3️⃣ Testing unauthorized access...');
                    return [4 /*yield*/, client.observeData(protection.id, {
                            userId: 'hacker@evil.com',
                            token: 'fake-token',
                            userReputation: 0.1
                        })];
                case 5:
                    unauthorized = _a.sent();
                    console.log("   \uD83D\uDEE1\uFE0F Blocked: ".concat(!unauthorized.success));
                    console.log("   \u26A0\uFE0F Poisoned: ".concat(!!unauthorized.data._qisdd_warning));
                    // Test audit trail
                    console.log('\n4️⃣ Querying audit trail...');
                    auditTrail = client.getAuditTrail({ resourceId: protection.id });
                    console.log('   📝 Audit events:', auditTrail);
                    console.log('\n📊 Final Metrics:');
                    metrics = client.getMetrics();
                    console.log(JSON.stringify(metrics, null, 2));
                    return [3 /*break*/, 7];
                case 6: return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Run the test
runBasicTest().catch(console.error);
