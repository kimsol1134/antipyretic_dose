// FAQ 데이터 타입 정의

export type SourceType = 'official' | 'medical' | 'reference';
export type FAQCategory = 'timing' | 'interval' | 'comparison' | 'safety';

export interface Source {
  name: string;
  url: string;
  type: SourceType;
  description?: string;
}

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  shortAnswer: string; // 40-60자, Featured Snippet 타겟
  detailedAnswer: string; // HTML 지원
  medicalDisclaimer: string;
  sources: Source[];
  keywords: string[];
  targetKeyword: string;
  relatedFAQs?: string[];
  relatedProducts?: string[];
  lastUpdated: string;
  reviewed: boolean;
  priority: 0 | 1 | 2;
}

// 8개 핵심 FAQ 데이터
export const faqData: FAQItem[] = [
  {
    id: 'fever-temperature-guide',
    category: 'timing',
    question: '아이 열이 몇 도일 때 해열제를 먹여야 하나요?',
    shortAnswer:
      '체온이 38.5°C 이상이거나, 38°C 이상이면서 아이가 불편해할 때 해열제를 먹일 수 있습니다.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">해열제를 먹이는 기준</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li><strong>체온 38.5°C 이상</strong></li>
        <li><strong>체온 38°C 이상 + 아이가 불편해하거나 보챌 때</strong></li>
        <li>열성 경련 병력이 있는 경우 (38°C 미만이라도 오한 등 증상 시)</li>
      </ul>

      <div class="bg-blue-50 p-3 rounded mb-4">
        <p class="text-sm"><strong>💡 참고</strong></p>
        <p class="text-sm">38°C는 해열제를 "먹일 수 있는" 기준이지, 반드시 먹여야 하는 기준은 아닙니다. 아이의 전반적인 컨디션을 함께 고려하세요.</p>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">급하게 먹일 필요 없는 경우</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li>체온 38°C~38.5°C 사이이고 잘 먹고 잘 놀고 컨디션이 좋은 경우</li>
      </ul>

      <h4 class="font-semibold text-gray-800 mb-2">🚨 즉시 병원 방문이 필요한 경우</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li class="text-red-600 font-medium">생후 3개월 이하 영아가 38°C 이상</li>
        <li class="text-red-600 font-medium">48-72시간 이상 열이 지속</li>
        <li class="text-red-600 font-medium">발진, 구토, 경련 등 다른 증상 동반</li>
      </ul>
    `,
    medicalDisclaimer:
      '본 정보는 일반적인 참고 자료이며 의학적 조언이 아닙니다. 실제 투약 전 반드시 의사 또는 약사와 상담하세요.',
    sources: [
      {
        name: '서울아산병원 소아응급의료센터',
        url: 'https://news.amc.seoul.kr/news/con/detail.do?cntId=5576',
        type: 'medical',
        description: '우리 아이 열날 때 대처법',
      },
      {
        name: '명지병원 소아응급의료센터',
        url: 'https://mjh.or.kr/infant/health/class/fever-children.do',
        type: 'medical',
        description: '소아 발열 가이드',
      },
      {
        name: 'K-Health 소아해열제 사용법',
        url: 'https://www.k-health.com/news/articleView.html?idxno=58679',
        type: 'reference',
      },
    ],
    keywords: ['해열제', '체온', '38도', '열', '발열'],
    targetKeyword: '아기 열 몇 도 해열제',
    relatedFAQs: ['tylenol-interval', 'brufen-interval'],
    relatedProducts: [
      'tylenol_susp_100ml_kr',
      'champ_syrup_red_kr',
      'brufen_susp_100_5_kr',
      'maxibufen_susp_12_1_kr',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0,
  },

  {
    id: 'tylenol-interval',
    category: 'interval',
    question: '타이레놀(아세트아미노펜) 복용 간격은 몇 시간인가요?',
    shortAnswer:
      '타이레놀(아세트아미노펜)은 최소 4시간 간격으로 복용하며, 하루 최대 5회까지 가능합니다.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">권장 복용 간격</h4>
      <div class="bg-gray-50 rounded p-4 mb-4">
        <table class="w-full text-sm">
          <tr class="border-b">
            <td class="py-2 font-medium">최소 간격</td>
            <td class="py-2 text-blue-600 font-bold">4시간</td>
          </tr>
          <tr class="border-b">
            <td class="py-2 font-medium">권장 간격</td>
            <td class="py-2">4-6시간</td>
          </tr>
          <tr>
            <td class="py-2 font-medium">하루 최대 횟수</td>
            <td class="py-2">5회</td>
          </tr>
        </table>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">주의사항</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li class="text-red-600">4시간 미만 간격으로 복용 시 간 손상 위험</li>
        <li class="text-red-600">하루 최대 용량: 체중 × 75mg/kg</li>
        <li class="text-green-600">공복 복용 가능 (위장 부담 적음)</li>
      </ul>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p class="text-sm"><strong>💊 정확한 복용량을 알고 싶으신가요?</strong></p>
        <p class="text-sm mt-1"><a href="/" class="text-blue-600 underline">복용량 계산기</a>에서 아이 체중을 입력하면 정확한 mL 용량을 계산해드립니다.</p>
      </div>
    `,
    medicalDisclaimer:
      '본 정보는 식품의약품안전처 허가사항을 참고한 일반적인 가이드라인입니다. 실제 투약 전 반드시 의사 또는 약사와 상담하세요.',
    sources: [
      {
        name: '식품의약품안전처 의약품통합정보시스템',
        url: 'https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=199603002',
        type: 'official',
        description: '어린이타이레놀현탁액 허가사항',
      },
      {
        name: '타이레놀 공식 홈페이지',
        url: 'https://www.tylenol.co.kr/children-infants/safety/dosage-charts',
        type: 'official',
        description: '복용량 가이드',
      },
    ],
    keywords: ['타이레놀', '복용 간격', '4시간', '아세트아미노펜'],
    targetKeyword: '타이레놀 복용 간격',
    relatedFAQs: ['brufen-interval', 'cross-dosing', 'tylenol-brufen-difference'],
    relatedProducts: [
      'tylenol_susp_100ml_kr',
      'tylenol_susp_200ml_kr',
      'champ_syrup_red_kr',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0,
  },

  {
    id: 'brufen-interval',
    category: 'interval',
    question: '부루펜(이부프로펜) 복용 간격은 몇 시간인가요?',
    shortAnswer:
      '부루펜(이부프로펜)은 최소 6시간 간격으로 복용하며, 하루 최대 3-4회까지 가능합니다.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">권장 복용 간격</h4>
      <div class="bg-gray-50 rounded p-4 mb-4">
        <table class="w-full text-sm">
          <tr class="border-b">
            <td class="py-2 font-medium">최소 간격</td>
            <td class="py-2 text-blue-600 font-bold">6시간</td>
          </tr>
          <tr class="border-b">
            <td class="py-2 font-medium">권장 간격</td>
            <td class="py-2">6-8시간</td>
          </tr>
          <tr>
            <td class="py-2 font-medium">하루 최대 횟수</td>
            <td class="py-2">3-4회</td>
          </tr>
        </table>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">주의사항</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li class="text-red-600 font-medium">반드시 식후 또는 간식과 함께 복용 (공복 복용 금지)</li>
        <li>위장 장애 예방 필수</li>
        <li>체중 30kg 미만 소아: 하루 최대 25mL</li>
      </ul>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p class="text-sm"><strong>⚠️ 공복 복용 주의</strong></p>
        <p class="text-sm mt-1">밤중에 급하게 먹여야 할 때는 간단한 우유나 과자라도 먹인 후 복용하세요.</p>
      </div>
    `,
    medicalDisclaimer:
      '본 정보는 식품의약품안전처 허가사항을 참고한 일반적인 가이드라인입니다. 실제 투약 전 반드시 의사 또는 약사와 상담하세요.',
    sources: [
      {
        name: '식품의약품안전처 의약품통합정보시스템',
        url: 'https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=198601920',
        type: 'official',
        description: '어린이부루펜시럽 허가사항',
      },
      {
        name: 'Fever Coach 소아과 전문의',
        url: 'https://home.fevercoach.net',
        type: 'medical',
      },
    ],
    keywords: ['부루펜', '이부프로펜', '복용 간격', '6시간'],
    targetKeyword: '부루펜 복용 간격',
    relatedFAQs: ['tylenol-interval', 'cross-dosing', 'empty-stomach'],
    relatedProducts: ['brufen_susp_100_5_kr'],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0,
  },

  {
    id: 'tylenol-brufen-difference',
    category: 'comparison',
    question: '타이레놀과 부루펜 중 어떤 것을 먹여야 하나요?',
    shortAnswer:
      '식약처는 6개월 이전 영아는 타이레놀, 6개월 이후는 부루펜을 권장합니다. 상황에 따라 선택하세요.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">성분 및 특징 비교</h4>
      <div class="overflow-x-auto mb-4">
        <table class="w-full text-sm border">
          <thead class="bg-gray-100">
            <tr>
              <th class="border p-2">구분</th>
              <th class="border p-2">타이레놀</th>
              <th class="border p-2">부루펜</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2 font-medium">성분</td>
              <td class="border p-2">아세트아미노펜</td>
              <td class="border p-2">이부프로펜</td>
            </tr>
            <tr>
              <td class="border p-2 font-medium">최소 연령</td>
              <td class="border p-2">생후 4개월</td>
              <td class="border p-2">생후 6개월</td>
            </tr>
            <tr>
              <td class="border p-2 font-medium">복용 간격</td>
              <td class="border p-2">4-6시간</td>
              <td class="border p-2">6-8시간</td>
            </tr>
            <tr>
              <td class="border p-2 font-medium">공복 복용</td>
              <td class="border p-2 text-green-600">✅ 가능</td>
              <td class="border p-2 text-red-600">❌ 불가</td>
            </tr>
            <tr>
              <td class="border p-2 font-medium">소염 효과</td>
              <td class="border p-2">❌ 없음</td>
              <td class="border p-2 text-blue-600">✅ 있음</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">상황별 권장</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li><strong>생후 6개월 이전:</strong> 타이레놀 (식약처 권장)</li>
        <li><strong>빠른 효과 필요:</strong> 부루펜 (소염 효과)</li>
        <li><strong>위장이 약한 아이:</strong> 타이레놀</li>
        <li><strong>공복 상태:</strong> 타이레놀</li>
      </ul>
    `,
    medicalDisclaimer:
      '본 정보는 일반적인 참고 자료입니다. 아이의 특수한 상황을 고려하여 의사 또는 약사와 상담 후 선택하세요.',
    sources: [
      {
        name: '서울경제 - 식약처 해열제 권고사항',
        url: 'https://www.sedaily.com/NewsVIew/1ZABCNDZSG',
        type: 'reference',
      },
      {
        name: '동아제약 챔프 공식 홈페이지',
        url: 'https://dpharm.co.kr/champ/info',
        type: 'official',
        description: '제품 정보 및 복용 가이드',
      },
      {
        name: '타이레놀 코리아 공식 홈페이지',
        url: 'https://www.tylenol.co.kr/children-infants/safety/dosage-charts',
        type: 'official',
        description: '어린이 복용량 가이드',
      },
    ],
    keywords: ['타이레놀', '부루펜', '차이', '비교', '어떤것'],
    targetKeyword: '타이레놀 부루펜 차이',
    relatedFAQs: ['tylenol-interval', 'brufen-interval', 'cross-dosing'],
    relatedProducts: [
      'tylenol_susp_100ml_kr',
      'brufen_susp_100_5_kr',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0,
  },

  {
    id: 'cross-dosing',
    category: 'interval',
    question: '해열제 교차 복용은 어떻게 하나요?',
    shortAnswer:
      '타이레놀과 부루펜은 최소 2시간, 권장 3시간 간격으로 교차 복용이 가능하나, 원칙적으로는 한 가지 해열제만 사용할 것을 권장합니다.',
    detailedAnswer: `
      <div class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-4">
        <p class="text-sm"><strong>⚠️ 중요</strong></p>
        <p class="text-sm mt-1">원칙적으로 교차 복용을 권장하지 않습니다. 한 가지 해열제로 2시간 간격 2회 정도만 사용할 것을 권장하며, 교차 복용이 필요한 경우 반드시 의사와 상담하세요.</p>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">교차 복용이 불가피한 경우</h4>
      <div class="bg-blue-50 p-4 rounded mb-4">
        <p class="font-medium mb-2">✅ 가능한 조합:</p>
        <p class="text-sm">타이레놀 → (최소 2시간, 권장 3시간 후) → 부루펜 → (최소 2시간, 권장 3시간 후) → 타이레놀</p>
      </div>

      <div class="bg-red-50 p-4 rounded mb-4">
        <p class="font-medium mb-2 text-red-700">❌ 절대 금지 조합:</p>
        <ul class="text-sm space-y-1">
          <li>• 부루펜 ↔ 맥시부펜 (같은 NSAIDs 계열)</li>
          <li>• 타이레놀 + 챔프 빨강 (같은 아세트아미노펜 성분)</li>
        </ul>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">교차 복용 원칙</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li><strong>최소 간격: 2시간 (권장: 3시간)</strong></li>
        <li>✅ 가능: 아세트아미노펜 ↔ NSAIDs (이부프로펜/덱시부프로펜)</li>
        <li>❌ 불가: 같은 성분끼리, 같은 계열끼리</li>
        <li>각 해열제의 하루 최대 횟수 준수</li>
      </ul>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p class="text-sm"><strong>💡 전문가 의견</strong></p>
        <p class="text-sm mt-1">2019년 연구에서 교차 복용의 유의미한 효과 차이가 명확히 입증되지 않았으며, 부적절한 사용 시 오히려 문제가 될 수 있습니다.</p>
      </div>
    `,
    medicalDisclaimer:
      '본 정보는 일반적인 참고 자료입니다. 교차 복용은 원칙적으로 권장되지 않으며, 필요한 경우 반드시 의사 또는 약사와 상담하세요.',
    sources: [
      {
        name: '약사 가이드 - 소아 해열제 교차 복용',
        url: 'https://www.ckup.co.kr/bbs/board.php?bo_table=notice&wr_id=10151',
        type: 'medical',
        description: '교차 복용 가이드라인',
      },
      {
        name: 'Fever Coach - 올바른 교차복용',
        url: 'https://home.fevercoach.net/올바른-해열제-교차복용-방법은/',
        type: 'medical',
      },
      {
        name: '세계일보 - 교차복용 효과 연구',
        url: 'https://www.segye.com/newsView/20240218507668',
        type: 'reference',
        description: '2019년 연구 결과',
      },
    ],
    keywords: ['교차 복용', '해열제', '타이레놀', '부루펜', '함께'],
    targetKeyword: '해열제 교차 복용',
    relatedFAQs: ['tylenol-interval', 'brufen-interval', 'tylenol-brufen-difference'],
    relatedProducts: [
      'tylenol_susp_100ml_kr',
      'brufen_susp_100_5_kr',
      'maxibufen_susp_12_1_kr',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 1,
  },

  {
    id: 'tylenol-100-200-difference',
    category: 'comparison',
    question: '타이레놀 100mL와 200mL 제품의 차이는 무엇인가요?',
    shortAnswer:
      '농도가 다릅니다. 100mL는 32mg/mL, 200mL는 50mg/mL로 같은 양(mL)을 먹이면 과량 복용이 됩니다.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">제품별 농도 비교</h4>
      <div class="overflow-x-auto mb-4">
        <table class="w-full text-sm border">
          <thead class="bg-gray-100">
            <tr>
              <th class="border p-2">제품</th>
              <th class="border p-2">농도</th>
              <th class="border p-2">대상 연령</th>
              <th class="border p-2">10kg 아이 권장량</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2">타이레놀 100mL</td>
              <td class="border p-2 font-bold">32 mg/mL</td>
              <td class="border p-2">생후 4개월 이상</td>
              <td class="border p-2">약 4mL</td>
            </tr>
            <tr>
              <td class="border p-2">타이레놀 200mL</td>
              <td class="border p-2 font-bold text-red-600">50 mg/mL</td>
              <td class="border p-2">만 2세 이상</td>
              <td class="border p-2">약 2.5mL</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
        <p class="font-bold text-red-700 mb-2">🚨 매우 중요</p>
        <ul class="text-sm space-y-1">
          <li>• 같은 용량(mL)을 복용하면 <strong>과량 복용 위험</strong></li>
          <li>• 제품을 바꾸면 <strong>반드시 용량 재계산 필수</strong></li>
          <li>• 200mL 제품은 농도가 <strong>1.5배 높음</strong></li>
        </ul>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p class="text-sm"><strong>💊 정확한 복용량 계산</strong></p>
        <p class="text-sm mt-1"><a href="/" class="text-blue-600 underline">복용량 계산기</a>에서 제품을 선택하면 정확한 복용량(mL)을 자동 계산해드립니다.</p>
      </div>
    `,
    medicalDisclaimer:
      '본 정보는 제품 허가사항을 참고한 내용입니다. 제품 변경 시 반드시 약사와 상담하세요.',
    sources: [
      {
        name: '타이레놀 코리아 공식 홈페이지',
        url: 'https://www.tylenol.co.kr/products/children-infants',
        type: 'official',
        description: '어린이 제품 라인업',
      },
      {
        name: '식품의약품안전처 의약품통합정보시스템',
        url: 'https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=199603002',
        type: 'official',
        description: '어린이타이레놀현탁액 허가사항',
      },
      {
        name: '약사 블로그',
        url: 'https://pharm-kimp.tistory.com/5',
        type: 'reference',
        description: '타이레놀 100mL vs 200mL 주의사항',
      },
    ],
    keywords: ['타이레놀', '100ml', '200ml', '차이', '농도'],
    targetKeyword: '타이레놀 100 200 차이',
    relatedFAQs: ['tylenol-interval'],
    relatedProducts: ['tylenol_susp_100ml_kr', 'tylenol_susp_200ml_kr'],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 1,
  },

  {
    id: 'empty-stomach',
    category: 'safety',
    question: '해열제를 공복에 먹여도 되나요?',
    shortAnswer:
      '타이레놀(아세트아미노펜)은 공복 복용 가능하지만, 부루펜/맥시부펜은 반드시 식후 또는 간식과 함께 복용해야 합니다.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">성분별 공복 복용 가능 여부</h4>
      <div class="space-y-3 mb-4">
        <div class="bg-green-50 p-3 rounded">
          <p class="font-medium text-green-700">✅ 공복 복용 가능</p>
          <ul class="text-sm mt-1 space-y-1">
            <li>• 타이레놀 (아세트아미노펜)</li>
            <li>• 챔프 시럽 빨강 (아세트아미노펜)</li>
          </ul>
          <p class="text-xs text-gray-600 mt-2">→ 위장 부담이 적어 공복 복용 가능</p>
        </div>

        <div class="bg-red-50 p-3 rounded">
          <p class="font-medium text-red-700">❌ 공복 복용 금지</p>
          <ul class="text-sm mt-1 space-y-1">
            <li>• 부루펜 (이부프로펜)</li>
            <li>• 챔프 파랑 (이부프로펜)</li>
            <li>• 맥시부펜 (덱시부프로펜)</li>
          </ul>
          <p class="text-xs text-gray-600 mt-2">→ 반드시 식후 또는 간식과 함께 복용</p>
        </div>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">💡 실전 팁</h4>
      <div class="bg-blue-50 p-3 rounded">
        <p class="font-medium mb-2">밤중에 급하게 먹여야 할 때:</p>
        <ul class="text-sm space-y-1">
          <li>• <strong>공복이라면:</strong> 타이레놀 선택</li>
          <li>• <strong>간단한 간식 가능:</strong> 우유나 과자 먹인 후 부루펜/맥시부펜 가능</li>
        </ul>
      </div>
    `,
    medicalDisclaimer:
      '본 정보는 일반적인 참고 자료입니다. 아이의 위장 상태를 고려하여 의사 또는 약사와 상담하세요.',
    sources: [
      {
        name: '식품의약품안전처 의약품통합정보시스템',
        url: 'https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=199603002',
        type: 'official',
        description: '어린이타이레놀현탁액 허가사항',
      },
      {
        name: '식품의약품안전처 의약품통합정보시스템',
        url: 'https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=198601920',
        type: 'official',
        description: '어린이부루펜시럽 허가사항',
      },
      {
        name: '의사신문',
        url: 'http://www.doctorstimes.com/news/articleView.html?idxno=218101',
        type: 'reference',
        description: '아세트아미노펜 복약 지도 가이드',
      },
    ],
    keywords: ['공복', '식후', '타이레놀', '부루펜', '복용'],
    targetKeyword: '타이레놀 공복',
    relatedFAQs: ['tylenol-brufen-difference', 'tylenol-interval', 'brufen-interval'],
    relatedProducts: [
      'tylenol_susp_100ml_kr',
      'brufen_susp_100_5_kr',
      'maxibufen_susp_12_1_kr',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 1,
  },

  {
    id: 'daily-max-doses',
    category: 'safety',
    question: '해열제는 하루에 몇 번까지 먹일 수 있나요?',
    shortAnswer:
      '타이레놀은 하루 최대 5회, 부루펜/맥시부펜은 하루 최대 3-4회까지 가능합니다.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">성분별 하루 최대 복용 횟수</h4>
      <div class="overflow-x-auto mb-4">
        <table class="w-full text-sm border">
          <thead class="bg-gray-100">
            <tr>
              <th class="border p-2">성분</th>
              <th class="border p-2">하루 최대 횟수</th>
              <th class="border p-2">복용 간격</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2">아세트아미노펜</td>
              <td class="border p-2 font-bold">5회</td>
              <td class="border p-2">4-6시간</td>
            </tr>
            <tr>
              <td class="border p-2">이부프로펜</td>
              <td class="border p-2 font-bold">3-4회</td>
              <td class="border p-2">6-8시간</td>
            </tr>
            <tr>
              <td class="border p-2">덱시부프로펜</td>
              <td class="border p-2 font-bold">4회</td>
              <td class="border p-2">4-6시간</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">1일 최대 용량 (mL 기준)</h4>
      <div class="bg-yellow-50 p-3 rounded mb-4">
        <p class="text-sm font-medium mb-2">체중 30kg 미만 소아의 경우:</p>
        <ul class="text-sm space-y-1">
          <li>• 이부프로펜: 최대 25mL</li>
          <li>• 덱시부프로펜: 최대 25mL</li>
        </ul>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p class="text-sm"><strong>💊 정확한 하루 최대 용량 계산</strong></p>
        <p class="text-sm mt-1"><a href="/" class="text-blue-600 underline">복용량 계산기</a>에서 아이 체중을 입력하면 각 제품별 하루 최대 용량(mL)을 자동으로 계산해드립니다.</p>
      </div>
    `,
    medicalDisclaimer:
      '본 정보는 제품 허가사항을 참고한 일반적인 가이드라인입니다. 실제 투약 전 반드시 의사 또는 약사와 상담하세요.',
    sources: [
      {
        name: '식품의약품안전처 의약품통합정보시스템',
        url: 'https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=199603002',
        type: 'official',
        description: '어린이타이레놀현탁액 허가사항',
      },
      {
        name: '식품의약품안전처 의약품통합정보시스템',
        url: 'https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=198601920',
        type: 'official',
        description: '어린이부루펜시럽 허가사항',
      },
      {
        name: 'K-Health 소아해열제 사용법',
        url: 'https://www.k-health.com/news/articleView.html?idxno=58679',
        type: 'reference',
        description: '하루 최대 복용 횟수 가이드',
      },
    ],
    keywords: ['하루', '최대', '횟수', '몇번', '용량'],
    targetKeyword: '해열제 하루 최대',
    relatedFAQs: ['tylenol-interval', 'brufen-interval', 'cross-dosing'],
    relatedProducts: [
      'tylenol_susp_100ml_kr',
      'brufen_susp_100_5_kr',
      'maxibufen_susp_12_1_kr',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 1,
  },
];

// 카테고리별 제목 매핑
export const categoryLabels: Record<FAQCategory, string> = {
  timing: '복용 시기 및 온도',
  interval: '복용 간격 및 횟수',
  comparison: '제품 비교 및 선택',
  safety: '복용 방법 및 안전성',
};
