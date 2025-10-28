'use client';

import React from 'react';

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
  const colors =
    variant === 'error'
      ? 'bg-red-100 border-red-400 text-red-700'
      : 'bg-yellow-100 border-yellow-400 text-yellow-700';

  return (
    <div
      className={`px-4 py-3 border rounded-lg ${colors} ${className}`}
      role="alert"
    >
      <p className="font-bold">{variant === 'error' ? '오류' : '주의'}</p>
      <p className="text-sm">{children}</p>
    </div>
  );
};
