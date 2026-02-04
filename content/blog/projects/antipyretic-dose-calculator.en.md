---
title: Children's Fever Medicine Dosage Calculator - Medical Safety-First Next.js Application
date: 2025-11-16
tags: [Next.js, React, TypeScript, Zod, Zustand]
excerpt: A medical safety-first web application for calculating accurate pediatric antipyretic dosages
thumbnail: https://picsum.photos/seed/antipyretic-dose/800/600
---

## Project Overview

When a child has a fever, one of the biggest worries for any parent is: "How much fever medicine should I give?" Different products have different concentrations, and dosing varies by weight, making mistakes all too easy. This project was built to solve that problem.

The Children's Fever Medicine Dosage Calculator helps parents safely calculate accurate doses for common pediatric antipyretics -- Tylenol, Champ, Ibuprofen (Motrin/Advil), and Dexibuprofen -- based on the child's weight and age. The application follows defensive programming principles and build-time data validation, guided by the IEC 62304 medical device software safety standard.

The core goals of this project are **accuracy** and **safety**. Even a small error in pediatric medication dosing can lead to serious consequences, so every calculation path is protected by multiple safety guards.

## Key Features

### 1. Weight-Based Accurate Dose Calculation
Enter a child's weight and the calculator provides the recommended minimum-to-maximum dose range in mL for each product, based on its mg/kg dosing guidelines. For example, for a 33lb (15kg) child using Children's Tylenol (32mg/mL), the calculator displays a range of 4.7-7.0mL.

### 2. Multiple Safety Guards
- **Age restriction**: Automatically blocks dosing for children under 4 months (acetaminophen) or under 6 months (ibuprofen)
- **Maximum dose cap**: Automatically limits the calculated dose to the single-dose maximum
- **Daily maximum warning**: For ibuprofen-class medications, enforces a 25mL cap for children under 30kg

### 3. Multilingual Support
The application supports Korean and English, displaying market-appropriate products for each language. The English version shows only FDA-approved products (Tylenol, Advil, Motrin), while the Korean version includes locally available medications.

### 4. Similar Drug Information
Integrates with the Korean "Easy Drug" public API to provide information about other branded products with the same active ingredient and concentration.

## Tech Stack

- **Frontend**: Next.js 15.1, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (atomic selectors)
- **Form Handling**: React Hook Form + Zod
- **Data Validation**: Zod schemas with custom refinements
- **Testing**: Vitest
- **Internationalization**: next-intl
- **Animation**: Framer Motion
- **Build Tools**: Turbopack

## Architecture

```
[Server Component]
    | Load products.json + Zod validation
    | Filter by locale/market
[Client: DosageForm]
    | React Hook Form + Zod validation
    | Dispatch to Zustand action
[Pure Engine: dosage-calculator.ts]
    | Weight x mg/kg calculation
    | Safety checks (age_block, max_cap, NaN/Infinity)
[Zustand Store]
    | Update global state
[Client: DosageResultDisplay]
    | Render results via atomic selectors
```

The core design principle is **separation of concerns**. The calculation logic (`dosage-calculator.ts`) is completely independent of React and state management libraries, enabling pure-function unit testing and preventing UI bugs from affecting dosage calculations.

## Key Implementation Details

### 1. Build-Time Data Validation

In medical software, the most critical requirement is ensuring that incorrect data never reaches production. A custom Zod schema refinement validates the logical consistency between active ingredient names and their concentrations.

```typescript
.refine(
  (data) => {
    const { ingredient, strength_mg_per_ml } = data;
    const expectedStrengths =
      INGREDIENT_STRENGTH_MAP[ingredient];
    if (expectedStrengths) {
      return expectedStrengths.includes(strength_mg_per_ml);
    }
    return true;
  },
  {
    message: 'Ingredient-concentration mismatch detected.',
  }
)
```

Only valid combinations are permitted: acetaminophen (32mg/mL or 50mg/mL), ibuprofen (20mg/mL), dexibuprofen (12mg/mL). Any invalid combination causes the build to fail immediately.

### 2. Defensive Dose Calculation

Every calculation path checks for infinite values, NaN, and division by zero.

```typescript
// Concentration validation
if (product.strength_mg_per_ml <= 0) {
  return { status: 'error', message: 'Product data error' };
}

// Finiteness validation
if (!Number.isFinite(recommendedMl) ||
    !Number.isFinite(maxMl)) {
  return { status: 'error', message: 'Calculation error' };
}

// Maximum dose cap
if (maxMg > product.max_single_mg) {
  maxMg = product.max_single_mg;
  statusMessage = 'Adjusted to single-dose maximum';
}
```

### 3. Market-Based Product Filtering

Each product in `products.json` includes a `markets` array, and the server component filters products based on the user's locale.

```typescript
const marketKey = locale === 'en' ? 'en' : 'ko';
const filteredProducts = allProducts.filter((product) =>
  product.markets.includes(marketKey)
);
```

This ensures that non-FDA-approved ingredients (e.g., dexibuprofen) are never shown to English-market users, enforcing regulatory compliance at the schema level.

## Development Process

The project's Git history reveals its evolution:

1. **Initial setup** (cf817c2): Core calculation logic and basic UI
2. **SEO optimization** (94d23d1~): FAQ pages, metadata improvements
3. **Multilingual expansion** (d0c81bb~f70f95c): next-intl integration, English translations, US market products
4. **Monetization** (9743392): About, Privacy, and Terms pages for AdSense approval
5. **Search optimization** (0f148cb~4c51cb3): Search engine crawler optimization, sitemap improvements
6. **Growth strategy** (778cd64): Marketing growth strategy documentation

A total of 13 Pull Requests were merged, each with a clearly defined purpose and scope.

## Results and Outcomes

### Quantitative Results
- 7 product data entries (5 Korean market, 3 US market)
- 2 languages supported (Korean, English)
- 100% TypeScript type coverage
- Build-time data validation via Zod schemas

### Qualitative Results
- Gained hands-on experience with the strict safety requirements of medical software development
- Applied defensive programming patterns in a real-world use case
- Learned the importance of accounting for cultural and regulatory differences (FDA approval status) in multilingual applications

## Future Plans

1. **Real-time drug interaction checking**: Automatic detection of ingredient overlap with cold medicines
2. **Dosing history tracking**: Record last dose time and notify when the next dose is safe
3. **Healthcare provider integration**: Guide to nearest hospital or pharmacy when symptoms warrant medical attention
4. **Expanded product coverage**: Extension to additional markets across Asia

## Links

- [GitHub Repository](https://github.com/kimsol1134/antipyretic_dose)
