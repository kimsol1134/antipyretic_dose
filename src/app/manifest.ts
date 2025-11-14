import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '어린이 해열제 복용량 계산기',
    short_name: '해열제 계산기',
    description:
      '의사가 만든 안전한 계산기 | 체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 용량 즉시 계산',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
