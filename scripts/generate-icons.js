const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const svgPath = path.join(__dirname, '../public/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate icon.png (512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '../public/icon.png'));
  console.log('✓ Generated icon.png (512x512)');

  // Generate apple-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/apple-icon.png'));
  console.log('✓ Generated apple-icon.png (180x180)');

  // Generate favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, '../public/favicon.ico'));
  console.log('✓ Generated favicon.ico (32x32)');

  // Generate opengraph-image.png (1200x630) with text
  const ogSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background gradient -->
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#DBEAFE;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#BFDBFE;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>

      <!-- Medicine bottle icon (left) -->
      <rect x="150" y="215" width="120" height="160" rx="12" fill="#3B82F6"/>
      <rect x="150" y="200" width="120" height="30" rx="6" fill="#2563EB"/>
      <!-- Medicine cross -->
      <rect x="195" y="270" width="30" height="70" rx="3" fill="white"/>
      <rect x="175" y="290" width="70" height="30" rx="3" fill="white"/>
      <!-- Measuring lines -->
      <rect x="165" y="250" width="20" height="2" fill="white" opacity="0.7"/>
      <rect x="165" y="265" width="20" height="2" fill="white" opacity="0.7"/>
      <rect x="165" y="280" width="20" height="2" fill="white" opacity="0.7"/>
      <rect x="165" y="295" width="20" height="2" fill="white" opacity="0.7"/>
      <rect x="165" y="310" width="20" height="2" fill="white" opacity="0.7"/>
      <rect x="165" y="325" width="20" height="2" fill="white" opacity="0.7"/>
      <rect x="165" y="340" width="20" height="2" fill="white" opacity="0.7"/>
      <rect x="165" y="355" width="20" height="2" fill="white" opacity="0.7"/>

      <!-- Calculator icon (right) -->
      <rect x="930" y="215" width="120" height="160" rx="12" fill="#3B82F6"/>
      <rect x="945" y="230" width="90" height="35" rx="4" fill="white"/>
      <rect x="945" y="275" width="40" height="30" rx="3" fill="white"/>
      <rect x="995" y="275" width="40" height="30" rx="3" fill="white"/>
      <rect x="945" y="315" width="40" height="30" rx="3" fill="white"/>
      <rect x="995" y="315" width="40" height="30" rx="3" fill="white"/>

      <!-- Main text (Korean) -->
      <text x="600" y="280" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700" fill="#1E40AF">어린이 해열제 복용량 계산기</text>

      <!-- Subtitle -->
      <text x="600" y="340" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="500" fill="#3B82F6">타이레놀 • 챔프 • 부루펜 • 맥시부펜</text>

      <!-- Bottom text -->
      <text x="600" y="410" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400" fill="#64748B">체중별 • 나이별 정확한 용량 즉시 계산</text>

      <!-- Safety badge -->
      <rect x="480" y="450" width="240" height="50" rx="25" fill="#10B981" opacity="0.15"/>
      <text x="600" y="480" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#059669">✓ 의사가 만든 안전한 계산기</text>

      <!-- Website URL -->
      <text x="600" y="560" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="400" fill="#94A3B8">antipyretic-dose.vercel.app</text>
    </svg>
  `;

  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(path.join(__dirname, '../public/opengraph-image.png'));
  console.log('✓ Generated opengraph-image.png (1200x630)');

  console.log('\n✨ All icons generated successfully!');
}

generateIcons().catch(console.error);