export interface CellError {
  row: number
  col: number
  type: 'email' | 'phone' | 'date' | 'number' | 'empty'
  message: string
}

export interface CleaningOptions {
  trimWhitespace: boolean
  removeDuplicates: boolean
  removeEmptyRows: boolean
  removeEmptyColumns: boolean
  validateEmails: boolean
  validatePhones: boolean
  validateDates: boolean
  validateNumbers: boolean
}

export interface Stats {
  originalRows: number
  cleanedRows: number
  duplicatesRemoved: number
  emptyRowsRemoved: number
  emptyColumnsRemoved: number
  cellsTrimmed: number
  errorsFound: number
}

export interface ParsedCSV {
  data: string[][]
  headers: string[]
  errors: { row: number; message: string }[]
  meta: {
    delimiter: string
    linebreak: string
    aborted: boolean
    truncated: boolean
    fields: string[]
  }
}

export type PlanTier = 'free' | 'pro'

export interface Subscription {
  tier: PlanTier
  status: 'active' | 'expired' | 'cancelled' | 'never' | 'pending'
  razorpaySubscriptionId: string | null
  razorpayPaymentId: string | null
  customerEmail: string | null
  customerName: string | null
  renewsAt: string | null
  startedAt: string | null
  updatedAt: string | null
}

export interface UsageRecord {
  rowsProcessed: number
  filesProcessed: number
  lastFileDate: string | null
  month: string
}

export const SUBSCRIPTION_KEY = 'csv-cleaner-subscription'
export const USAGE_KEY = 'csv-cleaner-usage'
export const FREE_ROW_LIMIT = 10000
export const PRO_ROW_LIMIT = Infinity
export const FREE_FILE_SIZE_LIMIT = 50 * 1024 * 1024
export const PRO_FILE_SIZE_LIMIT = 500 * 1024 * 1024

export interface PriceDisplay {
  currency: string
  symbol: string
  monthly: number
  yearly: number
  locale: string
}

export const PRICES: PriceDisplay[] = [
  { currency: 'USD', symbol: '$', monthly: 2, yearly: 13, locale: 'en-US' },
  { currency: 'INR', symbol: '₹', monthly: 1249, yearly: 12499, locale: 'en-IN' },
  { currency: 'EUR', symbol: '€', monthly: 14, yearly: 140, locale: 'de-DE' },
  { currency: 'GBP', symbol: '£', monthly: 12, yearly: 119, locale: 'en-GB' },
]
