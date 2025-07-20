/**
 * QISDD Interactive Security Demo
 * Shows how quantum-inspired security stops hackers in real-time
 */

import { QISDDDemo } from './security/simple-demo';

async function runInteractiveDemo() {
  console.log('🚀 QISDD QUANTUM-INSPIRED SECURITY DEMONSTRATION');
  console.log('===============================================');
  console.log('This demo shows how QISDD protects your data from hackers\n');

  const demo = new QISDDDemo();

  try {
    // Run the complete demo
    const results = await demo.runCompleteDemo();

    // Show detailed results
    console.log('\n📋 DETAILED PROTECTION RESULTS:');
    results.protectionResults.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.item.name}:`);
      console.log(`   Status: ${result.success ? '✅ Protected' : '❌ Failed'}`);
      console.log(`   Attacks Blocked: ${result.attacksBlocked.filter((a: any) => a.blocked).length}/${result.attacksBlocked.length}`);
      console.log(`   Protection Time: ${result.item.protectionTime}ms`);
      
      // Show specific attacks blocked
      result.attacksBlocked.forEach((attack: any) => {
        if (attack.blocked) {
          console.log(`   🛡️  Blocked: ${attack.threatId} (${attack.reason})`);
        }
      });
    });

    console.log('\n🚨 MAJOR ATTACK SIMULATION:');
    console.log(results.majorAttackResult.summary);
    
    console.log('\n📊 FINAL SECURITY STATISTICS:');
    console.log(`   Total Data Items: ${results.finalStats.totalDataItems}`);
    console.log(`   Successfully Protected: ${results.finalStats.successfullyProtected}`);
    console.log(`   Total Attacks Blocked: ${results.finalStats.totalAttacksBlocked}`);
    console.log(`   Overall Success Rate: ${results.finalStats.successRate}%`);
    console.log(`   Average Response Time: ${results.finalStats.averageProtectionTime}ms`);

    // Show threat intelligence
    console.log('\n🔍 THREAT INTELLIGENCE - Types of Attacks QISDD Can Block:');
    const threats = demo.getKnownThreats();
    threats.forEach((threat, index) => {
      console.log(`${index + 1}. ${threat.name} (${threat.severity.toUpperCase()})`);
      console.log(`   Vector: ${threat.attackVector}`);
      console.log(`   Description: ${threat.description}`);
    });

    return results;

  } catch (error) {
    console.error('❌ Demo failed:', error);
    throw error;
  }
}

// Interactive functions for manual testing
export class QISDDInteractiveTester {
  private demo: QISDDDemo;

  constructor() {
    this.demo = new QISDDDemo();
  }

  /**
   * Protect a single piece of data (for manual testing)
   */
  async protectMyData(name: string, content: string, type: 'financial' | 'personal' | 'medical' | 'business' | 'other' = 'other') {
    console.log(`\n🔐 Protecting your data: "${name}"`);
    const result = await this.demo.addData(name, content, type);
    
    if (result.success) {
      console.log(`✅ Success! Your "${name}" is now quantum-protected`);
      console.log(`🛡️  Blocked ${result.attacksBlocked.filter(a => a.blocked).length} hacker attacks during protection`);
    } else {
      console.log(`❌ Protection failed: ${result.message}`);
    }
    
    return result;
  }

  /**
   * Simulate hackers trying to attack your data
   */
  simulateHackerAttack() {
    console.log('\n💀 SIMULATING HACKER ATTACK ON YOUR PROTECTED DATA...');
    return this.demo.simulateMajorAttack();
  }

  /**
   * Get current protection status
   */
  getProtectionStatus() {
    const stats = this.demo.getStats();
    console.log('\n📊 YOUR DATA PROTECTION STATUS:');
    console.log(`   📁 Protected Items: ${stats.successfullyProtected}/${stats.totalDataItems}`);
    console.log(`   🛡️  Attacks Blocked: ${stats.totalAttacksBlocked}`);
    console.log(`   ⚡ Success Rate: ${stats.successRate}%`);
    console.log(`   📊 Average Protection Time: ${stats.averageProtectionTime}ms`);
    
    return stats;
  }

  /**
   * Show what types of hackers QISDD can stop
   */
  showThreatIntelligence() {
    const threats = this.demo.getKnownThreats();
    console.log('\n🎯 HACKERS & THREATS QISDD CAN STOP:');
    
    threats.forEach((threat, index) => {
      const severityEmoji = {
        low: '🟢',
        medium: '🟡', 
        high: '🟠',
        critical: '🔴'
      }[threat.severity];
      
      console.log(`\n${index + 1}. ${severityEmoji} ${threat.name}`);
      console.log(`   Attack Method: ${threat.attackVector}`);
      console.log(`   What It Does: ${threat.description}`);
      console.log(`   Techniques: ${threat.techniques.join(', ')}`);
    });
    
    return threats;
  }
}

// Export functions for easy use
export { runInteractiveDemo };

// Run demo if called directly
if (require.main === module) {
  runInteractiveDemo()
    .then(() => {
      console.log('\n✅ Demo completed successfully!');
      console.log('🔒 Your data is now protected by QISDD quantum-inspired security');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Demo failed:', error);
      process.exit(1);
    });
}
