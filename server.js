const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;
const root = __dirname;
http.createServer((req, res) => {
  const route = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = route === '/' ? '/index.html' : route;
  const target = path.resolve(root, '.' + file);
  if (!target.startsWith(root + path.sep) && target !== path.join(root, 'index.html')) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(target, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const type = target.endsWith('.html') ? 'text/html; charset=utf-8' : target.endsWith('.js') ? 'text/javascript' : 'text/plain';
    res.writeHead(200, {'Content-Type': type, 'Cache-Control': 'no-store'}); res.end(data);
  });
}).listen(port, () => console.log(`Honor Flex demo at http://localhost:${port}`));
