import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko',
  localePrefix: 'as-needed', // 한국어는 /, 영어는 /en
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
