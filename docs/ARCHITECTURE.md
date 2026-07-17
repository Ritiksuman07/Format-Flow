# Architecture — CSV Cleaner + Validator

## Core Principle
**100% client-side. Zero backend.** Files never upload to a server. All processing happens in the browser using JavaScript.

This means:
- Zero hosting cost (Vercel free tier handles static + edge)
- Zero privacy concerns (files never leave user's machine)
- Zero server maintenance
- Fast page loads (static export)

## Stack
| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | Static export + server components |
| Styling | Tailwind CSS v4 | Utility-first, dark mode built-in |
| Icons | Lucide React | Lightweight, tree-shakeable |
| CSV Parsing | PapaParse | Battle-tested, handles edge cases |
| Payments | Lemon Squeezy | Multi-currency, no US entity needed |
| Deployment | Vercel (free tier) | Zero-config, automatic SSL |

## Data Flow
```
User Upload → FileReader (Browser) → PapaParse → 
  State (React useState/useReducer) → 
    Cleaning Pipeline (pure functions) → 
      Validation Engine → 
        Export (Blob + download)
```

## Component Tree
```
Layout (Header + Footer)
└── HomePage
    ├── UploadZone (drag & drop)
    ├── FileInfo (filename, rows, size)
    ├── StatsBar (duplicates, empties, errors found)
    ├── CleaningControls
    │   ├── TrimWhitespaceToggle
    │   ├── RemoveDuplicatesToggle
    │   ├── RemoveEmptyRowsToggle
    │   ├── RemoveEmptyColumnsToggle
    │   └── ValidateEmailsToggle
    ├── PreviewTable
    │   └── Row (with error highlighting)
    └── ExportButton (download cleaned CSV)
```

## State Design
```typescript
interface AppState {
  file: File | null
  rawData: string[][]       // parsed CSV rows
  cleanedData: string[][]   // after cleaning
  headers: string[]
  errors: CellError[]       // validation errors
  cleaningOptions: CleaningOptions
  stats: Stats
}
```

## Key Libraries (Custom, Zero Dependencies)

### csv-cleaner.ts
Pure functions, no dependencies:
- `trimWhitespace(data)`
- `removeDuplicates(data, keyColumns?)`
- `removeEmptyRows(data)`
- `removeEmptyColumns(data)`

### validators.ts
- `isValidEmail(value)` — regex + format check
- `isValidPhone(value)` — length + digit check  
- `isValidDate(value)` — parse check
- `isValidNumber(value)` — numeric check

## Payment Integration (Lemon Squeezy)
- Lemon Squeezy Checkout URL for Pro plan
- Webhook endpoint for subscription lifecycle
- No user auth required — use checkout email + localStorage for license check
- Multi-currency support (INR, USD, EUR, etc.)

## Deployment
```bash
git init && git add . && git commit -m "init"
vercel --prod  # or connect GitHub repo
# Add hackiom.xyz domain in Vercel dashboard
# Set LEMON_SQUEEZY_API_KEY and WEBHOOK_SECRET in Vercel env vars
```
