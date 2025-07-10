import { QISDDClient } from '@qisdd/sdk';

export async function runFintechIntegrationExample() {
  const sdk = new QISDDClient({
    blockchain: {
      rpcUrl: process.env.POLYGON_RPC_URL,
      privateKey: process.env.POLYGON_PRIVATE_KEY,
      accessControlAddress: process.env.ACCESS_CONTROL_ADDRESS,
      auditTrailAddress: process.env.AUDIT_TRAIL_ADDRESS,
    },
  });

  // 1. Protect customer data
  const policy = { observationLimit: 3, timeWindow: { value: 24, unit: 'hours' }, superpositionCount: 5 };
  const customer = { account_number: '789012', balance: 120000, credit_score: 780 };
  const dataId = await sdk.protect(customer, policy);
  console.log('Protected customer dataId:', dataId);

  // 2. Zero-knowledge verification (e.g., balance >= 100000)
  const verification = await sdk.verify(dataId, 'balance_gte', 100000);
  console.log('ZKP verification:', verification);

  // 3. Retrieve audit log (if blockchain enabled)
  if (sdk['polygon']) {
    const fromTime = Math.floor(Date.now() / 1000) - 3600;
    const toTime = Math.floor(Date.now() / 1000) + 3600;
    const log = await sdk['polygon'].getAuditLog(dataId, fromTime, toTime);
    console.log('Blockchain audit log:', log);
  }
} 