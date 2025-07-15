// run-basic.ts
// Update the import path to the correct location of QISDDFactory
import { QISDDFactory } from '../src/complete-integration-example';

async function runBasicTest() {
  console.log('🚀 Starting QISDD Quantum Superposition Test\n');

  const client = QISDDFactory.createDevelopmentClient();

  try {
    // Test data
    const testData = {
      message: 'Hello Quantum World!',
      secret: 'classified-123',
      timestamp: new Date()
    };

    console.log('1️⃣ Protecting data with quantum superposition...');
    const protection = await client.protectData(testData);
    console.log(`   ✅ Protected with ID: ${protection.id}`);
    console.log(`   🔢 Quantum states: ${protection.statesCreated}`);

    console.log('\n2️⃣ Testing authorized access...');
    const authorized = await client.observeData(protection.id, {
      userId: 'test@example.com',
      token: 'valid-token',
      userReputation: 0.9
    });
    console.log(`   ✅ Success: ${authorized.success}`);
    console.log(`   📊 Trust: ${authorized.trustScore}`);

    console.log('\n3️⃣ Testing unauthorized access...');
    const unauthorized = await client.observeData(protection.id, {
      userId: 'hacker@evil.com', 
      token: 'fake-token',
      userReputation: 0.1
    });
    console.log(`   🛡️ Blocked: ${!unauthorized.success}`);
    console.log(`   ⚠️ Poisoned: ${!!unauthorized.data._qisdd_warning}`);

    // Test audit trail
    console.log('\n4️⃣ Querying audit trail...');
    const auditTrail = client.logger.getAuditTrail({ resourceId: protection.id });
    console.log('   📝 Audit events:', auditTrail);

    console.log('\n📊 Final Metrics:');
    const metrics = client.getMetrics();
    console.log(`