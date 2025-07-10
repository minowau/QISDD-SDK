import { QISDDClient } from '@qisdd/sdk';

export async function runBasicProtectionExample() {
  const sdk = new QISDDClient({
    blockchain: {
      rpcUrl: process.env.POLYGON_RPC_URL,
      privateKey: process.env.POLYGON_PRIVATE_KEY,
      accessControlAddress: process.env.ACCESS_CONTROL_ADDRESS,
      auditTrailAddress: process.env.AUDIT_TRAIL_ADDRESS,
    },
  });

  // 1. Protect data
  const policy = { observationLimit: 2, timeWindow: { value: 24, unit: 'hours' }, superpositionCount: 3 };
  const data = { account: '123456', balance: 50000 };
  const dataId = await sdk.protect(data, policy);
  console.log('Protected dataId:', dataId);

  // 2. Authorized access
  const authorized = await sdk.observe(dataId, { ip: '10.0.0.1', environment: 'production' });
  console.log('Authorized access:', authorized);

  // 3. Unauthorized access (simulate local IP)
  const unauthorized = await sdk.observe(dataId, { ip: '127.0.0.1', environment: 'production' });
  console.log('Unauthorized access:', unauthorized);

  // 4. Retrieve audit log (if blockchain enabled)
  if (sdk['polygon']) {
    const fromTime = Math.floor(Date.now() / 1000) - 3600;
    const toTime = Math.floor(Date.now() / 1000) + 3600;
    const log = await sdk['polygon'].getAuditLog(dataId, fromTime, toTime);
    console.log('Blockchain audit log:', log);
  }
} 