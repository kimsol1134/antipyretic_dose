import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kidsfever.xyz'),
  other: {
    'naver-site-verification': 'a307ecea2f3d2c647746ecd846a6fcb8cfd193ac',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
