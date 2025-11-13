'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useState, useTransition } from 'react';
import { trackLanguageSwitch } from '@/lib/analytics';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);

  const toggleLocale = () => {
    const nextLocale = locale === 'ko' ? 'en' : 'ko';

    // Google Analytics 이벤트 추적
    trackLanguageSwitch(locale, nextLocale);

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      aria-label={locale === 'ko' ? 'Switch to English' : '한국어로 변경'}
    >
      <span className="text-2xl" role="img" aria-label="language">
        {locale === 'ko' ? '🇰🇷' : '🇺🇸'}
      </span>
      <div className="flex flex-col items-start">
        <span className="text-xs text-gray-500 leading-tight">
          {locale === 'ko' ? 'Language' : '언어'}
        </span>
        <span className="text-sm font-semibold text-gray-800">
          {isHovered
            ? locale === 'ko'
              ? 'English'
              : '한국어'
            : locale === 'ko'
            ? '한국어'
            : 'English'}
        </span>
      </div>
      {!isPending && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      )}
      {isPending && (
        <svg
          className="animate-spin h-4 w-4 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </button>
  );
}
