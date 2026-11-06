async function check() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();
  const cssMatches = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)];
  console.log('CSS links found:', cssMatches.map(m => m[1]));
  for (const m of cssMatches) {
    const cssRes = await fetch('http://localhost:3000' + m[1]);
    const css = await cssRes.text();
    console.log(`\nFile: ${m[1]} (${css.length} bytes)`);
    console.log('Includes priorities-marquee-scroll:', css.includes('priorities-marquee-scroll'));
    console.log('Includes priorities-slide-track:', css.includes('priorities-slide-track'));
    console.log('Includes priority-flip-card:', css.includes('priority-flip-card'));
    console.log('Includes priority-flip-card-inner:', css.includes('priority-flip-card-inner'));
  }
}
check();
