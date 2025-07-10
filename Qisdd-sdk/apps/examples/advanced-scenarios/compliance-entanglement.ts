import { QISDDClient } from '@qisdd/sdk';
import { Entanglement } from '@qisdd/core/src/quantum/entanglement';

export async function runComplianceEntanglementExample() {
  // 1. Create SDK client with blockchain enabled
  const sdk = new QISDDClient({
    blockchain: {
      rpcUrl: process.env.POLYGON_RPC_URL,
      privateKey: process.env.POLYGON_PRIVATE_KEY,
      accessControlAddress: process.env.ACCESS_CONTROL_ADDRESS,
      auditTrailAddress: process.env.AUDIT_TRAIL_ADDRESS,
    },
  });

  // 2. Protect two entangled data records
  const policy = { observationLimit: 3, timeWindow: { value: 24, unit: 'hours' }, superpositionCount: 3 };
  const customer = { id: 'cust_1', name: 'Alice', balance: 10000 };
  const transaction = { id: 'tx_1', customerId: 'cust_1', amount: 1000 };
  const customerId = await sdk.protect(customer, policy);
  const transactionId = await sdk.protect(transaction, policy);
  console.log('Customer dataId:', customerId);
  console.log('Transaction dataId:', transactionId);

  // 3. Entangle the two records (simulate)
  const entanglement = new Entanglement();
  entanglement.addLink({ targetId: transactionId, strength: 1.0, type: 'symmetric', createdAt: new Date() });
  entanglement.addLink({ targetId: customerId, strength: 1.0, type: 'symmetric', createdAt: new Date() });

  // 4. Erase (GDPR) the customer record, cascade to entangled transaction
  const erasureResult = await sdk.erase(customerId, { reason: 'gdpr_request', cascade: true });
  console.log('Customer erasure result:', erasureResult);
  // Simulate cascade: erase entangled transaction
  const cascadeResult = await sdk.erase(transactionId, { reason: 'entanglement_cascade', cascade: false });
  console.log('Entangled transaction erasure result:', cascadeResult);

  // 5. Print blockchain audit logs for both
  if (sdk['polygon']) {
    const fromTime = Math.floor(Date.now() / 1000) - 3600;
    const toTime = Math.floor(Date.now() / 1000) + 3600;
    const log1 = await sdk['polygon'].getAuditLog(customerId, fromTime, toTime);
    const log2 = await sdk['polygon'].getAuditLog(transactionId, fromTime, toTime);
    console.log('Customer blockchain audit log:', log1);
    console.log('Transaction blockchain audit log:', log2);
  }
} 