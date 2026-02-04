import fs from 'fs/promises';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { productsSchema } from '@/lib/schemas';
import type { Product, SimilarProductsMap, RelatedProductsMapUS } from '@/lib/types';
import DosageForm from '../components/DosageForm';
import DosageResultDisplay from '../components/DosageResultDisplay';
import KakaoAdFitBanner from '../components/ads/KakaoAdFitBanner';
import StaticDosageTable from '../components/seo/StaticDosageTable';
import PiecefulBanner from '../components/ads/PiecefulBanner';

async function getValidatedProducts(locale: string): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'data', 'products.json');

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    const allProducts = productsSchema.parse(jsonData);

    // locale에 따라 필터링
    const marketKey = locale === 'en' ? 'en' : 'ko';
    const filteredProducts = allProducts.filter((product) =>
      product.markets.includes(marketKey)
    );

    return filteredProducts;
  } catch (error) {
    console.error('======= [빌드 실패] products.json 데이터 검증 실패 =======');
    console.error(error);
    throw new Error('products.json 데이터 로드 또는 검증에 실패했습니다.');
  }
}

async function getSimilarProducts(locale: string): Promise<SimilarProductsMap> {
  // 한국 버전만 e약은요 API 사용
  if (locale !== 'ko') {
    return {};
  }

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

async function getRelatedProductsUS(locale: string): Promise<RelatedProductsMapUS> {
  // 영어 버전만 하드코딩된 관련 제품 사용
  if (locale !== 'en') {
    return {};
  }

  const filePath = path.join(process.cwd(), 'data', 'related-products-us.json');

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    return jsonData as RelatedProductsMapUS;
  } catch (error) {
    console.warn('관련 제품 데이터를 불러올 수 없습니다. 빈 데이터를 사용합니다.');
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

  const products = await getValidatedProducts(locale);
  const similarProducts = await getSimilarProducts(locale);
  const relatedProductsUS = await getRelatedProductsUS(locale);

  return (
    <main className="container mx-auto max-w-lg p-4 pt-8 sm:pt-12">
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-4">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
            {locale === 'ko' ? '의사 검수 완료' : 'Medically Reviewed'}
          </span>
          <span className="text-[10px] text-blue-600">
            {locale === 'ko' ? 'by Dr. Sol Kim' : 'by Dr. Sol Kim'}
          </span>
        </div>
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
      <KakaoAdFitBanner />

      <DosageResultDisplay
        similarProductsMap={similarProducts}
        relatedProductsMap={relatedProductsUS}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            products.map((product) => ({
              '@context': 'https://schema.org',
              '@type': 'Drug',
              name: product.name,
              activeIngredient: product.ingredient,
              dosageForm: 'Suspension',
              mechanismOfAction: 'Analgesic/Antipyretic',
              warning:
                locale === 'ko'
                  ? '반드시 나이와 체중을 확인하고 복용하세요.'
                  : 'Always check age and weight requirements.',
              availableStrength: {
                '@type': 'DrugStrength',
                strengthValue: product.strength_mg_per_ml,
                strengthUnit: 'mg/mL',
              },
              image: `https://kidsfever.xyz${product.image}`,
              description:
                locale === 'ko'
                  ? `${product.name}의 체중별/나이별 정확한 권장 복용량 및 안전 정보`
                  : `Accurate dosage and safety information for ${product.nameEn || product.name}`,
              offers: undefined, // Merchant Listing 문제 해결을 위해 offers 제거 (판매용이 아님)
            }))
          ),
        }}
      />

      <PiecefulBanner locale={locale} />

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

      <StaticDosageTable products={products} locale={locale} />

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
                aria-label="solkim profile"
              >
                solkim
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
                alt="solkim profile"
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

        {/* 사이트 정보 링크 */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-3 text-gray-600">
            <Link
              href={`${locale === 'en' ? '/en' : ''}/about`}
              className="hover:text-blue-600 hover:underline"
            >
              {locale === 'en' ? 'About' : '소개'}
            </Link>
            <span>•</span>
            <Link
              href={`${locale === 'en' ? '/en' : ''}/privacy`}
              className="hover:text-blue-600 hover:underline"
            >
              {locale === 'en' ? 'Privacy' : '개인정보처리방침'}
            </Link>
            <span>•</span>
            <Link
              href={`${locale === 'en' ? '/en' : ''}/terms`}
              className="hover:text-blue-600 hover:underline"
            >
              {locale === 'en' ? 'Terms' : '이용약관'}
            </Link>
            <span>•</span>
            <Link
              href={`${locale === 'en' ? '/en' : ''}/contact`}
              className="hover:text-blue-600 hover:underline"
            >
              {locale === 'en' ? 'Contact' : '문의'}
            </Link>
          </div>
        </div>

        {/* 쿠팡 파트너스 고지 */}
        <p className="text-gray-400 pt-3">{tFooter('disclaimer')}</p>
      </footer>
    </main>
  );
}
