"use strict";
// QISDD Core Metrics Collector
// Captures real SDK metrics for dashboard display
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsCollector = void 0;
var fs = require("fs");
var path = require("path");
var MetricsCollector = /** @class */ (function () {
    function MetricsCollector() {
        this.metrics = this.initializeMetrics();
        this.logFile = path.join(__dirname, '../../logs/core-metrics.json');
        this.humanReadableFile = path.join(__dirname, '../../logs/core-output-human.txt');
        this.ensureLogDirectory();
    }
    MetricsCollector.prototype.initializeMetrics = function () {
        return {
            quantumStates: { total: 0, created: 0, active: 0, collapsed: 0 },
            encryption: { totalOperations: 0, encryptions: 0, decryptions: 0, zkpProofs: 0, verifications: 0 },
            security: { totalProtected: 0, authorizedAccess: 0, unauthorizedAttempts: 0, threatsBlocked: 0, averageTrustScore: 0 },
            performance: { averageResponseTime: 0, protectionTime: 0, observationTime: 0, memoryUsage: 0, successRate: 0 },
            systemHealth: { overall: 'healthy', uptime: 0, activeSuperpositions: 0, cryptoOperations: 0 }
        };
    };
    MetricsCollector.prototype.ensureLogDirectory = function () {
        var logDir = path.dirname(this.logFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    };
    // Update metrics from core SDK operations
    MetricsCollector.prototype.updateFromCoreOutput = function (coreOutput) {
        try {
            // Parse quantum states
            if (coreOutput.statesCreated) {
                this.metrics.quantumStates.created += coreOutput.statesCreated;
                this.metrics.quantumStates.total += coreOutput.statesCreated;
                this.metrics.quantumStates.active = coreOutput.statesCreated;
            }
            // Parse encryption operations
            if (coreOutput.cryptoOperations) {
                this.metrics.encryption.encryptions += coreOutput.cryptoOperations.encryptions || 0;
                this.metrics.encryption.decryptions += coreOutput.cryptoOperations.decryptions || 0;
                this.metrics.encryption.zkpProofs += coreOutput.cryptoOperations.zkpProofs || 0;
                this.metrics.encryption.verifications += coreOutput.cryptoOperations.verifications || 0;
                this.metrics.encryption.totalOperations =
                    this.metrics.encryption.encryptions +
                        this.metrics.encryption.decryptions +
                        this.metrics.encryption.zkpProofs +
                        this.metrics.encryption.verifications;
            }
            // Parse security metrics
            if (coreOutput.totalDataProtected !== undefined) {
                this.metrics.security.totalProtected = coreOutput.totalDataProtected;
            }
            if (coreOutput.unauthorizedAttempts !== undefined) {
                this.metrics.security.unauthorizedAttempts = coreOutput.unauthorizedAttempts;
                this.metrics.security.threatsBlocked = coreOutput.unauthorizedAttempts;
            }
            if (coreOutput.totalObservations !== undefined) {
                this.metrics.security.authorizedAccess = coreOutput.totalObservations;
            }
            // Parse performance metrics
            if (coreOutput.averageResponseTime !== undefined) {
                this.metrics.performance.averageResponseTime = coreOutput.averageResponseTime;
            }
            if (coreOutput.systemHealth) {
                this.metrics.performance.successRate = coreOutput.systemHealth.successRate || 0;
                this.metrics.performance.memoryUsage = coreOutput.systemHealth.memoryUsage || 0;
                this.metrics.systemHealth.overall = coreOutput.systemHealth.overall || 'healthy';
                this.metrics.systemHealth.uptime = coreOutput.systemHealth.uptime || 0;
                this.metrics.systemHealth.activeSuperpositions = coreOutput.systemHealth.activeSuperpositions || 0;
            }
            this.saveMetrics();
            this.generateHumanReadableOutput();
        }
        catch (error) {
            console.error('Error updating metrics:', error);
        }
    };
    // Generate sample metrics for demonstration
    MetricsCollector.prototype.generateSampleMetrics = function () {
        var sampleMetrics = {
            quantumStates: {
                total: 3,
                created: 3,
                active: 3,
                collapsed: 0
            },
            encryption: {
                totalOperations: 5,
                encryptions: 3,
                decryptions: 1,
                zkpProofs: 1,
                verifications: 0
            },
            security: {
                totalProtected: 1,
                authorizedAccess: 1,
                unauthorizedAttempts: 1,
                threatsBlocked: 1,
                averageTrustScore: 0.65
            },
            performance: {
                averageResponseTime: 200,
                protectionTime: 364,
                observationTime: 36,
                memoryUsage: 167273712,
                successRate: 0.5
            },
            systemHealth: {
                overall: 'healthy',
                uptime: 1.34,
                activeSuperpositions: 1,
                cryptoOperations: 5
            }
        };
        this.metrics = sampleMetrics;
        this.saveMetrics();
        this.generateHumanReadableOutput();
        return sampleMetrics;
    };
    MetricsCollector.prototype.saveMetrics = function () {
        try {
            fs.writeFileSync(this.logFile, JSON.stringify(this.metrics, null, 2));
        }
        catch (error) {
            console.error('Error saving metrics:', error);
        }
    };
    MetricsCollector.prototype.generateHumanReadableOutput = function () {
        var output = "\n\uD83D\uDD10 QISDD Security Dashboard - Real-time Report\n===============================================\nGenerated: ".concat(new Date().toLocaleString(), "\n\n\uD83C\uDF1F QUANTUM OPERATIONS:\n\u2705 ").concat(this.metrics.quantumStates.created, " quantum states created successfully\n\u26A1 ").concat(this.metrics.quantumStates.active, " quantum states currently active\n\uD83D\uDCCA ").concat(this.metrics.quantumStates.total, " total quantum states managed\n").concat(this.metrics.quantumStates.collapsed > 0 ? "\u26A0\uFE0F  ".concat(this.metrics.quantumStates.collapsed, " states collapsed due to unauthorized access") : '✅ No quantum collapses detected', "\n\n\uD83D\uDD12 ENCRYPTION & SECURITY:\n\uD83D\uDD10 ").concat(this.metrics.encryption.encryptions, " successful encryptions performed\n\uD83D\uDD13 ").concat(this.metrics.encryption.decryptions, " authorized decryptions completed\n\uD83D\uDEE1\uFE0F  ").concat(this.metrics.encryption.zkpProofs, " zero-knowledge proofs generated\n\uD83D\uDD0D ").concat(this.metrics.encryption.verifications, " cryptographic verifications performed\n\uD83D\uDCC8 ").concat(this.metrics.encryption.totalOperations, " total cryptographic operations\n\n\uD83D\uDEE1\uFE0F  THREAT PROTECTION:\n\uD83D\uDCCB ").concat(this.metrics.security.totalProtected, " data items under quantum protection\n\u2705 ").concat(this.metrics.security.authorizedAccess, " authorized access attempts granted\n\uD83D\uDEAB ").concat(this.metrics.security.unauthorizedAttempts, " unauthorized access attempts blocked\n\uD83C\uDFAF ").concat(Math.round(this.metrics.security.averageTrustScore * 100), "% average trust score for access requests\n\uD83D\uDD12 ").concat(this.metrics.security.threatsBlocked, " security threats successfully neutralized\n\n\u26A1 PERFORMANCE METRICS:\n\u23F1\uFE0F  Average response time: ").concat(this.metrics.performance.averageResponseTime, "ms\n\uD83D\uDD10 Data protection time: ").concat(this.metrics.performance.protectionTime, "ms\n\uD83D\uDC41\uFE0F  Observation time: ").concat(this.metrics.performance.observationTime, "ms\n\uD83D\uDCBE Memory usage: ").concat(Math.round(this.metrics.performance.memoryUsage / 1024 / 1024), "MB\n\uD83D\uDCCA Success rate: ").concat(Math.round(this.metrics.performance.successRate * 100), "%\n\n\uD83C\uDFE5 SYSTEM HEALTH:\n\uD83D\uDFE2 Overall status: ").concat(this.metrics.systemHealth.overall.toUpperCase(), "\n\u23F0 System uptime: ").concat(this.metrics.systemHealth.uptime.toFixed(2), " seconds\n\uD83C\uDF00 Active superpositions: ").concat(this.metrics.systemHealth.activeSuperpositions, "\n\uD83D\uDD27 Total crypto operations: ").concat(this.metrics.systemHealth.cryptoOperations, "\n\n\uD83D\uDCDD SUMMARY FOR BEGINNERS:\nYour QISDD system is actively protecting your data using quantum-inspired technology!\n").concat(this.metrics.quantumStates.created, " quantum states were created, which means your data is now\nsplit into multiple encrypted pieces that automatically defend against unauthorized access.\nThe system successfully blocked ").concat(this.metrics.security.unauthorizedAttempts, " hacking attempts while allowing\n").concat(this.metrics.security.authorizedAccess, " legitimate users to access their data safely.\n\nThink of quantum states like having ").concat(this.metrics.quantumStates.created, " different security guards watching over\nyour data - if someone tries to break in without permission, the guards automatically\nchange the locks and sound the alarm! \uD83D\uDEA8\n");
        try {
            fs.writeFileSync(this.humanReadableFile, output);
        }
        catch (error) {
            console.error('Error saving human readable output:', error);
        }
    };
    MetricsCollector.prototype.getMetrics = function () {
        return this.metrics;
    };
    MetricsCollector.prototype.loadMetrics = function () {
        try {
            if (fs.existsSync(this.logFile)) {
                var data = fs.readFileSync(this.logFile, 'utf8');
                this.metrics = JSON.parse(data);
            }
        }
        catch (error) {
            console.error('Error loading metrics:', error);
        }
        return this.metrics;
    };
    return MetricsCollector;
}());
exports.metricsCollector = new MetricsCollector();
