"use strict";
/**
 * QISDD Threat Simulator - Demonstrates how quantum-inspired security blocks hackers
 */
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
exports.ThreatSimulator = void 0;
var ThreatSimulator = /** @class */ (function () {
    function ThreatSimulator() {
        this.threats = [
            {
                id: 'sql_injection',
                name: 'SQL Injection Attack',
                description: 'Hacker attempts to inject malicious SQL code to access database',
                severity: 'high',
                attackVector: 'Web Application',
                expectedOutcome: 'blocked',
                techniques: ['Union-based injection', 'Boolean-based blind', 'Time-based blind']
            },
            {
                id: 'ransomware',
                name: 'Ransomware Deployment',
                description: 'Malicious actor tries to encrypt critical files for ransom',
                severity: 'critical',
                attackVector: 'File System',
                expectedOutcome: 'blocked',
                techniques: ['File encryption', 'Registry modification', 'Network propagation']
            },
            {
                id: 'phishing',
                name: 'Credential Phishing',
                description: 'Social engineering attack to steal user credentials',
                severity: 'medium',
                attackVector: 'Email/Social',
                expectedOutcome: 'detected',
                techniques: ['Fake login pages', 'Email spoofing', 'Domain hijacking']
            },
            {
                id: 'ddos',
                name: 'DDoS Attack',
                description: 'Distributed denial of service to overwhelm system resources',
                severity: 'high',
                attackVector: 'Network',
                expectedOutcome: 'blocked',
                techniques: ['UDP flood', 'SYN flood', 'HTTP flood']
            },
            {
                id: 'zero_day',
                name: 'Zero-Day Exploit',
                description: 'Unknown vulnerability exploitation attempt',
                severity: 'critical',
                attackVector: 'System Vulnerability',
                expectedOutcome: 'analyzed',
                techniques: ['Buffer overflow', 'Memory corruption', 'Privilege escalation']
            },
            {
                id: 'insider_threat',
                name: 'Insider Data Theft',
                description: 'Authorized user attempting unauthorized data access',
                severity: 'high',
                attackVector: 'Internal Access',
                expectedOutcome: 'detected',
                techniques: ['Privilege abuse', 'Data exfiltration', 'Access pattern anomaly']
            }
        ];
    }
    /**
     * Simulate a random hacker attack and show how QISDD blocks it
     */
    ThreatSimulator.prototype.simulateAttack = function () {
        var threat = this.threats[Math.floor(Math.random() * this.threats.length)];
        var startTime = Date.now();
        // Simulate quantum-inspired defense mechanism
        var quantumStates = ['superposition', 'entanglement', 'coherence'];
        var quantumState = quantumStates[Math.floor(Math.random() * quantumStates.length)];
        // Calculate trust score based on threat severity
        var baseTrustScore = this.calculateTrustScore(threat.severity);
        var trustScore = baseTrustScore + (Math.random() * 20 - 10); // Add some variance
        // Determine if attack is blocked (QISDD has 95%+ success rate)
        var blocked = Math.random() > 0.05; // 95% success rate
        var responseTime = Date.now() - startTime + Math.random() * 50; // Realistic response time
        var result = {
            threatId: threat.id,
            timestamp: new Date(),
            blocked: blocked,
            reason: this.generateBlockingReason(threat, quantumState, blocked),
            quantumStateUsed: quantumState,
            trustScore: Math.max(0, Math.min(100, trustScore)),
            responseTime: responseTime,
            details: this.generateDetailedExplanation(threat, blocked, quantumState)
        };
        return result;
    };
    /**
     * Simulate multiple coordinated attacks (APT scenario)
     */
    ThreatSimulator.prototype.simulateAdvancedPersistentThreat = function () {
        var aptAttacks = [
            this.threats.find(function (t) { return t.id === 'phishing'; }),
            this.threats.find(function (t) { return t.id === 'zero_day'; }),
            this.threats.find(function (t) { return t.id === 'insider_threat'; }),
        ];
        return aptAttacks.map(function (threat) {
            var quantumState = 'entanglement'; // APT requires coordinated defense
            var blocked = Math.random() > 0.02; // 98% success rate for APT
            return {
                threatId: threat.id,
                timestamp: new Date(),
                blocked: blocked,
                reason: "APT Stage Detected - ".concat(threat.name, " blocked via quantum ").concat(quantumState),
                quantumStateUsed: quantumState,
                trustScore: Math.random() * 30 + 20, // APT has low trust scores
                responseTime: Math.random() * 100 + 150, // APT takes longer to analyze
                details: "Advanced Persistent Threat detected. ".concat(threat.description, " neutralized using quantum-inspired correlation analysis.")
            };
        });
    };
    ThreatSimulator.prototype.calculateTrustScore = function (severity) {
        switch (severity) {
            case 'critical': return Math.random() * 20 + 10; // 10-30
            case 'high': return Math.random() * 30 + 20; // 20-50
            case 'medium': return Math.random() * 40 + 40; // 40-80
            case 'low': return Math.random() * 20 + 70; // 70-90
            default: return 50;
        }
    };
    ThreatSimulator.prototype.generateBlockingReason = function (threat, quantumState, blocked) {
        if (!blocked) {
            return "Attack partially detected - analyzing with quantum ".concat(quantumState);
        }
        var reasons = [
            "Quantum ".concat(quantumState, " detected anomalous pattern in ").concat(threat.attackVector),
            "".concat(threat.name, " signature identified and blocked via ").concat(quantumState, " correlation"),
            "Threat blocked: ".concat(quantumState, "-based analysis flagged malicious behavior"),
            "QISDD quantum defense: ".concat(quantumState, " state prevented ").concat(threat.attackVector, " compromise")
        ];
        return reasons[Math.floor(Math.random() * reasons.length)];
    };
    ThreatSimulator.prototype.generateDetailedExplanation = function (threat, blocked, quantumState) {
        var action = blocked ? 'blocked' : 'detected';
        return "QISDD successfully ".concat(action, " ").concat(threat.name, ". Using quantum-inspired ").concat(quantumState, ", the system identified ").concat(threat.techniques.join(', '), " patterns and prevented potential damage. Trust analysis complete.");
    };
    /**
     * Get threat by ID for specific simulations
     */
    ThreatSimulator.prototype.getThreatById = function (id) {
        return this.threats.find(function (t) { return t.id === id; });
    };
    /**
     * Get all available threats for demo purposes
     */
    ThreatSimulator.prototype.getAllThreats = function () {
        return __spreadArray([], this.threats, true);
    };
    return ThreatSimulator;
}());
exports.ThreatSimulator = ThreatSimulator;
