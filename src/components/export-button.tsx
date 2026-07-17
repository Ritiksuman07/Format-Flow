'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  onExport: () => void
  disabled: boolean
  rowCount?: number
}

export function ExportButton({ onExport, disabled, rowCount }: ExportButtonProps) {
  return (
    <Button
      onClick={onExport}
      disabled={disabled}
      size="lg"
      className="w-full gap-2 sm:w-auto"
    >
      <Download className="h-5 w-5" />
      Download Cleaned CSV
      {rowCount !== undefined && rowCount > 0 && (
        <span className="ml-1 text-blue-200">({rowCount} rows)</span>
      )}
    </Button>
  )
}
