'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

type AlertProps = {
  children: React.ReactNode;
  variant?: 'warning' | 'error';
  className?: string;
};

export const Alert = ({
  children,
  variant = 'warning',
  className = '',
}: AlertProps) => {
  const t = useTranslations('common');

  const colors =
    variant === 'error'
      ? 'bg-red-100 border-red-400 text-red-700'
      : 'bg-yellow-100 border-yellow-400 text-yellow-700';

  const title = variant === 'error' ? t('errorTitle') : t('warningTitle');

  return (
    <div
      className={`px-4 py-3 border rounded-lg ${colors} ${className}`}
      role="alert"
    >
      <p className="font-bold">{title}</p>
      <p className="text-sm">{children}</p>
    </div>
  );
};
