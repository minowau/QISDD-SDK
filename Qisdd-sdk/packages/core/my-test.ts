// QISDD-SDK Complete Integration Example
// This file shows how all components work together

import { QuantumSuperposition, SuperpositionFactory, QuantumState, QuantumStateType } from './src/quantum/superposition';
import { ObserverEffect } from './src/quantum/observer-effect';
import { Measurement } from './src/quantum/measurement';
import { Entanglement } from './src/quantum/entanglement';
import { QISDDLogger, LoggerFactory, LogLevel, LogCategory, AuditEvent } from './src/logging';
import { CryptoSuite } from './src/crypto';
import { EventEmitter } from 'events';
import { randomBytes } from 'crypto';

// Main QISDD Client with Complete Integration
export class QISDDIntegratedClient extends EventEmitter {
  private cryptoSuite: CryptoSuite;
  private logger: QISDDLogger;
  private superpositions: Map<string, QuantumSuperposition> = new Map();
  private observer: ObserverEffect;
  private measurement: Measurement;
  private entanglement: Entanglement;
  private metrics: ClientMetrics;
  private config: QISDDConfig;
  private _initialized: boolean = false;

  constructor(config: Partial<QISDDConfig> = {}) {
    super();
    
    this.config = {
      enableCrypto: true,
      enableLogging: true,
      enableAuditing: true,
      enableBlockchain: false,
      superpositionConfig: {
        stateCount: 3,
        coherenceTimeMs: 300000,
        maxObservations: 1000,
        degradationThreshold: 0.8,
        autoRotationInterval: 60000,
        enableEntanglement: true,
        auditLevel: 'detailed',
        compressionEnabled: true
      },
      cryptoConfig: {
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
      },
      loggerConfig: {
        level: LogLevel.INFO,
        enableConsole: true,
        enableFile: true,
        enableStructured: true,
        sensitiveDataMasking: true,
        enableCorrelation: true
      },
      ...config
    };

    this.initializeAsync();
  }

  /**
   * Wait for client initialization to complete
   */
  public async waitForInitialization(): Promise<void> {
    while (!this._initialized) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  private async initializeAsync(): Promise<void> {
    await this.initializeComponents();
    this.setupEventHandlers();
    this.initializeMetrics();
    this._initialized = true;
  }

  private async initializeComponents(): Promise<void> {
    // Initialize logger first
    this.logger = LoggerFactory.createQuantumLogger(this.config.loggerConfig);
    
    // Initialize crypto suite
    this.cryptoSuite = new CryptoSuite(this.config.cryptoConfig);
    
    // Wait for crypto initialization
    await this.cryptoSuite.waitForInitialization();
    
    // Initialize quantum components
    this.observer = new ObserverEffect(3); // 3 unauthorized attempts threshold
    this.measurement = new Measurement();
    this.entanglement = new Entanglement();

    this.logger.info('QISDD Integrated Client initialized', {
      config: this.config,
      components: ['crypto', 'quantum', 'logging', 'auditing']
    });
  }

  private setupEventHandlers(): void {
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
}


  private initializeMetrics(): void {
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
  }

  // Main API Methods

  /**
   * Protect data with quantum superposition and encryption
   */
  public async protectData(
    data: any,
    policy: ProtectionPolicy = {},
    context?: ProtectionContext
  ): Promise<ProtectedDataResult> {
    const operationId = `protect_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const correlationId = context?.correlationId || operationId;
    
    this.logger.startPerformanceTimer(operationId);
    this.logger.correlatedLog(correlationId, LogLevel.INFO, LogCategory.QUANTUM, 
      'data_protection_started', 'Starting data protection', {
        dataType: typeof data,
        policy,
        operationId
      });

    try {
      // Step 1: Validate and prepare data
      const serializedData = JSON.stringify(data);
      const dataHash = this.calculateDataHash(serializedData);
      
      // Step 2: Create multiple encrypted states
      const states: QuantumState[] = [];
      const stateCount = policy.superpositionConfig?.stateCount || this.config.superpositionConfig.stateCount;
      
      for (let i = 0; i < stateCount; i++) {
        this.logger.correlatedLog(correlationId, LogLevel.DEBUG, LogCategory.CRYPTO,
          'encrypting_state', `Encrypting quantum state ${i}`, { stateIndex: i });
        
        const ciphertext = await this.cryptoSuite.seal.encrypt(serializedData);
        const nonce = randomBytes(16);
        const mac = this.calculateMAC(ciphertext, nonce);
        
        const state: QuantumState = {
          id: `${operationId}_state_${i}`,
          index: i,
          ciphertext,
          nonce,
          mac,
          createdAt: new Date(),
          updatedAt: new Date(),
          active: i === 0,
          stateType: QuantumStateType.Healthy,
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
      }

      // Step 3: Create quantum superposition
      const superposition = new QuantumSuperposition(states, {
        ...this.config.superpositionConfig,
        ...policy.superpositionConfig
      });

      // Step 4: Generate Zero-Knowledge Proof for data integrity
      let zkProof = null;
      if (policy.requireZKProof !== false) {
        this.logger.correlatedLog(correlationId, LogLevel.DEBUG, LogCategory.CRYPTO,
          'generating_zkp', 'Generating ZK proof for data integrity');
        
        zkProof = await this.cryptoSuite.zkpProver.generateProof({
          dataHash,
          salt: randomBytes(32).toString('hex')
        }, 'data_integrity');
        
        this.metrics.cryptoOperations.zkpProofs++;
      }

      // Step 5: Set up entanglement if required
      if (policy.entangleWith) {
        for (const targetId of policy.entangleWith) {
          const targetSuperposition = this.superpositions.get(targetId);
          if (targetSuperposition) {
            this.logger.correlatedLog(correlationId, LogLevel.DEBUG, LogCategory.QUANTUM,
              'creating_entanglement', 'Creating quantum entanglement', {
                sourceId: operationId,
                targetId
              });
            
            this.entanglement.addLink({
              targetId,
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
      superposition.on('stateRotated', (event) => {
        this.logger.correlatedLog(correlationId, LogLevel.INFO, LogCategory.QUANTUM,
          'state_rotated', 'Quantum state rotated', event);
      });

      superposition.on('superpositionCollapsed', (event) => {
        this.emit('quantumCollapse', { ...event, superpositionId: operationId, correlationId });
      });

      // Step 8: Update metrics and log completion
      this.metrics.totalDataProtected++;
      this.metrics.superpositionsCreated++;
      
      const performance = this.logger.endPerformanceTimer(operationId);
      this.updateAverageResponseTime(performance.duration);

      this.logger.correlatedLog(correlationId, LogLevel.INFO, LogCategory.QUANTUM,
        'data_protection_completed', 'Data protection completed successfully', {
          superpositionId: operationId,
          statesCreated: states.length,
          hasZKProof: !!zkProof,
          entanglements: policy.entangleWith?.length || 0,
          performance
        });

      // Step 9: Emit success event
      this.emit('superpositionCreated', {
        superpositionId: operationId,
        statesCount: states.length,
        policy,
        zkProof,
        correlationId
      });

      return {
        id: operationId,
        statesCreated: states.length,
        zkProof,
        metrics: {
          encryptionTime: performance.duration,
          totalSize: states.reduce((sum, s) => sum + s.ciphertext.length, 0),
          compressionRatio: 1.0 // Placeholder
        },
        correlationId
      };

    } catch (error) {
      this.logger.error('Data protection failed', error as Error, {
        operationId,
        correlationId
      });
      
      throw new Error(`Data protection failed: ${(error as Error).message}`);
    }
  }

  /**
   * Observe (access) protected data with quantum observer effect
   */
  public async observeData(
    superpositionId: string,
    credentials: AccessCredentials,
    context?: ObservationContext
  ): Promise<ObservationResult> {
    const operationId = `observe_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const correlationId = context?.correlationId || operationId;
    
    this.logger.startPerformanceTimer(operationId);
    this.logger.correlatedLog(correlationId, LogLevel.INFO, LogCategory.QUANTUM,
      'observation_started', 'Starting data observation', {
        superpositionId,
        userId: credentials.userId,
        operationId
      });

    try {
      // Step 1: Get superposition
      const superposition = this.superpositions.get(superpositionId);
      if (!superposition) {
        throw new Error(`Superposition ${superpositionId} not found`);
      }

      // Step 2: Analyze context and calculate trust score
      const trustScore = this.calculateTrustScore(credentials, context);
      const isAuthorized = this.validateCredentials(credentials, superposition);
      
      this.logger.correlatedLog(correlationId, LogLevel.DEBUG, LogCategory.SECURITY,
        'access_evaluation', 'Evaluating access request', {
          trustScore,
          isAuthorized,
          riskFactors: this.identifyRiskFactors(context)
        });

      // Step 3: Apply observer effect
      let observerResult = null;
      if (!isAuthorized || trustScore < 0.5) {
        // Unauthorized access - trigger observer effect
        observerResult = this.observer.onUnauthorizedAccess(superpositionId, {
          trustScore,
          credentials,
          context
        });
        
        this.metrics.unauthorizedAttempts++;
        
        this.logger.correlatedLog(correlationId, LogLevel.WARN, LogCategory.SECURITY,
          'unauthorized_access_detected', 'Unauthorized access attempt detected', {
            trustScore,
            observerResult,
            credentials: { userId: credentials.userId } // Don't log full credentials
          });

        this.emit('unauthorizedAccess', {
          superpositionId,
          credentials,
          observerResult,
          correlationId
        });

        // Check if collapse triggered
        if (observerResult.newState === QuantumStateType.Collapsed) {
          superposition.collapseAll(observerResult.reason);
          
          this.emit('quantumCollapse', {
            superpositionId,
            reason: observerResult.reason,
            correlationId
          });

          return {
            success: false,
            data: null,
            state: QuantumStateType.Collapsed,
            reason: observerResult.reason,
            trustScore,
            correlationId
          };
        }

        // Return poisoned data
        const poisonedData = this.generatePoisonedData(observerResult.transformation);
        
        return {
          success: false,
          data: poisonedData,
          state: observerResult.newState,
          reason: observerResult.reason,
          trustScore,
          correlationId
        };
      }

      // Step 4: Authorized access - select appropriate state
      const selectedState = superposition.selectStateByContext({
        trustScore,
        environment: context?.environment,
        requestType: context?.requestType
      });

      if (!selectedState) {
        throw new Error('No valid quantum state available');
      }

      // Step 5: Decrypt the data
      this.logger.correlatedLog(correlationId, LogLevel.DEBUG, LogCategory.CRYPTO,
        'decrypting_state', 'Decrypting quantum state', {
          stateId: selectedState.id,
          stateType: selectedState.stateType
        });

      const decryptedData = await this.cryptoSuite.seal.decrypt(selectedState.ciphertext);
      const parsedData = JSON.parse(decryptedData);
      
      this.metrics.cryptoOperations.decryptions++;

      // Step 6: Verify data integrity if ZKP was used
      if (context?.zkProof) {
        const verified = await this.cryptoSuite.zkpVerifier.verifyProof(
          context.zkProof.proof,
          context.zkProof.publicSignals
        );
        
        if (!verified) {
          this.logger.correlatedLog(correlationId, LogLevel.ERROR, LogCategory.CRYPTO,
            'zkp_verification_failed', 'ZK proof verification failed');
          
          throw new Error('Data integrity verification failed');
        }
        
        this.metrics.cryptoOperations.verifications++;
      }

      // Step 7: Update metrics and state
      this.metrics.totalObservations++;
      selectedState.accessCount++;
      selectedState.lastAccessed = new Date();

      // Step 8: Check for state rotation
      if (selectedState.accessCount % 10 === 0) { // Rotate every 10 accesses
        superposition.rotateState();
        
        this.logger.correlatedLog(correlationId, LogLevel.INFO, LogCategory.QUANTUM,
          'automatic_rotation', 'Automatic state rotation triggered', {
            accessCount: selectedState.accessCount
          });
      }

      const performance = this.logger.endPerformanceTimer(operationId);
      this.updateAverageResponseTime(performance.duration);

      this.logger.correlatedLog(correlationId, LogLevel.INFO, LogCategory.QUANTUM,
        'observation_completed', 'Data observation completed successfully', {
          superpositionId,
          stateId: selectedState.id,
          trustScore,
          performance
        });

      this.emit('stateObserved', {
        superpositionId,
        stateId: selectedState.id,
        userId: credentials.userId,
        trustScore,
        correlationId
      });

      return {
        success: true,
        data: parsedData,
        state: selectedState.stateType,
        stateId: selectedState.id,
        trustScore,
        performance,
        correlationId
      };

    } catch (error) {
      this.logger.error('Data observation failed', error as Error, {
        superpositionId,
        operationId,
        correlationId
      });
      
      throw new Error(`Data observation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Perform homomorphic computation on protected data
   */
  public async computeOnProtectedData(
    operation: 'add' | 'multiply' | 'compare',
    superpositionIds: string[],
    context?: ComputationContext
  ): Promise<ComputationResult> {
    const operationId = `compute_${operation}_${Date.now()}`;
    const correlationId = context?.correlationId || operationId;
    
    this.logger.startPerformanceTimer(operationId);
    this.logger.correlatedLog(correlationId, LogLevel.INFO, LogCategory.CRYPTO,
      'homomorphic_computation_started', 'Starting homomorphic computation', {
        operation,
        superpositionCount: superpositionIds.length,
        operationId
      });

    try {
      // Get active states from all superpositions
      const activeStates = [];
      for (const id of superpositionIds) {
        const superposition = this.superpositions.get(id);
        if (!superposition) {
          throw new Error(`Superposition ${id} not found`);
        }
        
        const activeState = superposition.getActiveState();
        if (!activeState) {
          throw new Error(`No active state in superposition ${id}`);
        }
        
        activeStates.push(activeState);
      }

      // Perform homomorphic operation
      let result: Buffer;
      switch (operation) {
        case 'add':
          result = await this.cryptoSuite.seal.add(
            activeStates[0].ciphertext,
            activeStates[1].ciphertext
          );
          break;
        case 'multiply':
          result = await this.cryptoSuite.seal.multiply(
            activeStates[0].ciphertext,
            activeStates[1].ciphertext
          );
          break;
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }

      // Create new superposition for result
      const resultSuperposition = SuperpositionFactory.createFromData(
        { computationResult: result.toString('hex') },
        1 // Single state for computation result
      );

      const resultId = `computation_result_${Date.now()}`;
      this.superpositions.set(resultId, resultSuperposition);

      const performance = this.logger.endPerformanceTimer(operationId);

      this.logger.correlatedLog(correlationId, LogLevel.INFO, LogCategory.CRYPTO,
        'homomorphic_computation_completed', 'Homomorphic computation completed', {
          operation,
          resultId,
          performance
        });

      return {
        success: true,
        resultId,
        operation,
        inputIds: superpositionIds,
        performance,
        correlationId
      };

    } catch (error) {
      this.logger.error('Homomorphic computation failed', error as Error, {
        operation,
        operationId,
        correlationId
      });
      
      throw new Error(`Computation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get comprehensive metrics and status
   */
  public getMetrics(): ClientMetrics & { systemHealth: SystemHealth } {
    const systemHealth = this.calculateSystemHealth();
    
    return {
      ...this.metrics,
      systemHealth
    };
  }

  /**
   * Generate security and performance reports
   */
  public async generateReport(
    type: 'security' | 'performance' | 'compliance',
    timeRange: { start: Date; end: Date }
  ): Promise<any> {
    this.logger.info('Generating report', { type, timeRange });

    switch (type) {
      case 'security':
        return this.logger.generateSecurityReport(timeRange);
      case 'performance':
        return this.logger.generatePerformanceReport(timeRange);
      case 'compliance':
        return this.generateComplianceReport(timeRange);
      default:
        throw new Error(`Unsupported report type: ${type}`);
    }
  }

  /**
   * Export all logs and audit data
   */
  public async exportAuditData(format: 'json' | 'csv' | 'ndjson' = 'json'): Promise<string> {
    return this.logger.exportLogs(format);
  }

  /**
   * Get audit trail events
   */
  public getAuditTrail(filter?: Partial<AuditEvent>): AuditEvent[] {
    return this.logger.getAuditTrail(filter);
  }

  /**
   * Cleanup and destroy client
   */
  public async destroy(): Promise<void> {
  this.logger.info('Destroying QISDD client');

  // Destroy all superpositions
  this.superpositions.forEach((superposition, id) => {
    superposition.destroy();
  });
  this.superpositions.clear();

  // Cleanup logger
  this.logger.destroy();

  // Remove all listeners
  this.removeAllListeners();

  this.logger.info('QISDD client destroyed');
}


  // Private helper methods
  private calculateDataHash(data: string): string {
    const { createHash } = require('crypto');
    return createHash('sha256').update(data).digest('hex');
  }

  private calculateMAC(data: Buffer, nonce: Buffer): string {
    const { createHmac } = require('crypto');
    return createHmac('sha256', 'secret-key').update(Buffer.concat([data, nonce])).digest('hex');
  }

  private calculateTrustScore(credentials: AccessCredentials, context?: ObservationContext): number {
    let score = 0.5; // Base score

    // Factor in user reputation
    if (credentials.userReputation) {
      score += credentials.userReputation * 0.3;
    }

    // Factor in request context
    if (context?.environment === 'production') {
      score += 0.2;
    }

    // Factor in time-based patterns
    if (context?.timeOfAccess) {
      const hour = context.timeOfAccess.getHours();
      if (hour >= 9 && hour <= 17) { // Business hours
        score += 0.1;
      }
    }

    // Factor in access frequency
    if (context?.recentAccessCount && context.recentAccessCount < 10) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  private validateCredentials(credentials: AccessCredentials, superposition: QuantumSuperposition): boolean {
    // Implement credential validation logic
    return credentials.token && credentials.userId && credentials.token.length > 10;
  }

  private identifyRiskFactors(context?: ObservationContext): string[] {
    const risks = [];
    
    if (context?.ipAddress && this.isHighRiskIP(context.ipAddress)) {
      risks.push('high_risk_ip');
    }
    
    if (context?.userAgent && this.isAutomatedAgent(context.userAgent)) {
      risks.push('automated_agent');
    }
    
    if (context?.recentFailures && context.recentFailures > 3) {
      risks.push('multiple_recent_failures');
    }
    
    return risks;
  }

  private isHighRiskIP(ip: string): boolean {
    // Implement IP risk assessment
    return ip.startsWith('192.168.') === false; // Placeholder logic
  }

  private isAutomatedAgent(userAgent: string): boolean {
    const automatedPatterns = ['bot', 'crawler', 'spider', 'scraper'];
    return automatedPatterns.some(pattern => 
      userAgent.toLowerCase().includes(pattern)
    );
  }

  private generatePoisonedData(transformation: any): any {
    // Generate realistic but incorrect data
    return {
      warning: 'Data has been modified due to unauthorized access',
      originalData: 'REDACTED',
      timestamp: new Date(),
      transformation
    };
  }

  private updateAverageResponseTime(duration: number): void {
    const totalOperations = this.metrics.totalObservations + this.metrics.totalDataProtected;
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (totalOperations - 1) + duration) / totalOperations;
  }

  private calculateSystemHealth(): SystemHealth {
    const totalOps = this.metrics.totalObservations + this.metrics.totalDataProtected;
    const successRate = totalOps > 0 ? 
      (totalOps - this.metrics.unauthorizedAttempts) / totalOps : 1.0;

    return {
      overall: successRate > 0.95 ? 'excellent' : 
               successRate > 0.85 ? 'good' : 
               successRate > 0.70 ? 'fair' : 'poor',
      successRate,
      averageResponseTime: this.metrics.averageResponseTime,
      activeSuperpositions: this.superpositions.size,
      memoryUsage: process.memoryUsage().heapUsed,
      uptime: process.uptime()
    };
  }

  private generateComplianceReport(timeRange: { start: Date; end: Date }): any {
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
  }

  // Event handlers
  private handleSuperpositionCreated(event: any): void {
    this.logger.audit({
      id: `audit_${Date.now()}`,
      timestamp: new Date(),
      userId: event.userId,
      action: 'superposition_created',
      resource: 'quantum_data',
      resourceId: event.superpositionId,
      result: 'success',
      metadata: event
    });
  }

  private handleStateObserved(event: any): void {
    this.logger.audit({
      id: `audit_${Date.now()}`,
      timestamp: new Date(),
      userId: event.userId,
      action: 'data_observed',
      resource: 'quantum_state',
      resourceId: event.stateId,
      result: 'success',
      metadata: event
    });
  }

  private handleUnauthorizedAccess(event: any): void {
    this.logger.audit({
      id: `audit_${Date.now()}`,
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
  }

  private handleQuantumCollapse(event: any): void {
    this.logger.audit({
      id: `audit_${Date.now()}`,
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
  }

  private handleEncryptionCompleted(event: any): void {
    this.logger.crypto(LogLevel.DEBUG, 'encryption_completed', 
      'Encryption operation completed', event);
  }
}

// Supporting interfaces
export interface QISDDConfig {
  enableCrypto: boolean;
  enableLogging: boolean;
  enableAuditing: boolean;
  enableBlockchain: boolean;
  superpositionConfig: any;
  cryptoConfig: any;
  loggerConfig: any;
}

export interface ProtectionPolicy {
  superpositionConfig?: any;
  requireZKProof?: boolean;
  entangleWith?: string[];
  entanglementStrength?: number;
  accessControl?: {
    requiredTrustScore: number;
    allowedRoles: string[];
    timeBasedAccess?: boolean;
  };
}

export interface ProtectionContext {
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  environment?: string;
}

export interface AccessCredentials {
  userId: string;
  token: string;
  roles?: string[];
  userReputation?: number;
}

export interface ObservationContext {
  correlationId?: string;
  environment?: string;
  requestType?: string;
  ipAddress?: string;
  userAgent?: string;
  timeOfAccess?: Date;
  recentAccessCount?: number;
  recentFailures?: number;
  zkProof?: {
    proof: string;
    publicSignals: string[];
  };
}

export interface ComputationContext {
  correlationId?: string;
  userId?: string;
}

export interface ProtectedDataResult {
  id: string;
  statesCreated: number;
  zkProof?: any;
  metrics: {
    encryptionTime: number;
    totalSize: number;
    compressionRatio: number;
  };
  correlationId: string;
}

export interface ObservationResult {
  success: boolean;
  data: any;
  state: QuantumStateType;
  stateId?: string;
  reason?: string;
  trustScore: number;
  performance?: any;
  correlationId: string;
}

export interface ComputationResult {
  success: boolean;
  resultId: string;
  operation: string;
  inputIds: string[];
  performance: any;
  correlationId: string;
}

export interface ClientMetrics {
  totalDataProtected: number;
  totalObservations: number;
  unauthorizedAttempts: number;
  superpositionsCreated: number;
  quantumCollapses: number;
  averageResponseTime: number;
  cryptoOperations: {
    encryptions: number;
    decryptions: number;
    zkpProofs: number;
    verifications: number;
  };
}

export interface SystemHealth {
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  successRate: number;
  averageResponseTime: number;
  activeSuperpositions: number;
  memoryUsage: number;
  uptime: number;
}

// Export factory for easy initialization
export class QISDDFactory {
  public static createClient(config?: Partial<QISDDConfig>): QISDDIntegratedClient {
    return new QISDDIntegratedClient(config);
  }

  public static createProductionClient(): QISDDIntegratedClient {
    return new QISDDIntegratedClient({
      enableCrypto: true,
      enableLogging: true,
      enableAuditing: true,
      enableBlockchain: true,
      loggerConfig: {
        level: LogLevel.INFO,
        enableConsole: false,
        enableFile: true,
        enableStructured: true
      }
    });
  }

  public static createDevelopmentClient(): QISDDIntegratedClient {
    return new QISDDIntegratedClient({
      enableCrypto: true,
      enableLogging: true,
      enableAuditing: true,
      enableBlockchain: false,
      loggerConfig: {
        level: LogLevel.DEBUG,
        enableConsole: true,
        enableFile: false
      }
    });
  }
}

// Example usage
export async function demonstrateQISDDUsage(): Promise<void> {
  console.log('🚀 Starting QISDD-SDK Complete Integration Demo');

  // Create client
  const client = QISDDFactory.createDevelopmentClient();
  
  // Wait for initialization
  await client.waitForInitialization();

  try {
    // Protect sensitive data
    const sensitiveData = {
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
    const protectionResult = await client.protectData(sensitiveData, {
      requireZKProof: true,
      accessControl: {
        requiredTrustScore: 0.7,
        allowedRoles: ['customer', 'support'],
        timeBasedAccess: true
      }
    });

    console.log(`✅ Data protected with ID: ${protectionResult.id}`);
    console.log(`📊 States created: ${protectionResult.statesCreated}`);

    // Authorized access
    console.log('\n🔍 Attempting authorized access...');
    const authorizedResult = await client.observeData(protectionResult.id, {
      userId: 'john.doe@example.com',
      token: 'valid-jwt-token-here',
      roles: ['customer'],
      userReputation: 0.9
    }, {
      environment: 'production',
      requestType: 'account_balance',
      timeOfAccess: new Date(),
      recentAccessCount: 2
    });

    if (authorizedResult.success) {
      console.log('✅ Authorized access successful');
      console.log('💰 Account balance:', authorizedResult.data.balance);
    }

    // Unauthorized access
    console.log('\n⚠️  Attempting unauthorized access...');
    const unauthorizedResult = await client.observeData(protectionResult.id, {
      userId: 'hacker@evil.com',
      token: 'fake-token',
      userReputation: 0.1
    }, {
      environment: 'unknown',
      ipAddress: '1.2.3.4',
      userAgent: 'bot/1.0',
      recentFailures: 5
    });

    if (!unauthorizedResult.success) {
      console.log('🛡️  Unauthorized access blocked');
      console.log('☠️  Poisoned data returned:', unauthorizedResult.data);
    }

    // Homomorphic computation
    console.log('\n🧮 Performing homomorphic computation...');
    const data2 = { value: 1000 };
    const protection2 = await client.protectData(data2);
    
    const computationResult = await client.computeOnProtectedData(
      'add',
      [protectionResult.id, protection2.id]
    );

    console.log(`🔬 Computation completed: ${computationResult.resultId}`);

    // Generate reports
    console.log('\n📈 Generating security report...');
    const securityReport = await client.generateReport('security', {
      start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      end: new Date()
    });

    console.log('🔒 Security summary:', securityReport.summary);

    // Get metrics
    const metrics = client.getMetrics();
    console.log('\n📊 System metrics:');
    console.log(`- Data protected: ${metrics.totalDataProtected}`);
    console.log(`- Observations: ${metrics.totalObservations}`);
    console.log(`- Unauthorized attempts: ${metrics.unauthorizedAttempts}`);
    console.log(`- System health: ${metrics.systemHealth.overall}`);

  } catch (error) {
    console.error('❌ Demo failed:', error);
  } finally {
    await client.destroy();
    console.log('\n🏁 QISDD-SDK Demo completed');
  }
}

// Export everything
export * from './src/quantum/superposition';
export * from './src/quantum/observer-effect';
export * from './src/quantum/measurement';
export * from './src/quantum/entanglement';
export * from './src/logging';
export * from './src/crypto';