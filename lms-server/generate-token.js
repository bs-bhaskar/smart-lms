const fs = require('fs');
const http = require('http');
const url = require('url');
const { google } = require('googleapis');

const credentials = JSON.parse(
  fs.readFileSync('./google-credentials.json', 'utf8')
);

const config = credentials.web || credentials.installed;

const oauth2Client = new google.auth.OAuth2(
  config.client_id,
  config.client_secret,
  'http://localhost:5000/api/email/oauth2/callback'
);

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES,
});

console.log('\n========================================');
console.log('Open this URL in your browser:');
console.log('========================================\n');
console.log(authUrl);
console.log('\n========================================\n');

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname !== '/api/email/oauth2/callback') {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const code = parsedUrl.query.code;

  if (!code) {
    res.writeHead(400);
    res.end('Authorization code missing');
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log('\n========================================');
    console.log('SUCCESS! Gmail OAuth completed.');
    console.log('========================================\n');

    console.log('REFRESH TOKEN:');
    console.log(tokens.refresh_token);

    console.log('\n========================================');
    console.log('Copy the refresh token safely.');
    console.log('Do NOT share it with anyone.');
    console.log('========================================\n');

    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    res.end(`
      <h2>Gmail authorization successful! ✅</h2>
      <p>You can close this window and return to the terminal.</p>
    `);

    setTimeout(() => {
      server.close();
    }, 1000);

  } catch (error) {
    console.error('❌ OAuth Error:', error.message);

    res.writeHead(500);
    res.end('OAuth failed. Check terminal.');

    server.close();
  }
});

server.listen(5000, () => {
  console.log('OAuth callback server running on http://localhost:5000');
});