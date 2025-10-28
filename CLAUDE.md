# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 pediatric antipyretic (fever reducer) dosage calculator application. It calculates appropriate dosages for 4 common Korean children's fever medications based on child's weight and age. Built with medical safety as the primary concern, following IEC 62304 medical device software safety standards.

**Critical Safety Context**: This application calculates medication dosages for children. All calculations must be accurate, validated, and defensively programmed. Data integrity validation happens at build time to prevent incorrect dosages from ever reaching production.

## Common Development Commands

### Development Server
```bash
npm run dev
```
Runs Next.js dev server with Turbopack on http://localhost:3000

### Build & Production
```bash
npm run build    # Production build (validates products.json at build time)
npm start        # Run production build
```

### Testing & Validation
```bash
npm test         # Run all Vitest tests in src/**/*.test.ts
npm run lint     # Run ESLint
```

**Important**: The build process will fail if `data/products.json` contains invalid data (e.g., ingredient-concentration mismatches). This is intentional safety behavior.

### Running Single Test File
```bash
npx vitest run src/lib/dosage-calculator.test.ts
npx vitest run src/lib/easy-drug.test.ts
```

## Core Architecture

### Medical Safety Design Principles

1. **Server-Side Data Validation**: Product data is loaded and validated server-side at build time using Zod schemas with custom refinement rules
2. **Separation of Concerns**: Pure calculation logic (`lib/dosage-calculator.ts`) is completely independent from React/UI
3. **Defensive Programming**: Runtime checks for division by zero, NaN, Infinity in all calculations
4. **Hard Age Blocks**: Children below minimum age cannot receive dosage calculation results
5. **Maximum Dosage Guards**: Calculations are capped at safe maximum single doses

### Data Flow Architecture

```
Server Component (page.tsx)
  ↓ Loads & validates data/products.json via Zod schema
  ↓ Passes validated Product[] as props
Client Component (DosageForm)
  ↓ User input validated via React Hook Form + Zod
  ↓ Submits to Zustand store action
Calculation Engine (lib/dosage-calculator.ts)
  ↓ Pure TypeScript functions (no React dependencies)
  ↓ Returns DosageResult[] with safety status
Zustand Store (store/dosage-store.ts)
  ↓ Updates global state
Client Component (DosageResultDisplay)
  ↓ Reads from Zustand with atomic selectors
  ↓ Renders results
```

### Key Architectural Constraints

**DO NOT violate these constraints - they exist for medical safety:**

1. **Server-Side Only Data Loading** (`src/app/page.tsx:8-21`): Product data MUST be loaded server-side and validated with Zod schema. Never import `products.json` directly in client components.

2. **Build-Time Validation** (`src/lib/schemas.ts:28-53`): The `productSchema` has a `.refine()` validator that checks ingredient-concentration logical consistency. This ensures wrong data cannot reach production.

3. **Pure Calculation Engine** (`src/lib/dosage-calculator.ts`): The calculation functions must remain framework-agnostic. No React hooks, no Zustand, no side effects. This enables unit testing and prevents UI bugs from affecting dosage calculations.

4. **Age Unit Transformation Location** (`src/lib/dosage-calculator.ts:66-69`): Age unit conversion (months vs years) happens INSIDE the calculation engine, not in the Zod schema. This keeps the schema pure for form validation.

5. **Atomic Zustand Selectors** (`src/store/dosage-store.ts:19-21`): Always use exported selector functions (`useDosageResults`, `useDosageStatus`, `useDosageActions`) to prevent unnecessary re-renders.

6. **CLS Prevention** (`src/app/components/DosageResultDisplay.tsx:13`): Result container has `min-h-[300px]` to reserve layout space and prevent Cumulative Layout Shift when results appear.

## Critical File Locations

### Core Logic & Types
- `src/lib/types.ts` - TypeScript type definitions (inferred from Zod schemas)
- `src/lib/schemas.ts` - Zod validation schemas with medical safety refinements
- `src/lib/dosage-calculator.ts` - Pure calculation engine (testable, framework-agnostic)
- `src/lib/constants.ts` - Calculation constants (rounding decimals, months per year)
- `src/store/dosage-store.ts` - Zustand global state with atomic selectors

### Data
- `data/products.json` - Product database (4 medications with ingredient, concentration, dosing guidelines)

### UI Components
- `src/app/page.tsx` - Server component that loads/validates product data
- `src/app/components/DosageForm.tsx` - Client component with React Hook Form validation
- `src/app/components/DosageResultDisplay.tsx` - Client component displaying results from Zustand

### API Integration
- `src/lib/easy-drug.ts` - External drug information API client (e약은요 API)
- `src/app/api/easy-drug/route.ts` - Next.js API route for drug lookup

### Tests
- `src/lib/dosage-calculator.test.ts` - Unit tests for calculation engine
- `src/lib/easy-drug.test.ts` - Unit tests for API client

## Working with Product Data

### Modifying products.json

When adding or modifying product data in `data/products.json`:

1. The build will validate ingredient-concentration consistency via `productSchema.refine()`
2. Valid combinations:
   - 아세트아미노펜 (acetaminophen): 32 or 16 mg/mL
   - 이부프로펜 (ibuprofen): 20 mg/mL
   - 덱시부프로펜 (dexibuprofen): 12 mg/mL
3. Run `npm run build` to validate changes before committing
4. If validation fails, the build will crash with a clear error message

### Adding New Medications

1. Add entry to `data/products.json` with all required fields
2. If using a new ingredient, update the refinement rule in `src/lib/schemas.ts:28-53`
3. Add test cases to `src/lib/dosage-calculator.test.ts`
4. Run `npm test && npm run build` to validate

## Testing Guidelines

### Unit Testing Focus Areas

1. **Calculation Accuracy**: Test weight × dose_mg_per_kg calculations
2. **Rounding Behavior**: Verify 0.1mL rounding (5.24 → 5.2, 5.25 → 5.3)
3. **Safety Guards**: Test age blocks, max dosage caps, division by zero
4. **Edge Cases**: Test with concentration=0, NaN, Infinity, negative values
5. **Age Unit Conversion**: Test months vs years conversion (18개월 vs 1세6개월)

### Test Isolation

Tests in `src/lib/*.test.ts` should use fixture data, not actual `products.json`. This prevents product data changes from breaking tests.

## External API Integration

The application integrates with "e약은요" (Easy Drug) API for additional drug information:

- API key stored in `process.env.EASY_DRUG_API_KEY` (server-side only)
- Client requests `/api/easy-drug` which proxies to the external API
- HTML content is sanitized (BR tags preserved, all other tags stripped)
- Never use `dangerouslySetInnerHTML` - render as plain text with preserved newlines

## UI Component Conventions

### Styling
- Pure Tailwind CSS (no CSS modules, no styled-components)
- Custom UI components in `src/app/components/ui/` (Button, Input, Card, Alert)
- Pre-built shadcn-ui components in `src/components/ui/` for complex components

### Form Handling
- React Hook Form with Zod resolver for validation
- `mode: 'onBlur'` to optimize INP (Interaction to Next Paint) performance
- `type="tel"` and `inputMode="decimal"/"numeric"` for mobile number keyboards

### State Management
- Local form state: React Hook Form
- Global calculation state: Zustand with atomic selectors
- Server state (if needed): React Query

## Performance Optimizations

### Core Web Vitals Focus
- **CLS (Cumulative Layout Shift)**: Result container pre-allocates space with `min-h-[300px]`
- **INP (Interaction to Next Paint)**: Form validation uses `mode: 'onBlur'` to avoid excessive onChange validations
- **LCP (Largest Contentful Paint)**: No images in critical path, only text content

### Mobile Optimizations
- `inputMode="decimal"` for weight input (iOS/Android decimal keyboards)
- `inputMode="numeric"` for age input (integer keyboards)
- `type="tel"` prevents desktop browser number spinners while enabling mobile keyboards

## Important Development Notes

1. **Never bypass validation**: The Zod schemas and refinement rules exist for medical safety
2. **Test calculations thoroughly**: Medication dosing errors can harm children
3. **Preserve defensive checks**: All `Number.isFinite()` and division-by-zero guards are required
4. **Build before commit**: Always run `npm run build` to catch data validation issues
5. **Korean text encoding**: Verify UTF-8 encoding after generating code with Korean text
6. **Use client directive**: Most UI components require `'use client'` directive at top
7. **Server vs Client**: Be explicit about which components are server vs client components

## Adding New Features

### If adding new UI components:
1. Check if shadcn-ui has a suitable component first
2. If custom component needed, follow the pattern in `src/app/components/ui/`
3. Use `React.forwardRef` for components that need refs (form inputs)
4. Apply Tailwind classes with clear readability

### If modifying calculation logic:
1. Update `src/lib/dosage-calculator.ts` (keep it pure/testable)
2. Add corresponding tests in `src/lib/dosage-calculator.test.ts`
3. Update types in `src/lib/types.ts` if needed
4. Run full test suite before committing

### If adding new API routes:
1. Place in `src/app/api/[route-name]/route.ts`
2. Read sensitive keys from `process.env` only (never expose to client)
3. Validate request parameters with Zod schemas
4. Return typed responses with appropriate HTTP status codes
