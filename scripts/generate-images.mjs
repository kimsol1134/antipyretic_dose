import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Brand colors
const BLUE = '#1E40AF';
const RED = '#EF4444';
const WHITE = '#FFFFFF';

// OG Image SVG (1200x630)
const ogImageSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E40AF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E3A8A;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)"/>

  <!-- Decorative circles -->
  <circle cx="100" cy="530" r="200" fill="#2563EB" opacity="0.3"/>
  <circle cx="1100" cy="100" r="150" fill="#3B82F6" opacity="0.2"/>

  <!-- Thermometer icon (left side) -->
  <g transform="translate(120, 140)">
    <!-- Thermometer body -->
    <rect x="40" y="0" width="60" height="220" rx="30" fill="${WHITE}"/>
    <circle cx="70" cy="280" r="60" fill="${WHITE}"/>

    <!-- Thermometer mercury -->
    <rect x="55" y="100" width="30" height="120" fill="${RED}"/>
    <circle cx="70" cy="280" r="45" fill="${RED}"/>

    <!-- Tick marks -->
    <rect x="100" y="40" width="30" height="8" rx="4" fill="${WHITE}" opacity="0.8"/>
    <rect x="100" y="80" width="30" height="8" rx="4" fill="${WHITE}" opacity="0.8"/>
    <rect x="100" y="120" width="30" height="8" rx="4" fill="${WHITE}" opacity="0.8"/>
  </g>

  <!-- Pill/medicine icon (decorative) -->
  <g transform="translate(950, 400)">
    <ellipse cx="50" cy="30" rx="40" ry="25" fill="${WHITE}" opacity="0.2"/>
    <ellipse cx="130" cy="60" rx="35" ry="22" fill="${WHITE}" opacity="0.15"/>
  </g>

  <!-- Main title -->
  <text x="340" y="250" font-family="Arial, 'Noto Sans KR', sans-serif" font-size="72" font-weight="bold" fill="${WHITE}">
    어린이 해열제
  </text>
  <text x="340" y="340" font-family="Arial, 'Noto Sans KR', sans-serif" font-size="72" font-weight="bold" fill="${WHITE}">
    복용량 계산기
  </text>

  <!-- Subtitle -->
  <text x="340" y="420" font-family="Arial, 'Noto Sans KR', sans-serif" font-size="32" fill="${WHITE}" opacity="0.9">
    체중별 정확한 용량 즉시 계산
  </text>

  <!-- Brand tags -->
  <g transform="translate(340, 460)">
    <rect x="0" y="0" width="120" height="40" rx="20" fill="${WHITE}" opacity="0.2"/>
    <text x="60" y="27" font-family="Arial, sans-serif" font-size="18" fill="${WHITE}" text-anchor="middle">타이레놀</text>

    <rect x="140" y="0" width="90" height="40" rx="20" fill="${WHITE}" opacity="0.2"/>
    <text x="185" y="27" font-family="Arial, sans-serif" font-size="18" fill="${WHITE}" text-anchor="middle">챔프</text>

    <rect x="250" y="0" width="110" height="40" rx="20" fill="${WHITE}" opacity="0.2"/>
    <text x="305" y="27" font-family="Arial, sans-serif" font-size="18" fill="${WHITE}" text-anchor="middle">부루펜</text>
  </g>

  <!-- mL indicator -->
  <text x="1050" y="560" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="${WHITE}" opacity="0.6" text-anchor="middle">mL</text>
</svg>
`;

// Simple favicon SVG (works at 16x16)
const faviconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background - rounded square -->
  <rect width="512" height="512" rx="108" fill="${BLUE}"/>

  <!-- Simple thermometer - optimized for small sizes -->
  <!-- White stem -->
  <rect x="180" y="80" width="70" height="200" rx="35" fill="${WHITE}"/>
  <!-- White bulb -->
  <circle cx="215" cy="340" r="90" fill="${WHITE}"/>

  <!-- Red mercury -->
  <rect x="195" y="160" width="40" height="120" fill="${RED}"/>
  <circle cx="215" cy="340" r="70" fill="${RED}"/>

  <!-- Simple mL text on right -->
  <text x="370" y="320" font-family="Arial, Helvetica, sans-serif" font-size="120" font-weight="900" fill="${WHITE}" text-anchor="middle">mL</text>
</svg>
`;

// Even simpler favicon for very small sizes
const faviconSimpleSvg = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="32" height="32" rx="6" fill="${BLUE}"/>

  <!-- Very simple thermometer -->
  <rect x="8" y="5" width="6" height="14" rx="3" fill="${WHITE}"/>
  <circle cx="11" cy="23" r="6" fill="${WHITE}"/>
  <rect x="9" y="11" width="4" height="8" fill="${RED}"/>
  <circle cx="11" cy="23" r="4.5" fill="${RED}"/>

  <!-- mL -->
  <text x="23" y="22" font-family="Arial" font-size="8" font-weight="900" fill="${WHITE}" text-anchor="middle">mL</text>
</svg>
`;

async function generateImages() {
  console.log('Generating images...');

  // Generate OG image (1200x630)
  console.log('Creating OG image...');
  await sharp(Buffer.from(ogImageSvg))
    .png()
    .toFile(join(rootDir, 'public/opengraph-image.png'));

  // Copy to twitter-image
  await sharp(Buffer.from(ogImageSvg))
    .png()
    .toFile(join(rootDir, 'public/twitter-image.png'));

  console.log('OG images created.');

  // Generate favicon sizes
  console.log('Creating favicon...');

  // 512x512 icon.png (using detailed version)
  await sharp(Buffer.from(faviconSvg))
    .resize(512, 512)
    .png()
    .toFile(join(rootDir, 'src/app/icon.png'));

  await sharp(Buffer.from(faviconSvg))
    .resize(512, 512)
    .png()
    .toFile(join(rootDir, 'public/icon.png'));

  // 192x192 for PWA
  await sharp(Buffer.from(faviconSvg))
    .resize(192, 192)
    .png()
    .toFile(join(rootDir, 'public/icon-192.png'));

  // 180x180 for Apple
  await sharp(Buffer.from(faviconSvg))
    .resize(180, 180)
    .png()
    .toFile(join(rootDir, 'src/app/apple-icon.png'));

  await sharp(Buffer.from(faviconSvg))
    .resize(180, 180)
    .png()
    .toFile(join(rootDir, 'public/apple-icon.png'));

  // 32x32 favicon
  await sharp(Buffer.from(faviconSimpleSvg))
    .resize(32, 32)
    .png()
    .toFile(join(rootDir, 'public/favicon-32.png'));

  // 16x16 favicon
  await sharp(Buffer.from(faviconSimpleSvg))
    .resize(16, 16)
    .png()
    .toFile(join(rootDir, 'public/favicon-16.png'));

  // Generate ICO file (32x32 PNG converted, browsers handle it)
  await sharp(Buffer.from(faviconSimpleSvg))
    .resize(32, 32)
    .png()
    .toFile(join(rootDir, 'public/favicon.ico'));

  await sharp(Buffer.from(faviconSimpleSvg))
    .resize(32, 32)
    .png()
    .toFile(join(rootDir, 'src/app/favicon.ico'));

  // Save SVG
  writeFileSync(join(rootDir, 'public/icon.svg'), faviconSvg);

  console.log('All images generated successfully!');
}

generateImages().catch(console.error);
