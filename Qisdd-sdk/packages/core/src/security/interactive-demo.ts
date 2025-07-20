/**
 * Interactive Data Protection Demo - Shows how QISDD protects user data
 */

import { QISDDIntegratedClient } from '../index';
import { ThreatSimulator, AttackResult } from './threat-simulator';

export interface ProtectedDataItem {
  id: string;
  name: string;
  type: 'financial' | 'personal' | 'medical' | 'business' | 'other';
  size: number; // in bytes
  protectionLevel: 'basic' | 'enhanced' | 'quantum';
  timestamp: Date;
  quantumStateId?: string;
  encryptionKey?: string;
  zkProofId?: string;
}

export interface DataProtectionResult {
  success: boolean;
  dataItem: ProtectedDataItem;
  protectionDetails: {
    quantumStatesUsed: number;
    encryptionTime: number;
    zkProofGenerated: boolean;
    trustScore: number;
  };
  securityEvents: AttackResult[];
}

export class InteractiveDataProtection {
  private qisddCore: QISDDIntegratedClient;
  private threatSimulator: ThreatSimulator;
  private protectedData: Map<string, ProtectedDataItem> = new Map();

  constructor() {
    this.qisddCore = new QISDDIntegratedClient();
    this.threatSimulator = new ThreatSimulator();
  }

  /**
   * Add and protect new data with quantum-inspired security
   */
  public async addProtectedData(
    name: string, 
    content: string, 
    type: ProtectedDataItem['type'] = 'other',
    protectionLevel: ProtectedDataItem['protectionLevel'] = 'enhanced'
  ): Promise<DataProtectionResult> {
    const startTime = Date.now();
    
    // Create unique ID for this data
    const dataId = `QISDD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate attacks during data protection process
    const attacksDetected: AttackResult[] = [];
    
    try {
      // Step 1: Protect data using QISDD's protectData method
      const protectionResult = await this.qisddCore.protectData(dataId, content, {
        enableCrypto: protectionLevel !== 'basic',
        enableSuperposition: true,
        enableLogging: true,
        trustThreshold: protectionLevel === 'quantum' ? 0.9 : 0.7
      });
      
      // Simulate attack during protection
      if (Math.random() > 0.7) {
        attacksDetected.push(this.threatSimulator.simulateAttack());
      }

      // Step 2: Simulate additional quantum states for higher protection levels
      const quantumStates = protectionLevel === 'quantum' ? 3 : protectionLevel === 'enhanced' ? 2 : 1;
      
      // Step 3: Observe the data to verify protection (this simulates ZK proof)
      let zkProofGenerated = false;
      if (protectionLevel !== 'basic') {
        try {
          await this.qisddCore.observeData(dataId, { 
            includeMetrics: true,
            validateIntegrity: true 
          });
          zkProofGenerated = true;
          
          // Simulate advanced attack during observation
          if (Math.random() > 0.5) {
            attacksDetected.push(this.threatSimulator.simulateAttack());
          }
        } catch (error) {
          // Observation might fail under attack
        }
      }

      const endTime = Date.now();
      const encryptionTime = endTime - startTime;

      // Create protected data item
      const dataItem: ProtectedDataItem = {
        id: dataId,
        name,
        type,
        size: content.length,
        protectionLevel,
        timestamp: new Date(),
        quantumStateId,
        encryptionKey: encryptionResult.encryptedData.substring(0, 16) + '...', // Show partial key
        zkProofId
      };

      this.protectedData.set(dataId, dataItem);

      return {
        success: true,
        dataItem,
        protectionDetails: {
          quantumStatesUsed: quantumStates,
          encryptionTime,
          zkProofGenerated: !!zkProofId,
          trustScore: this.calculateDataTrustScore(attacksDetected, protectionLevel)
        },
        securityEvents: attacksDetected
      };

    } catch (error) {
      // Even if protection fails, simulate some attacks
      attacksDetected.push(this.threatSimulator.simulateAttack());
      
      const dataItem: ProtectedDataItem = {
        id: dataId,
        name,
        type,
        size: content.length,
        protectionLevel: 'basic', // Fallback to basic
        timestamp: new Date()
      };

      return {
        success: false,
        dataItem,
        protectionDetails: {
          quantumStatesUsed: 0,
          encryptionTime: Date.now() - startTime,
          zkProofGenerated: false,
          trustScore: 25 // Low trust due to failure
        },
        securityEvents: attacksDetected
      };
    }
  }

  /**
   * Simulate a coordinated attack on all protected data
   */
  public simulateMajorAttack(): AttackResult[] {
    console.log('🚨 SIMULATING MAJOR COORDINATED ATTACK ON PROTECTED DATA...');
    
    const attacks: AttackResult[] = [];
    
    // Simulate APT (Advanced Persistent Threat)
    attacks.push(...this.threatSimulator.simulateAdvancedPersistentThreat());
    
    // Add some individual attacks
    for (let i = 0; i < Math.random() * 3 + 2; i++) {
      attacks.push(this.threatSimulator.simulateAttack());
    }
    
    // Show how QISDD blocked them
    const blockedCount = attacks.filter(a => a.blocked).length;
    console.log(`✅ QISDD SUCCESSFULLY BLOCKED ${blockedCount}/${attacks.length} ATTACKS`);
    
    return attacks;
  }

  /**
   * Get all protected data items
   */
  public getProtectedData(): ProtectedDataItem[] {
    return Array.from(this.protectedData.values());
  }

  /**
   * Get protection statistics
   */
  public getProtectionStats() {
    const data = this.getProtectedData();
    const totalSize = data.reduce((sum, item) => sum + item.size, 0);
    const typeDistribution = data.reduce((dist, item) => {
      dist[item.type] = (dist[item.type] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);

    return {
      totalItems: data.length,
      totalSizeBytes: totalSize,
      typeDistribution,
      protectionLevels: {
        basic: data.filter(d => d.protectionLevel === 'basic').length,
        enhanced: data.filter(d => d.protectionLevel === 'enhanced').length,
        quantum: data.filter(d => d.protectionLevel === 'quantum').length
      }
    };
  }

  private calculateDataTrustScore(attacks: AttackResult[], protectionLevel: string): number {
    const baseScore = protectionLevel === 'quantum' ? 95 : protectionLevel === 'enhanced' ? 85 : 70;
    const attackPenalty = attacks.filter(a => !a.blocked).length * 10;
    const attackBonus = attacks.filter(a => a.blocked).length * 2;
    
    return Math.max(10, Math.min(100, baseScore - attackPenalty + attackBonus));
  }

  /**
   * Demo scenario: Protect different types of sensitive data
   */
  public async runDataProtectionDemo(): Promise<{
    results: DataProtectionResult[];
    majorAttack: AttackResult[];
    summary: string;
  }> {
    console.log('🔒 Starting QISDD Data Protection Demo...\n');

    const demoData = [
      { name: 'Customer Credit Cards', content: 'Credit card numbers: 4532-1234-5678-9012, 5678-9012-3456-7890', type: 'financial' as const, protection: 'quantum' as const },
      { name: 'Medical Records', content: 'Patient ID: 12345, Diagnosis: Confidential medical information', type: 'medical' as const, protection: 'quantum' as const },
      { name: 'Employee SSNs', content: 'Social Security Numbers: 123-45-6789, 987-65-4321', type: 'personal' as const, protection: 'enhanced' as const },
      { name: 'API Keys', content: 'AWS_KEY=abc123def456, DB_PASSWORD=supersecret789', type: 'business' as const, protection: 'enhanced' as const },
      { name: 'User Emails', content: 'user@example.com, admin@company.com, support@domain.org', type: 'personal' as const, protection: 'basic' as const }
    ];

    const results: DataProtectionResult[] = [];

    for (const data of demoData) {
      console.log(`Protecting: ${data.name}...`);
      const result = await this.addProtectedData(data.name, data.content, data.type, data.protection);
      results.push(result);
      
      console.log(`✅ ${data.name} protected with ${result.protectionDetails.quantumStatesUsed} quantum states`);
      if (result.securityEvents.length > 0) {
        console.log(`🛡️  Blocked ${result.securityEvents.filter(e => e.blocked).length} attacks during protection`);
      }
    }

    // Simulate major attack after all data is protected
    console.log('\n🚨 SIMULATING COORDINATED HACKER ATTACK...');
    const majorAttack = this.simulateMajorAttack();

    const stats = this.getProtectionStats();
    const blockedAttacks = majorAttack.filter(a => a.blocked).length;
    
    const summary = `
🎯 DEMO COMPLETE! 
📊 Protected ${stats.totalItems} data items (${stats.totalSizeBytes} bytes)
🛡️  Generated ${results.reduce((sum, r) => sum + r.protectionDetails.quantumStatesUsed, 0)} quantum states
🚫 Blocked ${blockedAttacks}/${majorAttack.length} coordinated attacks (${Math.round(blockedAttacks/majorAttack.length*100)}% success rate)
⚡ Average protection time: ${Math.round(results.reduce((sum, r) => sum + r.protectionDetails.encryptionTime, 0) / results.length)}ms
`;

    console.log(summary);

    return { results, majorAttack, summary };
  }
}
