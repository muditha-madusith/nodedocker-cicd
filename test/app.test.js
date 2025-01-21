const request = require('supertest');
const app = require('../index'); 

describe('Node.js App Endpoints', () => {
  it('GET / should return "Hello, World!"', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });

  it('GET /hello should return "Hello, From hello route!"', async () => {
    const response = await request(app).get('/hello');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello, From hello route!');
  });
});
