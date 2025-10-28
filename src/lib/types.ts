import { z } from 'zod';
import { dosageInputSchema, productSchema } from './schemas';
import type { EasyDrugItem } from './easy-drug';

export type Product = z.infer<typeof productSchema>;
export type DosageInput = z.infer<typeof dosageInputSchema>;

export type DosageResultStatus = 'success' | 'age_block' | 'error';

export type DosageResult = {
  product: Product;
  status: DosageResultStatus;
  min_ml: number | null;
  max_ml: number | null;
  max_single_ml: number | null;  // 1회 최대 복용량 (mL)
  max_daily_ml: number | null;    // 1일 최대 복용량 (mL)
  message: string | null;
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
