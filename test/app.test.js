const request = require('supertest');
const express = require('express');
const path = require('path');

// Mock the server setup
const app = express();
app.use(express.static(path.join(__dirname, '../public')));

// Define the tests
describe('Simple Node.js App', () => {
  test('GET / should return the HTML page', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('Hello, World!');
  });

  test('Static files should be served correctly', async () => {
    const response = await request(app).get('/style.css');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/css');
  });
});
