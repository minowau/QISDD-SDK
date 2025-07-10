import request from 'supertest';
import express from 'express';
import routes from '../../apps/demo-api/src/routes';

describe('QISDD Demo API E2E', () => {
  const app = express();
  app.use(express.json());
  app.use('/api', routes);
  let dataId: string;
  let computeResultId: string;

  it('should create protected data', async () => {
    const res = await request(app)
      .post('/api/protect')
      .send({
        data: { account: '123456', balance: 50000 },
        policy: { observationLimit: 2, timeWindow: { value: 24, unit: 'hours' }, superpositionCount: 3 },
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    dataId = res.body.data.id;
  });

  it('should allow authorized access to protected data', async () => {
    const res = await request(app)
      .get(`/api/data/${dataId}`)
      .set('X-API-Key', 'valid-key')
      .set('X-Purpose', 'test');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.account).toBe('123456');
  });

  it('should return poisoned data on unauthorized access', async () => {
    // Simulate low trust by using local IP
    const res = await request(app)
      .get(`/api/data/${dataId}`)
      .set('X-API-Key', 'invalid-key')
      .set('X-Forwarded-For', '127.0.0.1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.data.poisoned).toBe(true);
    expect(res.body.warning).toBe('Poisoned');
  });

  it('should collapse data after repeated unauthorized access', async () => {
    // Exceed threshold for collapse
    await request(app)
      .get(`/api/data/${dataId}`)
      .set('X-API-Key', 'invalid-key')
      .set('X-Forwarded-For', '127.0.0.1');
    const res = await request(app)
      .get(`/api/data/${dataId}`)
      .set('X-API-Key', 'invalid-key')
      .set('X-Forwarded-For', '127.0.0.1');
    expect(res.status).toBe(410);
    expect(res.body.error).toBe('DATA_COLLAPSED');
  });

  it('should verify a property with ZKP', async () => {
    const res = await request(app)
      .post('/api/verify')
      .send({ data_id: dataId, property: 'balance_gte', value: 1000 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.verification.valid).toBeDefined();
  });

  it('should return a mock audit log', async () => {
    const res = await request(app)
      .get(`/api/audit/${dataId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.audit_trail.data_id).toBe(dataId);
    expect(Array.isArray(res.body.audit_trail.events)).toBe(true);
  });

  it('should perform homomorphic computation (add) on protected data', async () => {
    // Create a second data record for computation
    const res2 = await request(app)
      .post('/api/protect')
      .send({
        data: { account: '654321', balance: 25000 },
        policy: { observationLimit: 2, timeWindow: { value: 24, unit: 'hours' }, superpositionCount: 3 },
      });
    expect(res2.status).toBe(201);
    const dataId2 = res2.body.data.id;
    const res = await request(app)
      .post('/api/compute')
      .send({ operation: 'add', data_ids: [dataId, dataId2], parameters: { field: 'balance' } });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.data_id).toMatch(/^data_result_/);
    computeResultId = res.body.result.data_id;
  });

  it('should update access policy for protected data', async () => {
    const res = await request(app)
      .patch(`/api/data/${dataId}/policy`)
      .send({ updates: { observationLimit: 10, alertThreshold: 5 }, reason: 'Increase access limits' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data_id).toBe(dataId);
    expect(res.body.updates.observationLimit).toBe(10);
  });

  it('should erase (collapse) protected data', async () => {
    const res = await request(app)
      .delete(`/api/data/${dataId}`)
      .send({ verification_token: 'token', reason: 'gdpr_request', options: { preserve_audit_log: true } });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.erasure.data_id).toBe(dataId);
    expect(res.body.erasure.status).toBe('collapsed');
  });

  it('should return error when erasing non-existent data', async () => {
    const res = await request(app)
      .delete('/api/data/nonexistent')
      .send({ verification_token: 'token', reason: 'gdpr_request', options: { preserve_audit_log: true } });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Data not found');
  });
}); 