const request = require('supertest');
const { app } = require('../src/app');

describe('Backend Baseline API', () => {
  describe('GET /api/health', () => {
    it('returns service health metadata', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'backend');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/project', () => {
    it('returns capstone baseline guidance', async () => {
      const response = await request(app).get('/api/project');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('nextStep');
    });
  });
});
