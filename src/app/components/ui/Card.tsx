'use client';

import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`p-5 bg-white border border-gray-200 rounded-lg shadow-md ${className}`}
    >
      {children}
    </div>
  );
};
