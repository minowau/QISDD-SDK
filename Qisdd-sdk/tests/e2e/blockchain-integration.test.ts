import { PolygonService } from '@qisdd/blockchain';

describe('PolygonService Blockchain Integration', () => {
  const config = {
    rpcUrl: process.env.POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
    privateKey: process.env.POLYGON_PRIVATE_KEY || '',
  };
  let polygon: PolygonService;
  let accessControlAddress: string;
  let auditTrailAddress: string;

  beforeAll(async () => {
    if (!config.privateKey || config.privateKey.length < 64) {
      console.warn('Skipping blockchain integration tests: missing private key');
      return;
    }
    polygon = new PolygonService(config);
    const deployed = await polygon.deployContracts();
    accessControlAddress = deployed.accessControl;
    auditTrailAddress = deployed.auditTrail;
    expect(accessControlAddress).toMatch(/^0x/);
    expect(auditTrailAddress).toMatch(/^0x/);
  });

  it('should log an access attempt on-chain', async () => {
    if (!polygon) return;
    const dataId = '0x' + '01'.repeat(32);
    const requester = '0x' + '02'.repeat(20);
    const contextHash = '0x' + '03'.repeat(32);
    const tx = await polygon.logAccess(dataId, requester, true, contextHash);
    expect(tx.hash).toMatch(/^0x/);
  });

  it('should log an audit event on-chain', async () => {
    if (!polygon) return;
    const dataId = '0x' + '01'.repeat(32);
    const eventType = 'access_authorized';
    const dataHash = '0x' + '04'.repeat(32);
    const metadata = '0x';
    const tx = await polygon.logAudit(dataId, eventType, dataHash, metadata);
    expect(tx.hash).toMatch(/^0x/);
  });

  it('should retrieve audit log from chain', async () => {
    if (!polygon) return;
    const dataId = '0x' + '01'.repeat(32);
    const fromTime = Math.floor(Date.now() / 1000) - 3600;
    const toTime = Math.floor(Date.now() / 1000) + 3600;
    const log = await polygon.getAuditLog(dataId, fromTime, toTime);
    expect(Array.isArray(log)).toBe(true);
  });
}); 