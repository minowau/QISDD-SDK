// QISDD Core Metrics Collector
// Captures real SDK metrics for dashboard display

import * as fs from 'fs';
import * as path from 'path';

export interface CoreMetrics {
  quantumStates: {
    total: number;
    created: number;
    active: number;
    collapsed: number;
  };
  encryption: {
    totalOperations: number;
    encryptions: number;
    decryptions: number;
    zkpProofs: number;
    verifications: number;
  };
  security: {
    totalProtected: number;
    authorizedAccess: number;
    unauthorizedAttempts: number;
    threatsBlocked: number;
    averageTrustScore: number;
  };
  performance: {
    averageResponseTime: number;
    protectionTime: number;
    observationTime: number;
    memoryUsage: number;
    successRate: number;
  };
  systemHealth: {
    overall: string;
    uptime: number;
    activeSuperpositions: number;
    cryptoOperations: number;
  };
}

class MetricsCollector {
  private metrics: CoreMetrics;
  private logFile: string;
  private humanReadableFile: string;

  constructor() {
    this.metrics = this.initializeMetrics();
    this.logFile = path.join(__dirname, '../../logs/core-metrics.json');
    this.humanReadableFile = path.join(__dirname, '../../logs/core-output-human.txt');
    this.ensureLogDirectory();
  }

  private initializeMetrics(): CoreMetrics {
    return {
      quantumStates: { total: 0, created: 0, active: 0, collapsed: 0 },
      encryption: { totalOperations: 0, encryptions: 0, decryptions: 0, zkpProofs: 0, verifications: 0 },
      security: { totalProtected: 0, authorizedAccess: 0, unauthorizedAttempts: 0, threatsBlocked: 0, averageTrustScore: 0 },
      performance: { averageResponseTime: 0, protectionTime: 0, observationTime: 0, memoryUsage: 0, successRate: 0 },
      systemHealth: { overall: 'healthy', uptime: 0, activeSuperpositions: 0, cryptoOperations: 0 }
    };
  }

  private ensureLogDirectory(): void {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  // Update metrics from core SDK operations
  updateFromCoreOutput(coreOutput: any): void {
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
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  }

  // Generate sample metrics for demonstration
  generateSampleMetrics(): CoreMetrics {
    const sampleMetrics: CoreMetrics = {
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
  }

  private saveMetrics(): void {
    try {
      fs.writeFileSync(this.logFile, JSON.stringify(this.metrics, null, 2));
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  }

  private generateHumanReadableOutput(): void {
    const output = `
🔐 QISDD Security Dashboard - Real-time Report
===============================================
Generated: ${new Date().toLocaleString()}

🌟 QUANTUM OPERATIONS:
✅ ${this.metrics.quantumStates.created} quantum states created successfully
⚡ ${this.metrics.quantumStates.active} quantum states currently active
📊 ${this.metrics.quantumStates.total} total quantum states managed
${this.metrics.quantumStates.collapsed > 0 ? `⚠️  ${this.metrics.quantumStates.collapsed} states collapsed due to unauthorized access` : '✅ No quantum collapses detected'}

🔒 ENCRYPTION & SECURITY:
🔐 ${this.metrics.encryption.encryptions} successful encryptions performed
🔓 ${this.metrics.encryption.decryptions} authorized decryptions completed
🛡️  ${this.metrics.encryption.zkpProofs} zero-knowledge proofs generated
🔍 ${this.metrics.encryption.verifications} cryptographic verifications performed
📈 ${this.metrics.encryption.totalOperations} total cryptographic operations

🛡️  THREAT PROTECTION:
📋 ${this.metrics.security.totalProtected} data items under quantum protection
✅ ${this.metrics.security.authorizedAccess} authorized access attempts granted
🚫 ${this.metrics.security.unauthorizedAttempts} unauthorized access attempts blocked
🎯 ${Math.round(this.metrics.security.averageTrustScore * 100)}% average trust score for access requests
🔒 ${this.metrics.security.threatsBlocked} security threats successfully neutralized

⚡ PERFORMANCE METRICS:
⏱️  Average response time: ${this.metrics.performance.averageResponseTime}ms
🔐 Data protection time: ${this.metrics.performance.protectionTime}ms
👁️  Observation time: ${this.metrics.performance.observationTime}ms
💾 Memory usage: ${Math.round(this.metrics.performance.memoryUsage / 1024 / 1024)}MB
📊 Success rate: ${Math.round(this.metrics.performance.successRate * 100)}%

🏥 SYSTEM HEALTH:
🟢 Overall status: ${this.metrics.systemHealth.overall.toUpperCase()}
⏰ System uptime: ${this.metrics.systemHealth.uptime.toFixed(2)} seconds
🌀 Active superpositions: ${this.metrics.systemHealth.activeSuperpositions}
🔧 Total crypto operations: ${this.metrics.systemHealth.cryptoOperations}

📝 SUMMARY FOR BEGINNERS:
Your QISDD system is actively protecting your data using quantum-inspired technology!
${this.metrics.quantumStates.created} quantum states were created, which means your data is now
split into multiple encrypted pieces that automatically defend against unauthorized access.
The system successfully blocked ${this.metrics.security.unauthorizedAttempts} hacking attempts while allowing
${this.metrics.security.authorizedAccess} legitimate users to access their data safely.

Think of quantum states like having ${this.metrics.quantumStates.created} different security guards watching over
your data - if someone tries to break in without permission, the guards automatically
change the locks and sound the alarm! 🚨
`;

    try {
      fs.writeFileSync(this.humanReadableFile, output);
    } catch (error) {
      console.error('Error saving human readable output:', error);
    }
  }

  getMetrics(): CoreMetrics {
    return this.metrics;
  }

  loadMetrics(): CoreMetrics {
    try {
      if (fs.existsSync(this.logFile)) {
        const data = fs.readFileSync(this.logFile, 'utf8');
        this.metrics = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
    return this.metrics;
  }
}

export const metricsCollector = new MetricsCollector();
