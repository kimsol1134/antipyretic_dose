import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '소아 해열제 용량 계산기 (v4.0)',
  description:
    '나이와 체중만으로 타이레놀, 부루펜, 맥시부펜 용량을 즉시 계산합니다.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 font-sans antialiased">{children}</body>
    </html>
  );
}
