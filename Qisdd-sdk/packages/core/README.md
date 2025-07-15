
# QISDD Core SDK

## Off-Chain Audit Trail (v1)

QISDD-SDK v1 provides a tamper-evident, off-chain audit trail for all sensitive operations (protect, observe, verify, erase, etc.).

- **Audit events** are logged in-memory or to an append-only file (configurable).
- **Each event** includes metadata (user, action, resource, result, context, etc.) and is hash-chained for tamper evidence.
- **Query audit logs** using `getAuditTrail(filter)` from the SDK or via the REST API.
- **Export logs** in JSON or CSV for compliance.
- **No blockchain dependency** in v1; blockchain audit is planned for v2.

### Example
```typescript
const auditTrail = sdk.getAuditTrail({ resourceId: 'data_xxx' });
console.log(auditTrail);
```

See the API and demo app for more details. 