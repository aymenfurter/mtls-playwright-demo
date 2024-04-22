const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from mTLS protected API!' });
});

const options = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt'),
  ca: fs.readFileSync('./certs/ca.crt'),
  requestCert: true,
  rejectUnauthorized: true
};

https.createServer(options, app).listen(3000, () => {
  console.log('mTLS protected API server running on port 3000');
});
