'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { AGE_INPUT_STEP, WEIGHT_INPUT_STEP, MAX_WEIGHT_KG } from '@/lib/constants';
import type { DosageInput, IngredientKey, Product } from '@/lib/types';
import { useDosageActions } from '@/store/dosage-store';
import { trackDosageCalculation } from '@/lib/analytics';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

type DosageFormProps = {
  products: Product[];
};

const formSchema = z
  .object({
    weight: z
      .number({ invalid_type_error: '체중을 숫자로 입력하세요.' })
      .positive('체중은 0보다 커야 합니다.')
      .max(MAX_WEIGHT_KG, '비정상적인 체중입니다. 다시 확인해주세요.'),
    age: z
      .number({ invalid_type_error: '나이를 숫자로 입력하세요.' })
      .int()
      .positive('나이는 0보다 커야 합니다.'),
    ageUnit: z.enum(['months', 'years']),
    lastDoseIngredient: z
      .union([z.enum(['acetaminophen', 'ibuprofen', 'dexibuprofen']), z.literal('')])
      .optional(),
    lastDoseAt: z.string().optional(),
  })
  .refine(
    (data) => {
      const hasIng = Boolean(data.lastDoseIngredient);
      const hasTime = Boolean(data.lastDoseAt);
      return hasIng === hasTime;
    },
    {
      message: '성분과 시각을 함께 입력해주세요.',
      path: ['lastDoseAt'],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export default function DosageForm({ products }: DosageFormProps) {
  const t = useTranslations('form');
  const tLast = useTranslations('form.lastDose');
  const { calculateAllDosages } = useDosageActions();
  const [lastDoseOpen, setLastDoseOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ageUnit: 'months',
      lastDoseIngredient: '',
      lastDoseAt: '',
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const base: DosageInput = {
      weight: data.weight,
      age: data.age,
      ageUnit: data.ageUnit,
    };

    const ingredient = data.lastDoseIngredient;
    const timeStr = data.lastDoseAt;
    const hasLastDose =
      lastDoseOpen &&
      ingredient !== undefined &&
      ingredient !== '' &&
      timeStr !== undefined &&
      timeStr !== '';

    const withLastDose: DosageInput = hasLastDose
      ? {
          ...base,
          lastDoseIngredient: ingredient as IngredientKey,
          lastDoseAtMs: new Date(timeStr as string).getTime(),
        }
      : base;

    calculateAllDosages(withLastDose, products);
    trackDosageCalculation(data.weight, data.age, data.ageUnit, products.length);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="weight"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('weight.label')}
        </label>
        <Input
          id="weight"
          type="tel"
          inputMode="decimal"
          step={WEIGHT_INPUT_STEP}
          placeholder={t('weight.placeholder')}
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
            {t('age.label')}
          </label>
          <Input
            id="age"
            type="tel"
            inputMode="numeric"
            step={AGE_INPUT_STEP}
            placeholder={t('age.placeholder')}
            {...register('age', { valueAsNumber: true })}
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="ageUnit"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t('age.unitLabel')}
          </label>
          <select
            id="ageUnit"
            {...register('ageUnit')}
            className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="months">{t('age.unit.months')}</option>
            <option value="years">{t('age.unit.years')}</option>
          </select>
        </div>
      </div>
      {errors.age && (
        <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
      )}
      {errors.ageUnit && (
        <p className="mt-1 text-sm text-red-600">{errors.ageUnit.message}</p>
      )}

      <div className="border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => setLastDoseOpen((prev) => !prev)}
          className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none"
          aria-expanded={lastDoseOpen}
          aria-controls="last-dose-section"
        >
          {lastDoseOpen ? tLast('hide') : tLast('toggle')}
        </button>

        {lastDoseOpen && (
          <div id="last-dose-section" className="mt-4 space-y-4 bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600">{tLast('description')}</p>
            <div>
              <label
                htmlFor="lastDoseIngredient"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {tLast('ingredientLabel')}
              </label>
              <select
                id="lastDoseIngredient"
                {...register('lastDoseIngredient')}
                className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{tLast('ingredientPlaceholder')}</option>
                <option value="acetaminophen">{tLast('ingredient.acetaminophen')}</option>
                <option value="ibuprofen">{tLast('ingredient.ibuprofen')}</option>
                <option value="dexibuprofen">{tLast('ingredient.dexibuprofen')}</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="lastDoseAt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {tLast('timeLabel')}
              </label>
              <input
                id="lastDoseAt"
                type="datetime-local"
                {...register('lastDoseAt')}
                className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.lastDoseAt && (
                <p className="mt-1 text-sm text-red-600">{errors.lastDoseAt.message}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <Button type="submit" className="text-lg">
        {t('submit')}
      </Button>
    </form>
  );
}
