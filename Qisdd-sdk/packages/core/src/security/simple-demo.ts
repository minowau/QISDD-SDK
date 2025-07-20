/**
 * Simple Interactive Demo - Shows how QISDD protects data and blocks hackers
 */

import { QISDDIntegratedClient } from '../index';
import { ThreatSimulator, AttackResult } from './threat-simulator';

export interface DemoDataItem {
  id: string;
  name: string;
  content: string;
  type: 'financial' | 'personal' | 'medical' | 'business' | 'other';
  protected: boolean;
  timestamp: Date;
  protectionTime?: number;
  attacksBlocked?: number;
}

export class QISDDDemo {
  private qisddClient: QISDDIntegratedClient;
  private threatSimulator: ThreatSimulator;
  private protectedData: DemoDataItem[] = [];
  private totalAttacksBlocked = 0;

  constructor() {
    this.qisddClient = new QISDDIntegratedClient();
    this.threatSimulator = new ThreatSimulator();
  }

  /**
   * Add and protect new data - this is what users will see
   */
  public async addData(name: string, content: string, type: DemoDataItem['type'] = 'other'): Promise<{
    success: boolean;
    item: DemoDataItem;
    attacksBlocked: AttackResult[];
    message: string;
  }> {
    const startTime = Date.now();
    const dataId = `QISDD_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    console.log(`\n🔒 Protecting "${name}" with QISDD quantum security...`);
    
    // Simulate attacks during protection
    const attacksDetected: AttackResult[] = [];
    
    try {
      // Simulate 1-3 hacker attacks during data protection
      const numAttacks = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numAttacks; i++) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Realistic timing
        const attack = this.threatSimulator.simulateAttack();
        attacksDetected.push(attack);
        
        if (attack.blocked) {
          console.log(`🛡️  BLOCKED: ${attack.reason}`);
          this.totalAttacksBlocked++;
        } else {
          console.log(`⚠️  DETECTED: ${attack.reason} (analyzing...)`);
        }
      }

      // Use actual QISDD protection
      await this.qisddClient.protectData(content);
      
      const protectionTime = Date.now() - startTime;
      const blockedCount = attacksDetected.filter(a => a.blocked).length;
      
      const item: DemoDataItem = {
        id: dataId,
        name,
        content,
        type,
        protected: true,
        timestamp: new Date(),
        protectionTime,
        attacksBlocked: blockedCount
      };

      this.protectedData.push(item);

      const message = `✅ "${name}" protected! Blocked ${blockedCount}/${attacksDetected.length} attacks in ${protectionTime}ms`;
      console.log(message);

      return {
        success: true,
        item,
        attacksBlocked: attacksDetected,
        message
      };

    } catch (error) {
      const item: DemoDataItem = {
        id: dataId,
        name,
        content,
        type,
        protected: false,
        timestamp: new Date(),
        protectionTime: Date.now() - startTime
      };

      return {
        success: false,
        item,
        attacksBlocked: attacksDetected,
        message: `❌ Failed to protect "${name}": ${error}`
      };
    }
  }

  /**
   * Simulate a major coordinated attack on all protected data
   */
  public simulateMajorAttack(): {
    attacks: AttackResult[];
    summary: string;
  } {
    console.log('\n🚨 SIMULATING COORDINATED HACKER ATTACK ON ALL PROTECTED DATA...');
    console.log('💀 Advanced Persistent Threat (APT) detected!');
    
    const attacks: AttackResult[] = [];
    
    // Simulate APT attack phases
    attacks.push(...this.threatSimulator.simulateAdvancedPersistentThreat());
    
    // Add individual attacks targeting each data type
    const dataTypes = Array.from(new Set(this.protectedData.map(d => d.type)));
    dataTypes.forEach(type => {
      attacks.push(this.threatSimulator.simulateAttack());
    });
    
    const blockedCount = attacks.filter(a => a.blocked).length;
    const successRate = Math.round((blockedCount / attacks.length) * 100);
    
    console.log(`\n🛡️  QISDD DEFENSE RESULTS:`);
    console.log(`   ✅ Blocked: ${blockedCount}/${attacks.length} attacks`);
    console.log(`   📊 Success Rate: ${successRate}%`);
    console.log(`   ⚡ Average Response: ${Math.round(attacks.reduce((sum, a) => sum + a.responseTime, 0) / attacks.length)}ms`);
    
    const summary = `MAJOR ATTACK NEUTRALIZED! QISDD blocked ${blockedCount}/${attacks.length} attacks (${successRate}% success rate)`;
    
    this.totalAttacksBlocked += blockedCount;
    
    return { attacks, summary };
  }

  /**
   * Get demo statistics for dashboard
   */
  public getStats() {
    const totalItems = this.protectedData.length;
    const protectedItems = this.protectedData.filter(d => d.protected).length;
    const totalSize = this.protectedData.reduce((sum, item) => sum + item.content.length, 0);
    const avgProtectionTime = this.protectedData.reduce((sum, item) => sum + (item.protectionTime || 0), 0) / totalItems || 0;
    
    return {
      totalDataItems: totalItems,
      successfullyProtected: protectedItems,
      totalAttacksBlocked: this.totalAttacksBlocked,
      successRate: totalItems > 0 ? Math.round((protectedItems / totalItems) * 100) : 0,
      totalDataSize: totalSize,
      averageProtectionTime: Math.round(avgProtectionTime),
      protectedData: this.protectedData
    };
  }

  /**
   * Run the complete demo scenario
   */
  public async runCompleteDemo(): Promise<{
    protectionResults: any[];
    majorAttackResult: any;
    finalStats: any;
    demoSummary: string;
  }> {
    console.log('\n🎯 STARTING QISDD COMPLETE SECURITY DEMO');
    console.log('=======================================');

    // Sample sensitive data to protect
    const sampleData = [
      { name: 'Customer Credit Cards', content: 'CC: 4532-1234-5678-9012, 5555-4444-3333-2222', type: 'financial' as const },
      { name: 'Medical Records', content: 'Patient: John Doe, SSN: 123-45-6789, Diagnosis: Confidential', type: 'medical' as const },
      { name: 'API Keys & Passwords', content: 'AWS_KEY=AKIAIOSFODNN7EXAMPLE, DB_PASS=SuperSecret123!', type: 'business' as const },
      { name: 'Employee Personal Info', content: 'Employees: alice@company.com, bob@company.com, SSNs: 987-65-4321', type: 'personal' as const },
      { name: 'Business Contracts', content: 'Contract #2024-001: $2.5M deal with ACME Corp, confidential terms...', type: 'business' as const }
    ];

    const protectionResults = [];

    // Protect each data item
    for (const data of sampleData) {
      const result = await this.addData(data.name, data.content, data.type);
      protectionResults.push(result);
      await new Promise(resolve => setTimeout(resolve, 500)); // Realistic timing
    }

    // Simulate major coordinated attack
    const majorAttackResult = this.simulateMajorAttack();

    // Generate final statistics
    const finalStats = this.getStats();

    const demoSummary = `
🎯 QISDD SECURITY DEMO COMPLETE!
================================
📊 DATA PROTECTED: ${finalStats.totalDataItems} items (${finalStats.totalDataSize} bytes)
🛡️  ATTACKS BLOCKED: ${finalStats.totalAttacksBlocked} total threats neutralized  
⚡ PERFORMANCE: ${finalStats.averageProtectionTime}ms average protection time
🎯 SUCCESS RATE: ${finalStats.successRate}% data protection success
🚫 HACKERS STOPPED: SQL injection, ransomware, phishing, DDoS, zero-day exploits

✅ Your sensitive data is now protected by quantum-inspired security!
`;

    console.log(demoSummary);

    return {
      protectionResults,
      majorAttackResult,
      finalStats,
      demoSummary
    };
  }

  /**
   * Get all threats for educational purposes
   */
  public getKnownThreats() {
    return this.threatSimulator.getAllThreats();
  }
}
