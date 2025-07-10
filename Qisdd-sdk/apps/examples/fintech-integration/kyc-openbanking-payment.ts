import { QISDDClient } from '@qisdd/sdk';

export async function runFintechRealWorldExample() {
  const sdk = new QISDDClient({
    blockchain: {
      rpcUrl: process.env.POLYGON_RPC_URL,
      privateKey: process.env.POLYGON_PRIVATE_KEY,
      accessControlAddress: process.env.ACCESS_CONTROL_ADDRESS,
      auditTrailAddress: process.env.AUDIT_TRAIL_ADDRESS,
    },
  });

  // 1. KYC onboarding (simulate)
  const kycData = { customerId: 'kyc_001', name: 'Bob', dob: '1990-01-01', idVerified: true };
  const kycPolicy = { observationLimit: 2, timeWindow: { value: 24, unit: 'hours' }, superpositionCount: 3 };
  const kycId = await sdk.protect(kycData, kycPolicy);
  console.log('KYC protected dataId:', kycId);

  // 2. Open banking data protection
  const openBankingData = { accountId: 'ob_123', transactions: [
    { date: '2024-01-01', amount: -100, merchant: 'CoffeeShop' },
    { date: '2024-01-02', amount: 2000, merchant: 'Employer' }
  ] };
  const obPolicy = { observationLimit: 5, timeWindow: { value: 24, unit: 'hours' }, superpositionCount: 3 };
  const obId = await sdk.protect(openBankingData, obPolicy);
  console.log('Open banking protected dataId:', obId);

  // 3. Payment processor integration (simulate payment)
  const paymentData = { paymentId: 'pay_001', from: 'ob_123', to: 'merchant_456', amount: 50, status: 'initiated' };
  const payPolicy = { observationLimit: 1, timeWindow: { value: 1, unit: 'hours' }, superpositionCount: 3 };
  const payId = await sdk.protect(paymentData, payPolicy);
  console.log('Payment protected dataId:', payId);

  // 4. Print blockchain audit logs for each step
  if (sdk['polygon']) {
    const fromTime = Math.floor(Date.now() / 1000) - 3600;
    const toTime = Math.floor(Date.now() / 1000) + 3600;
    const kycLog = await sdk['polygon'].getAuditLog(kycId, fromTime, toTime);
    const obLog = await sdk['polygon'].getAuditLog(obId, fromTime, toTime);
    const payLog = await sdk['polygon'].getAuditLog(payId, fromTime, toTime);
    console.log('KYC blockchain audit log:', kycLog);
    console.log('Open banking blockchain audit log:', obLog);
    console.log('Payment blockchain audit log:', payLog);
  }
} 