# QISDD-SDK Blockchain API

## Smart Contracts

### AccessControl
- Manages data access policies and logs access attempts on-chain.
- Emits events for policy creation, access attempts, and policy violations (e.g., threshold exceeded).

**Key Functions:**
- `createPolicy(dataId, observationLimit, timeWindow, alertThreshold, allowedCallers[])`
- `recordAccess(dataId, requester, authorized, contextHash)`

### AuditTrail
- Stores tamper-evident audit logs for protected data.
- Only authorized loggers can add entries.
- Supports querying logs by dataId and time range.

**Key Functions:**
- `addLogEntry(dataId, eventType, dataHash, metadata)`
- `getAuditLog(dataId, fromTime, toTime)`

## PolygonService (SDK)

The `PolygonService` class in the SDK provides methods to deploy and interact with these contracts on Polygon:

```typescript
import { PolygonService } from '@qisdd/blockchain';

const polygon = new PolygonService({
  rpcUrl: 'https://rpc-mumbai.maticvigil.com',
  privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY,
  accessControlAddress: '0x...',
  auditTrailAddress: '0x...'
});

// Log an access attempt
await polygon.logAccess(
  '0xDATAID',
  '0xREQUESTER',
  true, // authorized
  '0xCONTEXTHASH'
);

// Log an audit event
await polygon.logAudit(
  '0xDATAID',
  'access_authorized',
  '0xDATAHASH',
  '0xMETADATA'
);
```

## Example Usage in API

When a data access or policy event occurs, the API can log it to the blockchain:

```typescript
// In your API route handler
await polygon.logAccess(dataId, requester, authorized, contextHash);
await polygon.logAudit(dataId, 'access_authorized', dataHash, metadata);
```

See the contract source for full details and event structures. 