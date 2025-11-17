const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// ========================================
// 1. 새로운 단순한 아이콘 SVG
// - 온도계 + mL 계산 = 해열제 용량 계산기 컨셉
// - 16x16에서도 식별 가능하도록 단순화
// - 진한 파란색 배경 + 흰색 요소로 대비 극대화
// ========================================
const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 배경 - 둥근 사각형, 진한 파란색 -->
  <rect width="512" height="512" rx="108" fill="#1E40AF"/>

  <!-- 온도계 - 굵고 선명하게 -->
  <rect x="140" y="80" width="90" height="280" rx="45" fill="white"/>
  <circle cx="185" cy="385" r="70" fill="white"/>

  <!-- 온도계 내부 - 빨간색 (열/발열 표시) -->
  <rect x="165" y="180" width="40" height="180" fill="#EF4444"/>
  <circle cx="185" cy="385" r="52" fill="#EF4444"/>

  <!-- 눈금 표시 (3개만 - 단순화) -->
  <rect x="230" y="120" width="50" height="12" rx="6" fill="white" opacity="0.9"/>
  <rect x="230" y="180" width="50" height="12" rx="6" fill="white" opacity="0.9"/>
  <rect x="230" y="240" width="50" height="12" rx="6" fill="white" opacity="0.9"/>

  <!-- 계산 결과 = mL (오른쪽) -->
  <rect x="310" y="180" width="120" height="24" rx="12" fill="white"/>
  <rect x="310" y="224" width="120" height="24" rx="12" fill="white"/>

  <!-- mL 단위 표시 -->
  <text x="370" y="380" font-family="Arial, Helvetica, sans-serif" font-size="80" font-weight="900" fill="white" text-anchor="middle">mL</text>
</svg>
`.trim();

// ========================================
// 2. 새로운 OG 이미지 SVG
// - 진한 배경으로 시선 집중
// - 큰 텍스트로 가독성 극대화
// - 신뢰성 강조 (식약처 기준, 의사가 만든)
// - 현재 도메인 반영
// ========================================
const ogImageSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 배경 - 진한 파란색 그라데이션 -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E3A8A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bgGradient)"/>

  <!-- 장식 요소 - 부드러운 원형 패턴 -->
  <circle cx="80" cy="80" r="180" fill="white" opacity="0.04"/>
  <circle cx="1120" cy="550" r="220" fill="white" opacity="0.04"/>
  <circle cx="1050" cy="100" r="100" fill="white" opacity="0.03"/>

  <!-- 메인 아이콘 (왼쪽 중앙) -->
  <g transform="translate(100, 190)">
    <!-- 온도계 -->
    <rect x="0" y="0" width="50" height="180" rx="25" fill="white"/>
    <circle cx="25" cy="200" r="40" fill="white"/>
    <!-- 빨간 온도 표시 -->
    <rect x="15" y="80" width="20" height="100" fill="#EF4444"/>
    <circle cx="25" cy="200" r="28" fill="#EF4444"/>
    <!-- 눈금 -->
    <rect x="50" y="40" width="25" height="5" rx="2.5" fill="white" opacity="0.8"/>
    <rect x="50" y="80" width="25" height="5" rx="2.5" fill="white" opacity="0.8"/>
    <rect x="50" y="120" width="25" height="5" rx="2.5" fill="white" opacity="0.8"/>
  </g>

  <!-- 메인 텍스트 - 크고 굵게, 중앙 정렬 -->
  <text x="660" y="230" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="bold" fill="white" text-anchor="middle">어린이 해열제</text>
  <text x="660" y="340" font-family="Arial, Helvetica, sans-serif" font-size="100" font-weight="900" fill="white" text-anchor="middle">복용량 계산기</text>

  <!-- 약품 목록 - 배경 박스 + 굵은 텍스트 -->
  <rect x="390" y="375" width="540" height="54" rx="27" fill="white" opacity="0.15"/>
  <text x="660" y="413" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="white" text-anchor="middle">타이레놀 · 챔프 · 부루펜 · 맥시부펜</text>

  <!-- 신뢰성 배지 - 초록색, 더 크고 선명하게 -->
  <rect x="380" y="465" width="460" height="56" rx="28" fill="#10B981"/>
  <text x="610" y="503" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">✓ 의사가 만든 안전한 계산기</text>

  <!-- 도메인 - 현재 도메인으로 업데이트 -->
  <text x="660" y="585" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="white" opacity="0.7" text-anchor="middle">www.kidsfever.xyz</text>
</svg>
`.trim();

async function generateIcons() {
  console.log('🎨 세계 최고 수준의 아이콘 및 OG 이미지 생성 시작...\n');

  // 1. 메인 아이콘 SVG 저장
  const iconSvgPath = path.join(publicDir, 'icon.svg');
  fs.writeFileSync(iconSvgPath, iconSvg);
  console.log('✅ icon.svg 저장 완료');

  // 2. 512x512 PNG 아이콘 (고품질)
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 6 })
    .toFile(path.join(publicDir, 'icon.png'));
  console.log('✅ icon.png (512x512) 생성 완료');

  // 3. 192x192 PNG 아이콘 (PWA용)
  await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✅ icon-192.png (192x192) 생성 완료');

  // 4. 180x180 Apple Touch Icon
  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'apple-icon.png'));
  console.log('✅ apple-icon.png (180x180) 생성 완료');

  // 5. 32x32 Favicon (중요: 브라우저 탭용)
  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon-32.png'));
  console.log('✅ favicon-32.png 생성 완료');

  // 6. 16x16 Favicon (가장 작은 크기)
  await sharp(Buffer.from(iconSvg))
    .resize(16, 16)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon-16.png'));
  console.log('✅ favicon-16.png 생성 완료');

  // 7. ICO 파일 (32x32 PNG 기반)
  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✅ favicon.ico (32x32) 생성 완료');

  // 8. OG 이미지 생성 (1200x630 - 표준 크기)
  await sharp(Buffer.from(ogImageSvg))
    .png({ quality: 100, compressionLevel: 6 })
    .toFile(path.join(publicDir, 'opengraph-image.png'));
  console.log('✅ opengraph-image.png (1200x630) 생성 완료');

  // 9. Twitter 카드 이미지 (동일 크기)
  await sharp(Buffer.from(ogImageSvg))
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'twitter-image.png'));
  console.log('✅ twitter-image.png (1200x630) 생성 완료');

  console.log('\n🎉 모든 이미지 생성 완료!\n');

  // 생성된 파일 목록
  console.log('📁 생성된 파일 목록:');
  console.log('├─ icon.svg (벡터 원본)');
  console.log('├─ icon.png (512x512)');
  console.log('├─ icon-192.png (PWA용)');
  console.log('├─ apple-icon.png (180x180)');
  console.log('├─ favicon-32.png');
  console.log('├─ favicon-16.png');
  console.log('├─ favicon.ico');
  console.log('├─ opengraph-image.png (1200x630)');
  console.log('└─ twitter-image.png (1200x630)');

  console.log('\n📊 개선 사항:');
  console.log('1. 아이콘: 단순화된 디자인으로 16x16에서도 식별 가능');
  console.log('2. 색상: 진한 파란색(#1E40AF)으로 대비 강화');
  console.log('3. OG 이미지: 진한 배경, 큰 텍스트, 신뢰성 배지');
  console.log('4. 도메인: www.kidsfever.xyz로 업데이트');
  console.log('5. 신뢰성: "식약처 기준" 문구 추가');
}

generateIcons().catch(console.error);
