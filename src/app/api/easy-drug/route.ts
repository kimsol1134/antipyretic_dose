'use server';

import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  EasyDrugItem,
  fetchEasyDrugList,
  filterSimilarItems,
} from '@/lib/easy-drug';

const querySchema = z.object({
  ingredient: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
  itemName: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
  strengthMgPerMl: z.string().optional(),
  limit: z.string().optional(),
});

function validateQueries(params: URLSearchParams) {
  const candidate = {
    ingredient: params.get('ingredient') ?? undefined,
    itemName: params.get('itemName') ?? undefined,
    strengthMgPerMl: params.get('strengthMgPerMl') ?? undefined,
    limit: params.get('limit') ?? undefined,
  };
  const parsed = querySchema.safeParse(candidate);
  if (!parsed.success) {
    throw new Error('Invalid query parameters');
  }
  const { ingredient, itemName, strengthMgPerMl, limit } = parsed.data;

  if (!ingredient && !itemName) {
    throw new Error('Either ingredient or itemName is required');
  }

  const numericStrength =
    strengthMgPerMl !== undefined ? Number(strengthMgPerMl) : undefined;
  if (numericStrength !== undefined && !Number.isFinite(numericStrength)) {
    throw new Error('strengthMgPerMl must be a valid number');
  }

  const numericLimit = limit !== undefined ? Number(limit) : undefined;
  if (numericLimit !== undefined && !Number.isFinite(numericLimit)) {
    throw new Error('limit must be a valid number');
  }

  return {
    ingredient,
    itemName,
    strengthMgPerMl: numericStrength,
    limit: numericLimit,
  };
}

function applyLimit(items: EasyDrugItem[], limit?: number) {
  if (!limit || limit <= 0) {
    return items;
  }
  return items.slice(0, limit);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { ingredient, itemName, strengthMgPerMl, limit } =
      validateQueries(url.searchParams);

    const apiResponse = await fetchEasyDrugList({
      itemName: itemName ?? ingredient,
      ingredient,
      pageSize: 100,
    });

    const filtered = filterSimilarItems(apiResponse.items, {
      ingredient: ingredient ?? itemName,
      strengthMgPerMl,
      tolerance: 0.5,  // 반올림 오차 허용
      childrenOnly: true,  // 어린이용 약품만
    });

    const limited = applyLimit(filtered, limit);

    return NextResponse.json(
      {
        items: limited,
        totalCount: apiResponse.totalCount,
        filteredCount: filtered.length,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('[easy-drug] API route failed', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to fetch easy drug data',
      },
      { status: 400 }
    );
  }
}
