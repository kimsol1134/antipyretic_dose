import fs from 'fs/promises';
import path from 'path';
import { productsSchema } from '@/lib/schemas';
import type { Product, SimilarProductsMap } from '@/lib/types';
import DosageForm from './components/DosageForm';
import DosageResultDisplay from './components/DosageResultDisplay';

async function getValidatedProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'data', 'products.json');

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    const validatedProducts = productsSchema.parse(jsonData);
    return validatedProducts;
  } catch (error) {
    console.error('======= [빌드 실패] products.json 데이터 검증 실패 =======');
    console.error(error);
    throw new Error('products.json 데이터 로드 또는 검증에 실패했습니다.');
  }
}

async function getSimilarProducts(): Promise<SimilarProductsMap> {
  const filePath = path.join(process.cwd(), 'data', 'similar-products.json');

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    return jsonData as SimilarProductsMap;
  } catch (error) {
    console.warn('유사 약품 데이터를 불러올 수 없습니다. 빈 데이터를 사용합니다.');
    console.warn(error);
    return {};
  }
}

export default async function HomePage() {
  const products = await getValidatedProducts();
  const similarProducts = await getSimilarProducts();

  return (
    <main className="container mx-auto max-w-lg p-4 pt-8 sm:pt-12">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          우리 아이 해열제<br/>얼마나 먹이면 될까요?
        </h1>
        <p className="mt-3 text-base text-gray-600">
          체중과 나이만 입력하면<br/>
          <span className="font-semibold text-blue-600">타이레놀·챔프·부루펜·맥시부펜</span> 정확한 복용량을 알려드려요
        </p>
        <p className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          ⚠️ 이 계산기는 참고용입니다. 실제 투약 전 반드시 의사·약사와 상담하세요.
        </p>
      </header>

      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
        <DosageForm products={products} />
      </section>

      <DosageResultDisplay similarProductsMap={similarProducts} />

      <footer className="mt-12 text-center text-xs text-gray-500 space-y-2">
        <p>출처: 식품의약품안전처_의약품개요정보(e약은요) (2025-10-27 검토)</p>
      </footer>
    </main>
  );
}
