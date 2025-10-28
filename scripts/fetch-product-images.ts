import fs from 'fs';
import path from 'path';
import products from '../data/products.json';
import { fetchEasyDrugList } from '../src/lib/easy-drug';

type ProductWithImage = {
  id: string;
  name: string;
  image_url: string | null;
  needs_manual_image: boolean;
};

async function fetchProductImages() {
  console.log('🔍 주요 제품 이미지 검색 시작...\n');

  const results: ProductWithImage[] = [];

  for (const product of products) {
    console.log(`📦 검색 중: ${product.name}`);

    try {
      // 제품명으로 API 검색
      const apiResponse = await fetchEasyDrugList({
        itemName: product.name,
        pageSize: 5
      });

      let imageUrl: string | null = null;

      // API 응답에서 이미지 찾기
      if (apiResponse.items && apiResponse.items.length > 0) {
        const firstItem = apiResponse.items[0];
        imageUrl = firstItem.itemImage || null;

        if (imageUrl) {
          console.log(`   ✅ 이미지 발견: ${imageUrl}`);
        } else {
          console.log(`   ⚠️  이미지 없음 - 수동 이미지 필요`);
        }
      } else {
        console.log(`   ⚠️  검색 결과 없음 - 수동 이미지 필요`);
      }

      results.push({
        id: product.id,
        name: product.name,
        image_url: imageUrl,
        needs_manual_image: !imageUrl,
      });

      // API 과부하 방지
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`   ❌ 오류: ${error}`);
      results.push({
        id: product.id,
        name: product.name,
        image_url: null,
        needs_manual_image: true,
      });
    }

    console.log('');
  }

  // 결과 요약
  console.log('\n📊 결과 요약:');
  console.log('─'.repeat(50));

  const withImages = results.filter((r) => r.image_url);
  const withoutImages = results.filter((r) => !r.image_url);

  console.log(`✅ API 이미지 있음: ${withImages.length}개`);
  withImages.forEach((r) => {
    console.log(`   - ${r.name}`);
  });

  console.log(`\n⚠️  수동 이미지 필요: ${withoutImages.length}개`);
  withoutImages.forEach((r) => {
    console.log(`   - ${r.name}`);
  });

  // 결과를 JSON 파일로 저장
  const outputPath = path.join(process.cwd(), 'data', 'product-images.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');

  console.log(`\n💾 결과 저장: ${outputPath}`);

  // 수동 이미지가 필요한 경우 안내
  if (withoutImages.length > 0) {
    console.log('\n📝 다음 단계:');
    console.log('1. public/images/products/ 폴더 생성');
    console.log('2. 다음 파일들을 준비하여 저장:');
    withoutImages.forEach((r) => {
      const filename = `${r.id}.jpg`;
      console.log(`   - ${filename} (${r.name})`);
    });
  }
}

fetchProductImages().catch(console.error);
