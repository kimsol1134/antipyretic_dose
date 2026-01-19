import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      // non-www to www redirect
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'kidsfever.xyz' }],
        destination: 'https://www.kidsfever.xyz/:path*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
