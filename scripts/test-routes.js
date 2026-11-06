const routes = [
  '/',
  '/about-balochistan',
  '/cabinet',
  '/chief-minister',
  '/chief-ministers',
  '/complaint-cell',
  '/connect',
  '/history',
  '/news',
  '/gallery',
  '/priorities',
  '/admin',
  '/admin/login',
  '/privacy-policy',
  '/terms-of-use',
  '/accessibility',
  '/api/stats',
  '/images/cm-balochistan-banner.png',
  '/images/balochistan-logo.png',
  '/images/chief-minister-portrait.jpg'
];

async function testAll() {
  console.log('=== Testing All Website Routes on http://localhost:3000 ===\n');
  let passedCount = 0;
  for (const r of routes) {
    try {
      const res = await fetch('http://localhost:3000' + r);
      if (res.status === 200) {
        console.log(`[PASS 200 OK] : ${r}`);
        passedCount++;
      } else {
        console.log(`[FAIL ${res.status}] : ${r}`);
      }
    } catch (err) {
      console.log(`[ERROR]       : ${r} - ${err.message}`);
    }
  }
  console.log(`\nResult: ${passedCount} / ${routes.length} routes responding with HTTP 200 OK!`);
}

testAll();
