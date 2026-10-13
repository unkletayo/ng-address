import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { NipostProvider } from '@ng-address/nipost';

describe('Express Address Reference API', () => {
  const mockProvider = {
    resolvePostcode: vi.fn().mockResolvedValue({
      status: 'EXACT',
      provider: 'nipost',
      address: {
        raw: 'Plot 10 Admiralty Way, Lekki Phase 1, Lagos',
        postcode: 'LA-10-A01-LK-02',
        administrative: {
          state: 'Lagos',
          stateCode: 'LA',
          lga: 'Eti Osa'
        }
      }
    })
  } as unknown as NipostProvider;

  const app = createApp({ nipostProvider: mockProvider });

  it('GET /healthz returns ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/v1/taxonomy/states returns all 37 Nigerian states', async () => {
    const res = await request(app).get('/api/v1/taxonomy/states');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(37);
  });

  it('GET /api/v1/taxonomy/states?zone=South%20West filters by zone', async () => {
    const res = await request(app).get('/api/v1/taxonomy/states?zone=South%20West');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(6);
  });

  it('GET /api/v1/taxonomy/states/Lagos/lgas returns official LGAs', async () => {
    const res = await request(app).get('/api/v1/taxonomy/states/Lagos/lgas');
    expect(res.status).toBe(200);
    expect(res.body.state).toBe('Lagos');
    expect(res.body.lgas).toContain('Ikeja');
    expect(res.body.lgas).toContain('Eti Osa');
  });

  it('POST /api/v1/address/normalize standardizes free-text address', async () => {
    const res = await request(app)
      .post('/api/v1/address/normalize')
      .send({ address: 'Plot 4, Admiralty Way, Lekki Phase 1, Eti Osa, Lagos State, 105102' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.administrative.state).toBe('Lagos');
    expect(res.body.data.administrative.lga).toBe('Eti Osa');
  });

  it('POST /api/v1/address/validate performs offline syntax validation', async () => {
    const res = await request(app)
      .post('/api/v1/address/validate')
      .send({ input: 'LA-11-W06-TC-10' });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.details.isPostcode).toBe(true);
  });

  it('POST /api/v1/address/lookup resolves digital postcode via provider proxy', async () => {
    const res = await request(app)
      .post('/api/v1/address/lookup')
      .send({ postcode: 'LA-10-A01-LK-02' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.address.administrative.state).toBe('Lagos');
  });
});
