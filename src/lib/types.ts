import { z } from 'zod';
import { dosageInputSchema, productSchema } from './schemas';
import type { EasyDrugItem } from './easy-drug';

export type Product = z.infer<typeof productSchema>;
export type DosageInput = z.infer<typeof dosageInputSchema>;

export type DosageResultStatus = 'success' | 'age_block' | 'error';

export type IngredientKey = 'acetaminophen' | 'ibuprofen' | 'dexibuprofen';

export type NextDoseStatus = 'different_ingredient' | 'ready' | 'wait';

export type NextDoseInfo = {
  status: NextDoseStatus;
  nextDoseAtMs: number;
  minutesUntilNext: number;
};

export type DosageResult = {
  product: Product;
  status: DosageResultStatus;
  recommended_ml: number | null;
  min_ml: number | null;
  max_ml: number | null;
  max_single_ml: number | null;
  max_daily_ml: number | null;
  message: string | null;
  nextDose: NextDoseInfo | null;
};

export type DosageStoreState = {
  results: DosageResult[];
  status: 'idle' | 'calculated';
  actions: {
    calculateAllDosages: (input: DosageInput, products: Product[]) => void;
    clearResults: () => void;
  };
};

export type SimilarProductsMap = Record<string, EasyDrugItem[]>;

// 미국 시장 관련 제품 타입
export type RelatedProduct = {
  name: string;
  genericName: string;
  strength: string;
  manufacturer: string;
  type: 'brand' | 'generic';
  note?: string;
};

export type RelatedProductsMapUS = Record<string, RelatedProduct[]>;
