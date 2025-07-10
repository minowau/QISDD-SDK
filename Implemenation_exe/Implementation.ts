// Example: Integrating QISDD-SDK in a Fintech Application
// This demonstrates protecting sensitive financial data with quantum-inspired security

import { 
    QuantumDataSDK, 
    AccessPolicy, 
    DegradationStrategy,
    ComplianceMode 
  } from '@qisdd/sdk';
  import { FintechHandlers } from '@qisdd/fintech';
  import express from 'express';
  
  // Initialize the SDK with fintech-specific configuration
  const qisdd = new QuantumDataSDK({
    // Blockchain configuration
    blockchain: {
      network: 'polygon',
      contractAddress: process.env.AUDIT_CONTRACT_ADDRESS,
      privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY
    },
    
    // Encryption settings
    encryption: {
      scheme: 'SEAL',
      keySize: 4096,
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY
    },
    
    // Zero-knowledge proof configuration
    zkp: {
      scheme: 'groth16',
      provingKey: './keys/proving_key.json',
      verificationKey: './keys/verification_key.json'
    },
    
    // Context detection settings
    context: {
      trustThreshold: 0.7,
      anomalyDetection: true,
      mlModel: './models/context_classifier.onnx'
    },
    
    // Compliance settings
    compliance: {
      mode: ComplianceMode.STRICT,
      regulations: ['GDPR', 'CCPA', 'PCI_DSS'],
      dataResidency: 'EU'
    }
  });
  
  // Initialize fintech-specific handlers
  const fintech = new FintechHandlers(qisdd);
  
  // Express API example
  const app = express();
  app.use(express.json());
  
  // Middleware for context detection
  app.use(async (req, res, next) => {
    req.context = await qisdd.detectContext({
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      apiKey: req.headers['x-api-key'],
      timestamp: Date.now()
    });
    next();
  });
  
  /**
   * Example 1: Protecting Customer Financial Data
   */
  app.post('/api/customers/:id/financial-data', async (req, res) => {
    try {
      const customerId = req.params.id;
      const financialData = req.body;
      
      // Define access policy for financial data
      const policy: AccessPolicy = {
        // Allowed contexts (production environment, authorized APIs)
        allowedContexts: [
          { type: 'environment', value: 'production-vpc' },
          { type: 'api-key', value: 'authorized-partners' },
          { type: 'ip-range', value: '10.0.0.0/8' }
        ],
        
        // Observation limits
        observationLimit: 5, // Max 5 accesses per day
        timeWindow: { value: 24, unit: 'hours' },
        
        // Progressive degradation strategy
        degradationStrategy: DegradationStrategy.PROGRESSIVE_POISON,
        
        // Alert after 2 unauthorized attempts
        alertThreshold: 2,
        
        // Quantum-inspired settings
        superpositionCount: 5, // Create 5 encrypted states
        entanglementStrength: 0.8,
        
        // Compliance requirements
        compliance: {
          dataRetention: 90, // days
          rightToErasure: true,
          auditLog: true
        }
      };
      
      // Create protected financial data
      const protectedData = await fintech.protectFinancialData(
        customerId,
        financialData,
        policy
      );
      
      res.json({
        success: true,
        dataId: protectedData.id,
        message: 'Financial data protected with quantum security',
        policy: {
          observationLimit: policy.observationLimit,
          timeWindow: policy.timeWindow
        }
      });
      
    } catch (error) {
      console.error('Error protecting financial data:', error);
      res.status(500).json({ error: 'Failed to protect data' });
    }
  });
  
  /**
   * Example 2: Accessing Protected Financial Data
   */
  app.get('/api/protected-data/:dataId', async (req, res) => {
    try {
      const { dataId } = req.params;
      const credentials = {
        apiKey: req.headers['x-api-key'],
        signature: req.headers['x-signature'],
        timestamp: Date.now(),
        metadata: {
          purpose: req.query.purpose,
          requestId: req.headers['x-request-id']
        }
      };
      
      // Attempt to observe protected data
      const result = await qisdd.observe(dataId, credentials);
      
      if (result.success) {
        // Authorized access - return decrypted data
        res.json({
          success: true,
          data: result.data,
          proof: result.proof, // ZK proof of authorization
          metadata: result.metadata
        });
        
      } else if (result.honeypot) {
        // Unauthorized access - return honeypot data
        // (The attacker doesn't know this is fake)
        res.json({
          success: true,
          data: result.honeypot.data,
          warning: 'Rate limit approaching'
        });
        
        // Log security incident
        await qisdd.logSecurityIncident({
          type: 'honeypot_served',
          dataId,
          context: req.context,
          timestamp: Date.now()
        });
        
      } else {
        // Access denied
        res.status(403).json({
          error: result.error || 'Access denied',
          warning: result.warning
        });
      }
      
    } catch (error) {
      console.error('Error accessing protected data:', error);
      res.status(500).json({ error: 'Failed to access data' });
    }
  });
  
  /**
   * Example 3: Privacy-Preserving Balance Check
   * Verify if balance meets requirements without revealing actual amount
   */
  app.post('/api/balance/verify', async (req, res) => {
    try {
      const { accountId, requiredAmount, purpose } = req.body;
      
      // Create a zero-knowledge proof that balance >= requiredAmount
      const proof = await fintech.createBalanceProof(
        accountId,
        requiredAmount,
        {
          purpose,
          timestamp: Date.now(),
          requesterId: req.headers['x-requester-id']
        }
      );
      
      // Verify the proof without accessing actual balance
      const verification = await fintech.verifyBalanceProof(proof);
      
      res.json({
        success: true,
        verified: verification.valid,
        proofId: proof.id,
        message: verification.valid 
          ? 'Balance requirement satisfied'
          : 'Balance requirement not met',
        // No actual balance data is revealed
      });
      
    } catch (error) {
      console.error('Error verifying balance:', error);
      res.status(500).json({ error: 'Verification failed' });
    }
  });
  
  /**
   * Example 4: Secure Transaction Processing
   * Process transactions with quantum protection
   */
  app.post('/api/transactions/process', async (req, res) => {
    try {
      const transaction = req.body;
      
      // Create protected transaction with auto-expiry
      const protectedTx = await fintech.createProtectedTransaction(transaction, {
        expiryTime: 300, // 5 minutes
        maxAttempts: 3,
        requiresMFA: true,
        
        // Quantum collapse on suspicious activity
        collapseOnAnomaly: true,
        anomalyThreshold: 0.8
      });
      
      // Process with homomorphic operations (no decryption needed)
      const result = await fintech.processTransaction(protectedTx, {
        validateBalance: true,
        checkFraud: true,
        applyFees: true
      });
      
      if (result.success) {
        res.json({
          success: true,
          transactionId: result.transactionId,
          status: 'processed',
          fee: result.fee,
          // Actual amounts remain encrypted
        });
      } else {
        res.status(400).json({
          error: result.error,
          code: result.errorCode
        });
      }
      
    } catch (error) {
      console.error('Error processing transaction:', error);
      res.status(500).json({ error: 'Transaction processing failed' });
    }
  });
  
  /**
   * Example 5: Compliance and Audit Trail
   */
  app.get('/api/audit/data-access/:dataId', async (req, res) => {
    try {
      const { dataId } = req.params;
      const { startDate, endDate } = req.query;
      
      // Retrieve tamper-evident audit log from blockchain
      const auditLog = await qisdd.getAuditLog(dataId, {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        includeUnauthorized: true
      });
      
      // Generate compliance report
      const complianceReport = await fintech.generateComplianceReport(
        dataId,
        auditLog,
        {
          regulations: ['GDPR', 'CCPA'],
          format: 'detailed'
        }
      );
      
      res.json({
        success: true,
        auditLog: auditLog.entries,
        totalAccesses: auditLog.totalAccesses,
        unauthorizedAttempts: auditLog.unauthorizedAttempts,
        complianceStatus: complianceReport.status,
        recommendations: complianceReport.recommendations
      });
      
    } catch (error) {
      console.error('Error retrieving audit log:', error);
      res.status(500).json({ error: 'Failed to retrieve audit log' });
    }
  });
  
  /**
   * Example 6: Real-time Threat Monitoring
   */
  app.ws('/api/security/monitor', (ws, req) => {
    // Subscribe to security events
    const subscription = qisdd.subscribeToSecurityEvents({
      severity: ['medium', 'high', 'critical'],
      dataIds: req.query.dataIds?.split(',') || ['*'],
      eventTypes: [
        'unauthorized_access',
        'anomaly_detected',
        'data_collapsed',
        'honeypot_triggered'
      ]
    });
    
    subscription.on('event', (event) => {
      ws.send(JSON.stringify({
        type: 'security_event',
        event: {
          id: event.id,
          type: event.type,
          severity: event.severity,
          dataId: event.dataId,
          context: event.context,
          timestamp: event.timestamp,
          recommendedAction: event.recommendedAction
        }
      }));
    });
    
    ws.on('close', () => {
      subscription.unsubscribe();
    });
  });
  
  /**
   * Example 7: Data Erasure (GDPR Right to be Forgotten)
   */
  app.delete('/api/customers/:customerId/data', async (req, res) => {
    try {
      const { customerId } = req.params;
      const { reason, verificationToken } = req.body;
      
      // Verify erasure request
      const verified = await fintech.verifyErasureRequest(
        customerId,
        verificationToken
      );
      
      if (!verified) {
        return res.status(401).json({ error: 'Invalid verification token' });
      }
      
      // Execute quantum collapse on all customer data
      const erasureResult = await fintech.executeDataErasure(customerId, {
        reason,
        collapseMethod: 'quantum_noise',
        preserveAuditLog: true, // Keep audit log for compliance
        notifyEntangled: true // Notify systems with entangled data
      });
      
      // Generate erasure certificate
      const certificate = await fintech.generateErasureCertificate(
        customerId,
        erasureResult
      );
      
      res.json({
        success: true,
        message: 'Customer data has been quantum-collapsed',
        certificate: certificate.hash,
        erasedDataIds: erasureResult.erasedIds,
        timestamp: erasureResult.timestamp
      });
      
    } catch (error) {
      console.error('Error erasing customer data:', error);
      res.status(500).json({ error: 'Failed to erase data' });
    }
  });
  
  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`QISDD-protected fintech API running on port ${PORT}`);
    console.log('Quantum security: ACTIVE');
    console.log('Observer effect: ENABLED');
    console.log('Compliance mode:', qisdd.config.compliance.mode);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Shutting down QISDD SDK...');
    await qisdd.shutdown();
    process.exit(0);
  });