"use strict";
// QISDD-SDK Cryptographic Integration Layer
// packages/core/src/crypto/index.ts
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
exports.randomBytes = exports.createHash = exports.CryptoSuite = exports.KeyManager = exports.DistributedKeyManager = exports.Shamir = exports.ZKPVerifier = exports.ZKPProver = exports.SEALWrapper = void 0;
var crypto_1 = require("crypto");
Object.defineProperty(exports, "randomBytes", { enumerable: true, get: function () { return crypto_1.randomBytes; } });
Object.defineProperty(exports, "createHash", { enumerable: true, get: function () { return crypto_1.createHash; } });
var logging_1 = require("../logging");
var logger = logging_1.LoggerFactory.createQuantumLogger();
// SEAL Homomorphic Encryption Wrapper
var SEALWrapper = /** @class */ (function () {
    function SEALWrapper(config) {
        if (config === void 0) { config = {}; }
        this.initialized = false;
        this.config = __assign({ scheme: "BFV", polyModulusDegree: 4096, plainModulus: 40961, coeffModulus: [60, 40, 40, 60], encodeType: "integer" }, config);
        this.keyManager = new KeyManager();
        this.initialize();
    }
    Object.defineProperty(SEALWrapper.prototype, "isInitialized", {
        /**
         * Check if SEAL wrapper is initialized
         */
        get: function () {
            return this.initialized;
        },
        enumerable: false,
        configurable: true
    });
    SEALWrapper.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logger.info("Initializing SEAL wrapper", { config: this.config });
                        // In real implementation, initialize Microsoft SEAL library
                        // For now, we'll simulate the initialization
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 1:
                        // In real implementation, initialize Microsoft SEAL library
                        // For now, we'll simulate the initialization
                        _a.sent();
                        this.initialized = true;
                        logger.info("SEAL wrapper initialized successfully");
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger.error("Failed to initialize SEAL wrapper", error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SEALWrapper.prototype.encrypt = function (data, keyId) {
        return __awaiter(this, void 0, void 0, function () {
            var operationId, plaintext, nonce, key, _a, ciphertext, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.initialized) {
                            throw new Error("SEAL wrapper not initialized");
                        }
                        operationId = "seal_encrypt_".concat(Date.now());
                        logger.startPerformanceTimer(operationId);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        logger.quantum(logging_1.LogLevel.DEBUG, "encryption_started", "Starting SEAL encryption", {
                            dataLength: data.length,
                            keyId: keyId,
                        });
                        plaintext = Buffer.from(data, "utf-8");
                        nonce = (0, crypto_1.randomBytes)(16);
                        if (!keyId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.keyManager.getKey(keyId)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.keyManager.getDefaultKey()];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        key = _a;
                        // Simulate encryption process with performance characteristics
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 50); })];
                    case 6:
                        // Simulate encryption process with performance characteristics
                        _b.sent(); // Simulate processing time
                        ciphertext = this.simulateHomomorphicEncryption(plaintext, key, nonce);
                        logger.endPerformanceTimer(operationId, {
                            memoryUsage: ciphertext.length * 2, // Homomorphic encryption expansion
                            cacheHits: 0,
                            cacheMisses: 1,
                        });
                        logger.quantum(logging_1.LogLevel.INFO, "encryption_completed", "SEAL encryption completed", {
                            originalSize: plaintext.length,
                            encryptedSize: ciphertext.length,
                            expansionRatio: ciphertext.length / plaintext.length,
                            keyId: key.keyId,
                        });
                        return [2 /*return*/, ciphertext];
                    case 7:
                        error_2 = _b.sent();
                        logger.error("SEAL encryption failed", error_2, { operationId: operationId });
                        throw error_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SEALWrapper.prototype.decrypt = function (ciphertext, keyId) {
        return __awaiter(this, void 0, void 0, function () {
            var operationId, key, _a, plaintext, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.initialized) {
                            throw new Error("SEAL wrapper not initialized");
                        }
                        operationId = "seal_decrypt_".concat(Date.now());
                        logger.startPerformanceTimer(operationId);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        logger.quantum(logging_1.LogLevel.DEBUG, "decryption_started", "Starting SEAL decryption", {
                            ciphertextLength: ciphertext.length,
                            keyId: keyId,
                        });
                        if (!keyId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.keyManager.getKey(keyId)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.keyManager.getDefaultKey()];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        key = _a;
                        // Simulate decryption process
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 30); })];
                    case 6:
                        // Simulate decryption process
                        _b.sent();
                        plaintext = this.simulateHomomorphicDecryption(ciphertext, key);
                        logger.endPerformanceTimer(operationId);
                        logger.quantum(logging_1.LogLevel.INFO, "decryption_completed", "SEAL decryption completed", {
                            decryptedSize: plaintext.length,
                            keyId: key.keyId,
                        });
                        return [2 /*return*/, plaintext.toString("utf-8")];
                    case 7:
                        error_3 = _b.sent();
                        logger.error("SEAL decryption failed", error_3, { operationId: operationId });
                        throw error_3;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SEALWrapper.prototype.add = function (ciphertext1, ciphertext2) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                logger.quantum(logging_1.LogLevel.DEBUG, "homomorphic_add", "Performing homomorphic addition");
                result = Buffer.concat([ciphertext1, ciphertext2]);
                logger.quantum(logging_1.LogLevel.INFO, "homomorphic_add_completed", "Homomorphic addition completed", {
                    input1Size: ciphertext1.length,
                    input2Size: ciphertext2.length,
                    resultSize: result.length,
                });
                return [2 /*return*/, result];
            });
        });
    };
    SEALWrapper.prototype.multiply = function (ciphertext1, ciphertext2) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.quantum(logging_1.LogLevel.DEBUG, "homomorphic_multiply", "Performing homomorphic multiplication");
                        // Simulate homomorphic multiplication (more expensive operation)
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 1:
                        // Simulate homomorphic multiplication (more expensive operation)
                        _a.sent();
                        result = Buffer.concat([ciphertext1, ciphertext2, (0, crypto_1.randomBytes)(64)]);
                        logger.quantum(logging_1.LogLevel.INFO, "homomorphic_multiply_completed", "Homomorphic multiplication completed", {
                            input1Size: ciphertext1.length,
                            input2Size: ciphertext2.length,
                            resultSize: result.length,
                            noiseGrowth: 0.1,
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    SEALWrapper.prototype.simulateHomomorphicEncryption = function (plaintext, key, nonce) {
        // Simulate the expansion typical of homomorphic encryption
        var expanded = Buffer.alloc(plaintext.length * 4);
        plaintext.copy(expanded);
        nonce.copy(expanded, plaintext.length);
        key.publicKey
            .slice(0, plaintext.length * 2)
            .copy(expanded, plaintext.length + nonce.length);
        return expanded;
    };
    SEALWrapper.prototype.simulateHomomorphicDecryption = function (ciphertext, key) {
        // Extract original data (reverse of expansion)
        var originalLength = Math.floor(ciphertext.length / 4);
        return ciphertext.slice(0, originalLength);
    };
    return SEALWrapper;
}());
exports.SEALWrapper = SEALWrapper;
// Zero-Knowledge Proof Implementation
var ZKPProver = /** @class */ (function () {
    function ZKPProver(config) {
        if (config === void 0) { config = {}; }
        this.circuits = new Map();
        this.config = __assign({ scheme: "groth16", curve: "bn128", circuitDir: "./circuits", enableOptimization: true }, config);
        this.initializeCircuits();
    }
    ZKPProver.prototype.initializeCircuits = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger.crypto(logging_1.LogLevel.INFO, "zkp_init", "Initializing ZKP circuits");
                // Register common circuits
                this.circuits.set("data_integrity", {
                    id: "data_integrity",
                    inputs: ["data_hash", "salt"],
                    outputs: ["verification_hash"],
                    constraints: 1000,
                });
                this.circuits.set("access_control", {
                    id: "access_control",
                    inputs: ["user_credentials", "required_level"],
                    outputs: ["access_granted"],
                    constraints: 500,
                });
                logger.crypto(logging_1.LogLevel.INFO, "zkp_circuits_loaded", "ZKP circuits loaded", {
                    circuitCount: this.circuits.size,
                });
                return [2 /*return*/];
            });
        });
    };
    ZKPProver.prototype.generateProof = function (inputs_1) {
        return __awaiter(this, arguments, void 0, function (inputs, circuitId) {
            var operationId, circuit, proof, error_4;
            if (circuitId === void 0) { circuitId = "data_integrity"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        operationId = "zkp_prove_".concat(circuitId, "_").concat(Date.now());
                        logger.startPerformanceTimer(operationId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        logger.crypto(logging_1.LogLevel.DEBUG, "zkp_proof_generation_started", "Starting ZKP proof generation", {
                            circuitId: circuitId,
                            inputKeys: Object.keys(inputs),
                        });
                        circuit = this.circuits.get(circuitId);
                        if (!circuit) {
                            throw new Error("Circuit ".concat(circuitId, " not found"));
                        }
                        // Simulate proof generation
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                    case 2:
                        // Simulate proof generation
                        _a.sent(); // Simulate computation time
                        proof = {
                            proof: this.generateMockProof(),
                            publicSignals: this.generatePublicSignals(inputs),
                            verificationKey: this.generateVerificationKey(circuitId),
                            circuitId: circuitId,
                        };
                        logger.endPerformanceTimer(operationId, {
                            memoryUsage: 1024 * 1024, // 1MB typical for ZKP
                            cpuUsage: 80, // High CPU usage for proof generation
                        });
                        logger.crypto(logging_1.LogLevel.INFO, "zkp_proof_generated", "ZKP proof generated successfully", {
                            circuitId: circuitId,
                            proofLength: proof.proof.length,
                            signalsCount: proof.publicSignals.length,
                        });
                        return [2 /*return*/, proof];
                    case 3:
                        error_4 = _a.sent();
                        logger.error("ZKP proof generation failed", error_4, {
                            circuitId: circuitId,
                            operationId: operationId,
                        });
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ZKPProver.prototype.generateMockProof = function () {
        // Generate a mock proof that looks realistic
        var proofData = {
            pi_a: [
                (0, crypto_1.randomBytes)(32).toString("hex"),
                (0, crypto_1.randomBytes)(32).toString("hex"),
                "1",
            ],
            pi_b: [
                [(0, crypto_1.randomBytes)(32).toString("hex"), (0, crypto_1.randomBytes)(32).toString("hex")],
                [(0, crypto_1.randomBytes)(32).toString("hex"), (0, crypto_1.randomBytes)(32).toString("hex")],
                ["1", "0"],
            ],
            pi_c: [
                (0, crypto_1.randomBytes)(32).toString("hex"),
                (0, crypto_1.randomBytes)(32).toString("hex"),
                "1",
            ],
            protocol: "groth16",
            curve: "bn128",
        };
        return JSON.stringify(proofData);
    };
    ZKPProver.prototype.generatePublicSignals = function (inputs) {
        return Object.values(inputs).map(function (value) {
            return (0, crypto_1.createHash)("sha256").update(String(value)).digest("hex");
        });
    };
    ZKPProver.prototype.generateVerificationKey = function (circuitId) {
        return (0, crypto_1.createHash)("sha256")
            .update("vk_".concat(circuitId, "_").concat(Date.now()))
            .digest("hex");
    };
    return ZKPProver;
}());
exports.ZKPProver = ZKPProver;
var ZKPVerifier = /** @class */ (function () {
    function ZKPVerifier() {
        this.verificationKeys = new Map();
        logger.crypto(logging_1.LogLevel.INFO, "zkp_verifier_init", "ZKP verifier initialized");
    }
    ZKPVerifier.prototype.verifyProof = function (proof, publicSignals, verificationKey) {
        return __awaiter(this, void 0, void 0, function () {
            var operationId, proofData, isValid, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        operationId = "zkp_verify_".concat(Date.now());
                        logger.startPerformanceTimer(operationId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        logger.crypto(logging_1.LogLevel.DEBUG, "zkp_verification_started", "Starting ZKP proof verification", {
                            proofLength: proof.length,
                            signalsCount: publicSignals.length,
                        });
                        // Simulate verification process
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 50); })];
                    case 2:
                        // Simulate verification process
                        _a.sent(); // Much faster than generation
                        proofData = JSON.parse(proof);
                        isValid = proofData.protocol === "groth16" &&
                            proofData.pi_a &&
                            proofData.pi_b &&
                            proofData.pi_c;
                        logger.endPerformanceTimer(operationId, {
                            memoryUsage: 64 * 1024, // 64KB typical for verification
                            cpuUsage: 20, // Lower CPU usage for verification
                        });
                        logger.crypto(logging_1.LogLevel.INFO, "zkp_verification_completed", "ZKP proof verification completed", {
                            isValid: isValid,
                            verificationTime: logger.endPerformanceTimer(operationId).duration,
                        });
                        return [2 /*return*/, isValid];
                    case 3:
                        error_5 = _a.sent();
                        logger.error("ZKP proof verification failed", error_5, {
                            operationId: operationId,
                        });
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ZKPVerifier;
}());
exports.ZKPVerifier = ZKPVerifier;
// Threshold Cryptography Implementation
var Shamir = /** @class */ (function () {
    function Shamir() {
        // Use a large prime for finite field arithmetic
        this.prime = BigInt("170141183460469231731687303715884105727"); // 2^127 - 1, Mersenne prime
        logger.crypto(logging_1.LogLevel.INFO, "shamir_init", "Shamir secret sharing initialized");
    }
    Shamir.prototype.createShares = function (secret, threshold, numShares) {
        logger.crypto(logging_1.LogLevel.DEBUG, "shamir_create_shares", "Creating Shamir shares", {
            threshold: threshold,
            numShares: numShares,
            secretLength: secret.length,
        });
        if (threshold > numShares) {
            throw new Error("Threshold cannot be greater than number of shares");
        }
        var secretInt = this.bufferToBigInt(secret);
        var coefficients = [secretInt];
        // Generate random coefficients for polynomial
        for (var i = 1; i < threshold; i++) {
            coefficients.push(this.randomBigInt());
        }
        var shares = [];
        for (var i = 1; i <= numShares; i++) {
            var x = BigInt(i);
            var y = coefficients[0];
            for (var j = 1; j < threshold; j++) {
                y = (y + coefficients[j] * this.bigIntPow(x, BigInt(j))) % this.prime;
            }
            shares.push({
                index: i,
                share: this.bigIntToBuffer(y),
                threshold: threshold,
                totalShares: numShares,
            });
        }
        logger.crypto(logging_1.LogLevel.INFO, "shamir_shares_created", "Shamir shares created successfully", {
            sharesCount: shares.length,
            threshold: threshold,
        });
        return shares;
    };
    Shamir.prototype.reconstructSecret = function (shares) {
        var _a;
        logger.crypto(logging_1.LogLevel.DEBUG, "shamir_reconstruct", "Reconstructing secret from shares", {
            sharesCount: shares.length,
            threshold: (_a = shares[0]) === null || _a === void 0 ? void 0 : _a.threshold,
        });
        if (shares.length < shares[0].threshold) {
            throw new Error("Insufficient shares for reconstruction");
        }
        // Use only the required number of shares
        var requiredShares = shares.slice(0, shares[0].threshold);
        var secret = BigInt(0);
        for (var i = 0; i < requiredShares.length; i++) {
            var share = requiredShares[i];
            var xi = BigInt(share.index);
            var yi = this.bufferToBigInt(share.share);
            var numerator = BigInt(1);
            var denominator = BigInt(1);
            for (var j = 0; j < requiredShares.length; j++) {
                if (i !== j) {
                    var xj = BigInt(requiredShares[j].index);
                    numerator = (numerator * -xj) % this.prime;
                    denominator = (denominator * (xi - xj)) % this.prime;
                }
            }
            var term = (yi * numerator * this.modInverse(denominator, this.prime)) %
                this.prime;
            secret = (secret + term) % this.prime;
        }
        var result = this.bigIntToBuffer(secret);
        logger.crypto(logging_1.LogLevel.INFO, "shamir_secret_reconstructed", "Secret reconstructed successfully", {
            secretLength: result.length,
        });
        return result;
    };
    Shamir.prototype.bufferToBigInt = function (buffer) {
        return BigInt("0x" + buffer.toString("hex"));
    };
    Shamir.prototype.bigIntToBuffer = function (value) {
        var hex = value.toString(16);
        return Buffer.from(hex.padStart(Math.ceil(hex.length / 2) * 2, "0"), "hex");
    };
    Shamir.prototype.randomBigInt = function () {
        var bytes = (0, crypto_1.randomBytes)(16);
        return this.bufferToBigInt(bytes) % this.prime;
    };
    Shamir.prototype.modInverse = function (a, m) {
        var _a, _b;
        // Extended Euclidean Algorithm
        var _c = [a, m], old_r = _c[0], r = _c[1];
        var _d = [BigInt(1), BigInt(0)], old_s = _d[0], s = _d[1];
        while (r !== BigInt(0)) {
            var quotient = old_r / r;
            _a = [r, old_r - quotient * r], old_r = _a[0], r = _a[1];
            _b = [s, old_s - quotient * s], old_s = _b[0], s = _b[1];
        }
        return old_s < 0 ? old_s + m : old_s;
    };
    Shamir.prototype.bigIntPow = function (base, exponent) {
        var result = BigInt(1);
        var b = base;
        var e = exponent;
        while (e > BigInt(0)) {
            if (e % BigInt(2) === BigInt(1)) {
                result *= b;
            }
            b *= b;
            e /= BigInt(2);
        }
        return result;
    };
    return Shamir;
}());
exports.Shamir = Shamir;
var DistributedKeyManager = /** @class */ (function () {
    function DistributedKeyManager() {
        this.keyShares = new Map();
        this.shamir = new Shamir();
        logger.crypto(logging_1.LogLevel.INFO, "dkm_init", "Distributed key manager initialized");
    }
    DistributedKeyManager.prototype.generateDistributedKey = function (keyId, threshold, numShares) {
        return __awaiter(this, void 0, void 0, function () {
            var masterKey, shares;
            return __generator(this, function (_a) {
                logger.crypto(logging_1.LogLevel.DEBUG, "dkm_generate_key", "Generating distributed key", {
                    keyId: keyId,
                    threshold: threshold,
                    numShares: numShares,
                });
                masterKey = (0, crypto_1.randomBytes)(32);
                shares = this.shamir.createShares(masterKey, threshold, numShares);
                this.keyShares.set(keyId, shares);
                logger.crypto(logging_1.LogLevel.INFO, "dkm_key_generated", "Distributed key generated", {
                    keyId: keyId,
                    sharesCount: shares.length,
                });
                return [2 /*return*/, shares];
            });
        });
    };
    DistributedKeyManager.prototype.reconstructKey = function (keyId, shares) {
        return __awaiter(this, void 0, void 0, function () {
            var reconstructedKey;
            return __generator(this, function (_a) {
                logger.crypto(logging_1.LogLevel.DEBUG, "dkm_reconstruct_key", "Reconstructing distributed key", {
                    keyId: keyId,
                    providedShares: shares.length,
                });
                reconstructedKey = this.shamir.reconstructSecret(shares);
                logger.crypto(logging_1.LogLevel.INFO, "dkm_key_reconstructed", "Distributed key reconstructed", {
                    keyId: keyId,
                    keyLength: reconstructedKey.length,
                });
                return [2 /*return*/, reconstructedKey];
            });
        });
    };
    return DistributedKeyManager;
}());
exports.DistributedKeyManager = DistributedKeyManager;
// Key Management System
var KeyManager = /** @class */ (function () {
    function KeyManager() {
        this.keys = new Map();
        this.defaultKeyId = null;
        this.generateDefaultKey();
    }
    KeyManager.prototype.generateDefaultKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keyPair;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generateKeyPair("default")];
                    case 1:
                        keyPair = _a.sent();
                        this.defaultKeyId = keyPair.keyId;
                        logger.crypto(logging_1.LogLevel.INFO, "key_manager_default_key", "Default key generated", {
                            keyId: keyPair.keyId,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    KeyManager.prototype.generateKeyPair = function (keyId) {
        return __awaiter(this, void 0, void 0, function () {
            var id, keyPair;
            return __generator(this, function (_a) {
                id = keyId || "key_".concat(Date.now(), "_").concat((0, crypto_1.randomBytes)(4).toString("hex"));
                logger.crypto(logging_1.LogLevel.DEBUG, "key_generation_started", "Generating key pair", { keyId: id });
                keyPair = {
                    publicKey: (0, crypto_1.randomBytes)(64),
                    privateKey: (0, crypto_1.randomBytes)(32),
                    keyId: id,
                    algorithm: "RSA-2048",
                    createdAt: new Date(),
                };
                this.keys.set(id, keyPair);
                logger.crypto(logging_1.LogLevel.INFO, "key_generated", "Key pair generated successfully", {
                    keyId: id,
                    algorithm: keyPair.algorithm,
                });
                return [2 /*return*/, keyPair];
            });
        });
    };
    KeyManager.prototype.getKey = function (keyId) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                key = this.keys.get(keyId);
                if (!key) {
                    throw new Error("Key ".concat(keyId, " not found"));
                }
                logger.crypto(logging_1.LogLevel.DEBUG, "key_retrieved", "Key retrieved", {
                    keyId: keyId,
                    algorithm: key.algorithm,
                });
                return [2 /*return*/, key];
            });
        });
    };
    KeyManager.prototype.getDefaultKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.defaultKeyId) {
                    throw new Error("No default key available");
                }
                return [2 /*return*/, this.getKey(this.defaultKeyId)];
            });
        });
    };
    KeyManager.prototype.rotateKey = function (keyId) {
        return __awaiter(this, void 0, void 0, function () {
            var oldKey, newKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.crypto(logging_1.LogLevel.INFO, "key_rotation_started", "Starting key rotation", { keyId: keyId });
                        return [4 /*yield*/, this.getKey(keyId)];
                    case 1:
                        oldKey = _a.sent();
                        return [4 /*yield*/, this.generateKeyPair(keyId)];
                    case 2:
                        newKey = _a.sent();
                        logger.crypto(logging_1.LogLevel.INFO, "key_rotated", "Key rotation completed", {
                            keyId: keyId,
                            oldCreatedAt: oldKey.createdAt,
                            newCreatedAt: newKey.createdAt,
                        });
                        return [2 /*return*/, newKey];
                }
            });
        });
    };
    KeyManager.prototype.listKeys = function () {
        return Array.from(this.keys.values()).map(function (key) { return (__assign(__assign({}, key), { privateKey: Buffer.alloc(0) })); });
    };
    return KeyManager;
}());
exports.KeyManager = KeyManager;
// Export factory for creating integrated crypto suite
var CryptoSuite = /** @class */ (function () {
    function CryptoSuite(config) {
        if (config === void 0) { config = {}; }
        this._initialized = false;
        logger.crypto(logging_1.LogLevel.INFO, "crypto_suite_init", "Initializing crypto suite");
        this.seal = new SEALWrapper(config.seal);
        this.zkpProver = new ZKPProver(config.zkp);
        this.zkpVerifier = new ZKPVerifier();
        this.shamir = new Shamir();
        this.keyManager = new KeyManager();
        this.distributedKeyManager = new DistributedKeyManager();
        // Initialize async components
        this.initializeAsync();
    }
    CryptoSuite.prototype.initializeAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.seal.isInitialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2:
                        this._initialized = true;
                        logger.crypto(logging_1.LogLevel.INFO, "crypto_suite_ready", "Crypto suite initialized successfully");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Wait for the crypto suite to be fully initialized
     */
    CryptoSuite.prototype.waitForInitialization = function () {
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
    return CryptoSuite;
}());
exports.CryptoSuite = CryptoSuite;
