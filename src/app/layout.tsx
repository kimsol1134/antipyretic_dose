import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '어린이 해열제 복용량 계산기',
  description:
    '우리 아이 체중과 나이만 입력하면 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 복용량(mL)을 즉시 계산해드립니다. 안전한 해열제 용량, 복용 간격, 하루 최대량을 확인하세요.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 font-sans antialiased">{children}</body>
    </html>
  );
}
