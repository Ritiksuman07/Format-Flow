import type { CellError } from '@/types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PHONE_REGEX = /^[+]?[\d\s()-]{7,20}$/

export function isValidEmail(value: string): boolean {
  if (!value || !value.trim()) return true
  return EMAIL_REGEX.test(value.trim())
}

export function isValidPhone(value: string): boolean {
  if (!value || !value.trim()) return true
  const cleaned = value.replace(/[\s()-]/g, '')
  return PHONE_REGEX.test(value.trim()) && cleaned.length >= 7
}

export function isValidDate(value: string): boolean {
  if (!value || !value.trim()) return true
  const parsed = Date.parse(value.trim())
  return !isNaN(parsed)
}

export function isValidNumber(value: string): boolean {
  if (!value || !value.trim()) return true
  return !isNaN(Number(value.trim())) && value.trim().length > 0
}

export function findHeaderIndex(headers: string[], keywords: string[]): number {
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim())
  for (const keyword of keywords) {
    const idx = lowerHeaders.findIndex(
      (h) => h.includes(keyword) || keyword.includes(h)
    )
    if (idx !== -1) return idx
  }
  return -1
}

export function validateData(
  data: string[][],
  headers: string[],
  options: { emails?: boolean; phones?: boolean; dates?: boolean; numbers?: boolean }
): CellError[] {
  const errors: CellError[] = []

  const emailCol = options.emails ? findHeaderIndex(headers, ['email', 'e-mail', 'mail']) : -1
  const phoneCol = options.phones ? findHeaderIndex(headers, ['phone', 'tel', 'mobile', 'cell', 'telephone']) : -1

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx]
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const value = row[colIdx]

      if (colIdx === emailCol && value && !isValidEmail(value)) {
        errors.push({ row: rowIdx, col: colIdx, type: 'email', message: `Invalid email: "${value}"` })
      }
      if (colIdx === phoneCol && value && !isValidPhone(value)) {
        errors.push({ row: rowIdx, col: colIdx, type: 'phone', message: `Invalid phone: "${value}"` })
      }
      if (options.dates && value && !isValidDate(value)) {
        errors.push({ row: rowIdx, col: colIdx, type: 'date', message: `Invalid date: "${value}"` })
      }
      if (options.numbers && value && !isValidNumber(value)) {
        errors.push({ row: rowIdx, col: colIdx, type: 'number', message: `Not a number: "${value}"` })
      }
    }
  }

  return errors
}
