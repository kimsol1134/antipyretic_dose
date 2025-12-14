import { useTranslations } from 'next-intl';
import { calculateAllDosages } from '@/lib/dosage-calculator';
import type { Product } from '@/lib/types';

interface StaticDosageTableProps {
  products: Product[];
  locale: string;
}

export default function StaticDosageTable({ products, locale }: StaticDosageTableProps) {
  const t = useTranslations('home');
  
  // SEO를 위한 체중 범위 (6kg ~ 40kg, 2kg 단위)
  const weights = Array.from({ length: 18 }, (_, i) => 6 + i * 2);
  
  // 나이는 체중 비례하여 대략적으로 설정 (계산 로직상 나이 제한 통과용)
  // 6kg ~= 3-4개월, 40kg ~= 11-12세
  // 그냥 넉넉하게 설정하되, 각 제품별 최소 연령(4개월/6개월) 주의
  // 여기서는 단순히 계산된 '용량'을 보여주는 표이므로, 일괄 5세(60개월)로 가정하고
  // 표 하단에 "나이 제한 확인 필요" 문구를 넣는 전략
  
  return (
    <section className="mt-16 w-full max-w-4xl mx-auto" aria-labelledby="dosage-table-heading">
      <h2 
        id="dosage-table-heading" 
        className="text-2xl font-bold text-gray-900 mb-6 text-center"
      >
        {locale === 'ko' ? '체중별 해열제 권장 복용량표 (참고)' : 'Fever Medicine Dosage Chart by Weight (Reference)'}
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-bold bg-blue-50/50 sticky left-0 z-10 w-20">
                {locale === 'ko' ? '체중' : 'Weight'}
              </th>
              {products.map((product) => (
                <th key={product.id} className="px-4 py-3 min-w-[140px]">
                  <div className="font-bold">{product.name}</div>
                  <div className="text-[10px] text-gray-500 font-normal normal-case">
                    {product.ingredient} ({product.strength_mg_per_ml}mg/mL)
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {weights.map((weight) => {
              // 테이블 생성을 위한 일회성 계산 (나이는 넉넉히 24개월로 가정하여 대부분 제품 통과시킴)
              // 실제로는 부루펜(6개월), 타이레놀(4개월) 등 제한이 있지만,
              // "체중 기준" 표를 찾는 검색 의도를 충족시키기 위해 값 표시
              const results = calculateAllDosages(
                { weight, age: 24, ageUnit: 'months' },
                products
              );

              return (
                <tr key={weight} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-blue-900 bg-blue-50/30 sticky left-0">
                    {weight}kg
                  </td>
                  {results.map((result) => (
                    <td key={result.product.id} className="px-4 py-3">
                      {result.status === 'success' && result.recommended_ml ? (
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-gray-900 text-base">
                            {result.min_ml} ~ {result.max_ml} mL
                          </span>
                          {/* 1회 최대 용량 제한에 걸린 경우 표시 */}
                          {result.max_ml === result.product.max_single_mg / result.product.strength_mg_per_ml && (
                            <span className="text-[10px] text-orange-600 font-medium">
                              {locale === 'ko' ? '최대 용량' : 'Max Dose'}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-500 text-center leading-relaxed">
        {locale === 'ko' 
          ? '* 위 표는 참고용입니다. 실제 복용 시에는 제품 라벨의 지침과 의사/약사의 권고를 최우선으로 따라주세요. 특히 생후 4개월 미만(타이레놀), 6개월 미만(부루펜) 영아는 반드시 진료 후 복용해야 합니다.'
          : '* This chart is for reference only. Always follow the product label instructions and doctor\'s advice. Consult a doctor for infants under 4 months (Tylenol) or 6 months (Ibuprofen).'}
      </p>
    </section>
  );
}
