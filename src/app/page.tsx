import fs from 'fs/promises';
import path from 'path';
import Image from 'next/image';
import { productsSchema } from '@/lib/schemas';
import type { Product, SimilarProductsMap } from '@/lib/types';
import DosageForm from './components/DosageForm';
import DosageResultDisplay from './components/DosageResultDisplay';
import CoupangBanner from './components/ads/CoupangBanner';

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

      {/* ✅ 배너: 계산 폼과 결과 사이에 배치 */}
      <CoupangBanner />

      <DosageResultDisplay similarProductsMap={similarProducts} />

      <footer className="mt-12 text-center text-xs text-gray-500 space-y-3">
        {/* 출처 정보 */}
        <p>출처: 식품의약품안전처_의약품개요정보(e약은요) (2025-10-27 검토)</p>

        {/* 제작자 정보 (E-A-T) */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-600">
              제작자:{' '}
              <a
                href="https://litt.ly/solkim"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                aria-label="pinecone 프로필"
              >
                pinecone
              </a>
            </p>
            <a
              href="https://litt.ly/solkim"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="제작자 프로필"
            >
              <Image
                src="/images/profile.png"
                alt="pinecone 프로필"
                width={32}
                height={32}
                className="rounded-full hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
        </div>

        {/* 유용한 정보 */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-gray-600 font-semibold mb-2">📖 유용한 정보</p>
          <div className="space-y-1 text-gray-600">
            <p>
              <a
                href="https://blog.naver.com/kimsol1015/224054587927"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                • 아이 열날 때 해열제, 언제 먹여야 할까?
              </a>
            </p>
            <p>
              <a
                href="https://blog.naver.com/kimsol1015"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                • 더 많은 육아 건강 정보 보기
              </a>
            </p>
          </div>
        </div>

        {/* 쿠팡 파트너스 고지 */}
        <p className="text-gray-400 pt-3">
          이 사이트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </footer>
    </main>
  );
}
