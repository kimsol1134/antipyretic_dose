import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://kidsfever.xyz'),

  // 기본 메타데이터
  title: {
    default: '어린이 해열제 복용량 계산기 | 타이레놀·챔프·부루펜 용량표',
    template: '%s | 어린이 해열제 복용량 계산기',
  },
  description:
    '의사가 만든 어린이 해열제 복용량 계산기. 체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 용량을 즉시 계산합니다. 안전한 복용 간격과 최대 용량 확인 (식약처 기준)',
  keywords: [
    '어린이 해열제',
    '해열제 복용량',
    '타이레놀 용량',
    '챔프 용량',
    '부루펜 용량',
    '맥시부펜',
    '소아 해열제',
    '어린이 약 용량',
    '체중별 해열제',
    '나이별 해열제',
  ],
  authors: [{ name: '어린이 해열제 복용량 계산기' }],
  creator: '어린이 해열제 복용량 계산기',
  publisher: '어린이 해열제 복용량 계산기',

  // Canonical URL
  alternates: {
    canonical: 'https://kidsfever.xyz',
  },

  // Open Graph 메타데이터 (네이버, 카카오톡 등)
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://kidsfever.xyz',
    siteName: '어린이 해열제 복용량 계산기',
    title: '어린이 해열제 복용량 계산기 | 타이레놀·챔프·부루펜 용량표 (체중별)',
    description:
      '의사가 만든 어린이 해열제 복용량 계산기 | 체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 용량 즉시 계산. 안전한 복용 간격과 최대 용량 확인 (식약처 기준)',
    images: [
      {
        url: 'https://kidsfever.xyz/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: '어린이 해열제 복용량 계산기 - 타이레놀, 챔프, 부루펜, 맥시부펜 체중별 용량표',
        type: 'image/png',
      },
    ],
  },

  // Twitter 카드 메타데이터
  twitter: {
    card: 'summary_large_image',
    title: '어린이 해열제 복용량 계산기 | 타이레놀·챔프·부루펜 용량표',
    description:
      '의사가 만든 어린이 해열제 복용량 계산기 | 체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 용량 즉시 계산.',
    images: ['https://kidsfever.xyz/opengraph-image.png'],
  },

  // 아이콘 설정
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },

  // 기타 메타 태그
  other: {
    'naver-site-verification': 'a307ecea2f3d2c647746ecd846a6fcb8cfd193ac',
    'google-site-verification': '',
  },

  // 로봇 설정
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 추가 설정
  category: 'health',
  classification: '어린이 건강/의료 도구',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
