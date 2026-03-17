#!/bin/bash
# Cocoon dev server — starts Next.js + TinaCMS + LAN proxy
# Usage: ./dev.sh

set -e

NEXT_PORT=3002
TINA_PORT=4001
PROXY_PORT=4101
LAN_IP=$(hostname -I | awk '{print $1}')

echo "🧹 Cleaning up old processes..."
for PORT in $NEXT_PORT $TINA_PORT $PROXY_PORT; do
  lsof -ti:$PORT 2>/dev/null | xargs kill 2>/dev/null || fuser -k $PORT/tcp 2>/dev/null || true
done
sleep 1

# Start LAN proxy (4101 → 4001) so remote machines can reach Tina
echo "🔌 Starting Tina LAN proxy ($LAN_IP:$PROXY_PORT → localhost:$TINA_PORT)..."
node -e "
const http = require('http');
http.createServer((req, res) => {
  const opts = { hostname: '127.0.0.1', port: $TINA_PORT, path: req.url, method: req.method, headers: { ...req.headers, host: 'localhost:$TINA_PORT' } };
  const proxy = http.request(opts, (pRes) => {
    res.writeHead(pRes.statusCode, { ...pRes.headers, 'access-control-allow-origin': '*', 'access-control-allow-methods': '*', 'access-control-allow-headers': '*' });
    pRes.pipe(res);
  });
  proxy.on('error', (e) => { res.writeHead(502); res.end('Proxy error: ' + e.message); });
  req.pipe(proxy);
}).listen($PROXY_PORT, '0.0.0.0', () => console.log('✅ Tina proxy ready'));
" &
PROXY_PID=$!

# Patch admin HTML after Tina generates it (runs in background, waits for file)
# Patch loop: keep checking until Tina files are patched (runs entire time dev is up)
(
  while true; do
    sleep 3
    PATCHED=0
    # Patch admin HTML
    if [ -f public/admin/index.html ] && grep -q "localhost:$TINA_PORT" public/admin/index.html 2>/dev/null; then
      sed -i "s|http://localhost:$TINA_PORT|http://$LAN_IP:$PROXY_PORT|g" public/admin/index.html
      echo "✅ Admin HTML patched for LAN access ($LAN_IP:$PROXY_PORT)"
      PATCHED=1
    fi
    # Inject custom CSS to hide hydration flash
    if [ -f public/admin/index.html ] && ! grep -q "custom.css" public/admin/index.html 2>/dev/null; then
      sed -i 's|</head>|<link rel="stylesheet" href="/admin/custom.css" /></head>|' public/admin/index.html
      echo "✅ Admin CSS injected"
      PATCHED=1
    fi
    [ $PATCHED -eq 1 ] && echo "✅ Tina files patched"
  done
) &

# Start TinaCMS + Next.js
echo "🚀 Starting TinaCMS + Next.js..."
TINA_PUBLIC_IS_LOCAL=true \
NEXT_PUBLIC_TINA_API_URL="http://$LAN_IP:$PROXY_PORT/graphql" \
npx tinacms dev -c "next dev --hostname 0.0.0.0 --port $NEXT_PORT" --port $TINA_PORT
