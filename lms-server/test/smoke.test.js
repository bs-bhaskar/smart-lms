const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const app = require('../app');
const User = require('../models/User');

function startTestServer() {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, () => {
      const { port } = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${port}`,
      });
    });
  });
}

test('POST /api/auth/login smoke test returns 404 for unknown user', async () => {
  const originalFindOne = User.findOne;
  User.findOne = async () => null;

  const { server, baseUrl } = await startTestServer();
  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@example.com', password: 'wrong' }),
    });

    assert.equal(response.status, 404);
    const data = await response.json();
    assert.equal(data.message, 'User not found');
  } finally {
    User.findOne = originalFindOne;
    server.close();
  }
});

test('GET /api/admin/teachers should fail without admin token', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const response = await fetch(`${baseUrl}/api/admin/teachers`);
    assert.equal(response.status, 401);
  } finally {
    server.close();
  }
});

test('GET /api/student/dashboard should fail without student token', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const response = await fetch(`${baseUrl}/api/student/dashboard`);
    assert.equal(response.status, 401);
  } finally {
    server.close();
  }
});

test('POST /api/auth/login should validate required credentials', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com' }),
    });

    assert.equal(response.status, 400);
  } finally {
    server.close();
  }
});

test('POST /api/auth/reset-password should validate required fields', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regNumber: '123456', otp: '123456' }),
    });

    assert.equal(response.status, 400);
  } finally {
    server.close();
  }
});
