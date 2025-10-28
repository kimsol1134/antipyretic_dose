import { create } from 'zustand';
import { calculateAllDosages as engine } from '@/lib/dosage-calculator';
import type { DosageInput, DosageStoreState, Product } from '@/lib/types';

export const useDosageStore = create<DosageStoreState>((set) => ({
  results: [],
  status: 'idle',
  actions: {
    calculateAllDosages: (input: DosageInput, products: Product[]) => {
      const newResults = engine(input, products);
      set({ results: newResults, status: 'calculated' });
    },
    clearResults: () => {
      set({ results: [], status: 'idle' });
    },
  },
}));

export const useDosageResults = () => useDosageStore((state) => state.results);
export const useDosageStatus = () => useDosageStore((state) => state.status);
export const useDosageActions = () => useDosageStore((state) => state.actions);
