'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { AGE_INPUT_STEP, WEIGHT_INPUT_STEP } from '@/lib/constants';
import { dosageInputSchema } from '@/lib/schemas';
import type { DosageInput, Product } from '@/lib/types';
import { useDosageActions } from '@/store/dosage-store';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

type DosageFormProps = {
  products: Product[];
};

export default function DosageForm({ products }: DosageFormProps) {
  const { calculateAllDosages } = useDosageActions();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DosageInput>({
    resolver: zodResolver(dosageInputSchema),
    defaultValues: {
      ageUnit: 'months',
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<DosageInput> = (data) => {
    calculateAllDosages(data, products);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="weight"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          체중 (kg)
        </label>
        <Input
          id="weight"
          type="tel"
          inputMode="decimal"
          step={WEIGHT_INPUT_STEP}
          placeholder="예: 10.5"
          {...register('weight', { valueAsNumber: true })}
        />
        {errors.weight && (
          <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
        )}
      </div>

      <div className="flex space-x-2">
        <div className="flex-1">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            나이
          </label>
          <Input
            id="age"
            type="tel"
            inputMode="numeric"
            step={AGE_INPUT_STEP}
            placeholder="예: 18"
            {...register('age', { valueAsNumber: true })}
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="ageUnit"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            단위
          </label>
          <select
            id="ageUnit"
            {...register('ageUnit')}
            className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="months">개월</option>
            <option value="years">세(만나이)</option>
          </select>
        </div>
      </div>
      {errors.age && (
        <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
      )}
      {errors.ageUnit && (
        <p className="mt-1 text-sm text-red-600">{errors.ageUnit.message}</p>
      )}

      <Button type="submit" className="text-lg">
        계산하기
      </Button>
    </form>
  );
}
