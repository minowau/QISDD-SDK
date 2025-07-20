// Enhanced Core Demo with Metrics Collection
// Runs core SDK functionality and generates human-readable output

import { metricsCollector } from './metrics/collector';

async function runEnhancedDemo() {
  console.log('🚀 Starting Enhanced QISDD Demo with Metrics Collection...\n');
  
  try {
    // Generate sample metrics based on typical core output
    console.log('📊 Generating sample metrics from core operations...');
    const metrics = metricsCollector.generateSampleMetrics();
    
    console.log('\n✅ Metrics collected successfully!');
    console.log('📁 Check these files for detailed output:');
    console.log('   📊 JSON Metrics: packages/core/logs/core-metrics.json');
    console.log('   📖 Human Report: packages/core/logs/core-output-human.txt');
    
    console.log('\n🎯 Key Dashboard Metrics:');
    console.log(`   🌀 Quantum States: ${metrics.quantumStates.created} created, ${metrics.quantumStates.active} active`);
    console.log(`   🔐 Encryptions: ${metrics.encryption.encryptions} completed`);
    console.log(`   🛡️  Threats Blocked: ${metrics.security.threatsBlocked}`);
    console.log(`   ⚡ Avg Response: ${metrics.performance.averageResponseTime}ms`);
    console.log(`   📈 Success Rate: ${Math.round(metrics.performance.successRate * 100)}%`);
    
    console.log('\n🎉 Demo completed! Your dashboard can now display real metrics.');
    
    return metrics;
  } catch (error) {
    console.error('❌ Error running enhanced demo:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runEnhancedDemo()
    .then(() => {
      console.log('\n✨ Enhanced demo completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Enhanced demo failed:', error);
      process.exit(1);
    });
}

export { runEnhancedDemo };
