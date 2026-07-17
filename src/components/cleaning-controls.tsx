'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Wand2, Loader2 } from 'lucide-react'
import type { CleaningOptions } from '@/types'

interface CleaningControlsProps {
  options: CleaningOptions
  onChange: (options: CleaningOptions) => void
  onApply: () => void
  isProcessing: boolean
  hasData: boolean
}

const controls = [
  { key: 'trimWhitespace' as const, label: 'Trim whitespace', description: 'Remove extra spaces' },
  { key: 'removeDuplicates' as const, label: 'Remove duplicates', description: 'Exact duplicate rows' },
  { key: 'removeEmptyRows' as const, label: 'Remove empty rows', description: 'Rows with no data' },
  { key: 'removeEmptyColumns' as const, label: 'Remove empty columns', description: 'Columns with no data' },
  { key: 'validateEmails' as const, label: 'Validate emails', description: 'Flag invalid addresses' },
  { key: 'validatePhones' as const, label: 'Validate phones', description: 'Flag invalid numbers' },
  { key: 'validateDates' as const, label: 'Validate dates', description: 'Flag unparseable dates' },
  { key: 'validateNumbers' as const, label: 'Validate numbers', description: 'Flag non-numeric values' },
]

export function CleaningControls({ options, onChange, onApply, isProcessing, hasData }: CleaningControlsProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-900">
      <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-400">
        Cleaning options
      </h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {controls.map(({ key, label, description }) => (
          <div key={key} className="flex items-start gap-2.5">
            <Checkbox
              id={`opt-${key}`}
              checked={options[key]}
              onChange={(e) => onChange({ ...options, [key]: (e.target as HTMLInputElement).checked })}
            />
            <div className="flex flex-col">
              <label htmlFor={`opt-${key}`} className="text-sm font-medium cursor-pointer">
                {label}
              </label>
              <span className="text-xs text-zinc-400">{description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <Button onClick={onApply} disabled={!hasData || isProcessing} className="gap-2">
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" strokeWidth={1.5} />
          )}
          {isProcessing ? 'Processing…' : 'Apply cleaning'}
        </Button>
      </div>
    </div>
  )
}
