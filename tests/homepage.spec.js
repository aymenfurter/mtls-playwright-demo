const { test, expect } = require('@playwright/test');
const fs = require('fs');
const https = require('https');

test('Homepage should fetch data from mTLS protected API', async ({ page, context }) => {
  await context.route('**', (route, request) => {
    const url = new URL(request.url());
    if (url.hostname !== 'localhost' || url.port !== '3000') {
      route.continue();
      return;
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: request.method(),
      headers: request.headers(),
      ca: fs.readFileSync('./certs/ca.crt'),
      key: fs.readFileSync('./certs/client.key'),  
      cert: fs.readFileSync('./certs/client.crt'),
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        route.fulfill({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (error) => {
      console.error(error);
      route.abort();  
    });
    
    req.end();
  });

  await page.goto('http://127.0.0.1:8070');
  await page.click('#fetch-data');
  await expect(page.locator('#result')).toHaveText('Hello from mTLS protected API!');
  console.log(await page.content());
});

