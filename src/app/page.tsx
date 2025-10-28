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
          소아 해열제 계산기
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          나이와 체중만 입력하면, 주요 해열제 4종의 용량을 바로 알려드려요.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          본 계산기는 정보 제공 목적으로만 사용되며, 전문적인 의학적 조언, 진단 또는 치료를 대체할 수 없습니다. 정확한 복용량은 반드시 의사 또는 약사와 상담하세요.
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
