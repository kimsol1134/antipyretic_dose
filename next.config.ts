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
  // Note: www redirect is handled by Vercel domain settings
  // Do NOT add redirect here to avoid infinite loop
};

export default withNextIntl(nextConfig);
