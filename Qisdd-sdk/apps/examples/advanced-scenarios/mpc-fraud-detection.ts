import { QISDDClient } from '@qisdd/sdk';

export async function runMPCFraudDetectionExample() {
  // Simulate three parties: bankA, bankB, regulator
  const bankA = new QISDDClient({
    blockchain: {
      rpcUrl: process.env.POLYGON_RPC_URL,
      privateKey: process.env.POLYGON_PRIVATE_KEY,
      accessControlAddress: process.env.ACCESS_CONTROL_ADDRESS,
      auditTrailAddress: process.env.AUDIT_TRAIL_ADDRESS,
    },
  });
  const bankB = new QISDDClient({
    blockchain: {
      rpcUrl: process.env.POLYGON_RPC_URL,
      privateKey: process.env.POLYGON_PRIVATE_KEY,
      accessControlAddress: process.env.ACCESS_CONTROL_ADDRESS,
      auditTrailAddress: process.env.AUDIT_TRAIL_ADDRESS,
    },
  });
  const regulator = new QISDDClient({
    blockchain: {
      rpcUrl: process.env.POLYGON_RPC_URL,
      privateKey: process.env.POLYGON_PRIVATE_KEY,
      accessControlAddress: process.env.ACCESS_CONTROL_ADDRESS,
      auditTrailAddress: process.env.AUDIT_TRAIL_ADDRESS,
    },
  });

  // Each bank protects its own transaction data
  const txA = { account: 'A123', amount: 1000, merchant: 'StoreX', timestamp: Date.now() };
  const txB = { account: 'B456', amount: 950, merchant: 'StoreX', timestamp: Date.now() };
  const policy = { observationLimit: 5, timeWindow: { value: 24, unit: 'hours' }, superpositionCount: 3 };
  const dataIdA = await bankA.protect(txA, policy);
  const dataIdB = await bankB.protect(txB, policy);
  console.log('BankA dataId:', dataIdA);
  console.log('BankB dataId:', dataIdB);

  // Regulator performs privacy-preserving fraud pattern computation (mocked)
  // In real: would use MPC or ZKP to compute on encrypted data
  const fraudPattern = (txA.merchant === txB.merchant && Math.abs(txA.amount - txB.amount) < 100);
  console.log('Fraud pattern detected:', fraudPattern);

  // Print blockchain audit logs for each participant
  for (const [client, label, dataId] of [
    [bankA, 'BankA', dataIdA],
    [bankB, 'BankB', dataIdB],
  ] as const) {
    if (client['polygon']) {
      const fromTime = Math.floor(Date.now() / 1000) - 3600;
      const toTime = Math.floor(Date.now() / 1000) + 3600;
      const log = await client['polygon'].getAuditLog(dataId, fromTime, toTime);
      console.log(`${label} blockchain audit log:`, log);
    }
  }
} 