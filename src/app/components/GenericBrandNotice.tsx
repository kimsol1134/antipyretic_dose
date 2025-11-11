'use client';

import type { Product } from '@/lib/types';

type Props = {
  product: Product;
  locale: string;
};

export function GenericBrandNotice({ product, locale }: Props) {
  if (locale !== 'en') return null;

  const productName = product.nameEn || product.name;
  const strength = product.strength_mg_per_ml;

  return (
    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm font-semibold text-gray-800 mb-2">
        💰 Cost-Saving Tip: Generic Options Available
      </p>
      <p className="text-sm text-gray-700">
        Generic versions of <strong>{productName}</strong> are available
        at CVS, Walgreens, Target, Walmart, and other pharmacies.
      </p>
      <p className="text-xs text-gray-600 mt-2">
        Look for products labeled <strong>&quot;Compare to {productName}&quot;</strong>{' '}
        with the same strength (<strong>{strength} mg/mL</strong>).
        Generic brands contain the same active ingredient and work
        exactly the same as brand-name products.
      </p>
    </div>
  );
}
