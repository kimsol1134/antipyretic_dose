import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnvConfig } from '@next/env';
import { productsSchema } from '../src/lib/schemas.js';
import { fetchEasyDrugList, filterSimilarItems, type EasyDrugItem } from '../src/lib/easy-drug.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env files
const projectDir = path.join(__dirname, '..');
loadEnvConfig(projectDir);

type SimilarProductsData = Record<string, EasyDrugItem[]>;

async function main() {
  console.log('🚀 유사 약품 데이터 수집 시작...\n');

  // 1. products.json 읽기
  const productsPath = path.join(__dirname, '../data/products.json');
  const productsJson = await fs.readFile(productsPath, 'utf-8');
  const products = productsSchema.parse(JSON.parse(productsJson));

  console.log(`✅ ${products.length}개의 제품 데이터 로드 완료\n`);

  // 2. 각 제품에 대해 유사 약품 조회
  const similarProductsData: SimilarProductsData = {};

  for (const product of products) {
    console.log(`📋 [${product.name}] 유사 약품 검색 중...`);
    console.log(`   성분: ${product.ingredient}`);
    console.log(`   농도: ${product.strength_mg_per_ml} mg/mL`);

    try {
      // API 호출
      const apiResponse = await fetchEasyDrugList({
        ingredient: product.ingredient,
        pageSize: 100,
      });

      console.log(`   API 응답: ${apiResponse.items.length}개 항목`);

      // 필터링 (어린이용 약품만, 같은 농도)
      const filtered = filterSimilarItems(apiResponse.items, {
        ingredient: product.ingredient,
        strengthMgPerMl: product.strength_mg_per_ml,
        tolerance: 0.5,  // 반올림 오차 허용
        childrenOnly: true,  // 어린이용 약품만
      });

      console.log(`   필터링 상세:`);
      console.log(`     - 어린이용 필터 적용`);
      console.log(`     - 농도 필터: ${product.strength_mg_per_ml} ± 0.5 mg/mL`);

      console.log(`   필터링 후: ${filtered.length}개 항목`);

      // 상위 5개만 저장
      similarProductsData[product.id] = filtered.slice(0, 5);

      console.log(`   ✅ 완료: ${similarProductsData[product.id].length}개 항목 저장\n`);

      // API rate limit 방지를 위한 대기
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`   ❌ 오류: ${error instanceof Error ? error.message : String(error)}\n`);
      similarProductsData[product.id] = [];
    }
  }

  // 3. 결과를 JSON 파일로 저장
  const outputPath = path.join(__dirname, '../data/similar-products.json');
  await fs.writeFile(
    outputPath,
    JSON.stringify(similarProductsData, null, 2),
    'utf-8'
  );

  console.log('✅ 유사 약품 데이터 저장 완료!');
  console.log(`📁 저장 위치: ${outputPath}`);
  console.log('\n📊 수집 결과:');
  for (const [productId, items] of Object.entries(similarProductsData)) {
    console.log(`   ${productId}: ${items.length}개 항목`);
  }
}

main().catch((error) => {
  console.error('❌ 스크립트 실행 실패:', error);
  process.exit(1);
});
