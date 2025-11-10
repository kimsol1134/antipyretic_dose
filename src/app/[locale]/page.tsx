import fs from 'fs/promises';
import path from 'path';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { productsSchema } from '@/lib/schemas';
import type { Product, SimilarProductsMap } from '@/lib/types';
import DosageForm from '../components/DosageForm';
import DosageResultDisplay from '../components/DosageResultDisplay';
import CoupangBanner from '../components/ads/CoupangBanner';

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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tFaq = await getTranslations('faq');
  const tFooter = await getTranslations('footer');

  const products = await getValidatedProducts();
  const similarProducts = await getSimilarProducts();

  return (
    <main className="container mx-auto max-w-lg p-4 pt-8 sm:pt-12">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          {t('title')}
        </h1>
        <p className="mt-3 text-lg text-gray-700 font-medium">
          {t('subtitle')}
        </p>
        <p className="mt-2 text-base text-gray-600">
          <span className="font-semibold text-blue-600">{t('productList')}</span>{' '}
          {t('productDescription')}
        </p>
        <p className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          {t('warning')}
        </p>
      </header>

      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
        <DosageForm products={products} />
      </section>

      {/* ✅ 배너: 계산 폼과 결과 사이에 배치 */}
      <CoupangBanner />

      <DosageResultDisplay similarProductsMap={similarProducts} />

      {/* 자주 묻는 질문 섹션 */}
      <section className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-900">
          {tFaq('title')}
        </h2>
        <div className="grid gap-2">
          <a
            href={`${locale === 'en' ? '/en' : ''}/faq#tylenol-interval`}
            className="text-blue-600 hover:underline text-sm"
          >
            {tFaq('questions.tylenolInterval')}
          </a>
          <a
            href={`${locale === 'en' ? '/en' : ''}/faq#tylenol-brufen-difference`}
            className="text-blue-600 hover:underline text-sm"
          >
            {tFaq('questions.tylenolBrufenDifference')}
          </a>
          <a
            href={`${locale === 'en' ? '/en' : ''}/faq#cross-dosing`}
            className="text-blue-600 hover:underline text-sm"
          >
            {tFaq('questions.crossDosing')}
          </a>
          <a
            href={`${locale === 'en' ? '/en' : ''}/faq#fever-temperature-guide`}
            className="text-blue-600 hover:underline text-sm"
          >
            {tFaq('questions.feverTemperature')}
          </a>
        </div>
        <a
          href={`${locale === 'en' ? '/en' : ''}/faq`}
          className="block text-center mt-4 text-blue-600 font-semibold hover:underline"
        >
          {tFaq('viewAll')}
        </a>
      </section>

      <footer className="mt-12 text-center text-xs text-gray-500 space-y-3">
        {/* 출처 정보 */}
        <p>{tFooter('source')}</p>

        {/* 제작자 정보 (E-A-T) */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-600">
              {tFooter('creator')}{' '}
              <a
                href="https://litt.ly/solkim"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                aria-label="pinecone profile"
              >
                pinecone
              </a>
            </p>
            <a
              href="https://litt.ly/solkim"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Creator profile"
            >
              <Image
                src="/images/profile.png"
                alt="pinecone profile"
                width={32}
                height={32}
                className="rounded-full hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
        </div>

        {/* 유용한 정보 */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-gray-600 font-semibold mb-2">
            {tFooter('usefulInfo')}
          </p>
          <div className="space-y-1 text-gray-600">
            <p>
              <a
                href="https://blog.naver.com/kimsol1015/224054587927"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                • {tFooter('links.feverGuide')}
              </a>
            </p>
            <p>
              <a
                href="https://blog.naver.com/kimsol1015"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                • {tFooter('links.moreInfo')}
              </a>
            </p>
          </div>
        </div>

        {/* 쿠팡 파트너스 고지 */}
        <p className="text-gray-400 pt-3">{tFooter('disclaimer')}</p>
      </footer>
    </main>
  );
}
