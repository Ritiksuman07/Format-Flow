'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/lib/utils'
import { CheckCircle2, Trash2, Scan, AlertTriangle } from 'lucide-react'
import type { Stats } from '@/types'

interface StatsCardProps {
  stats: Stats | null
}

export function StatsCard({ stats }: StatsCardProps) {
  if (!stats) return null

  const items = [
    { label: 'Original rows', value: formatNumber(stats.originalRows), icon: Scan, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Cleaned rows', value: formatNumber(stats.cleanedRows), icon: CheckCircle2, color: 'text-green-600 dark:text-green-400' },
    { label: 'Duplicates removed', value: formatNumber(stats.duplicatesRemoved), icon: Trash2, color: 'text-orange-600 dark:text-orange-400' },
    { label: 'Empty rows removed', value: formatNumber(stats.emptyRowsRemoved), icon: Trash2, color: 'text-red-600 dark:text-red-400' },
    { label: 'Cells trimmed', value: formatNumber(stats.cellsTrimmed), icon: Scan, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Issues found', value: formatNumber(stats.errorsFound), icon: AlertTriangle, color: 'text-red-600 dark:text-red-400' },
  ]

  const totalIssues = stats.duplicatesRemoved + stats.emptyRowsRemoved + stats.emptyColumnsRemoved + stats.errorsFound

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Results</h3>
          {totalIssues > 0 && (
            <Badge variant={totalIssues > 10 ? 'danger' : 'warning'}>
              {formatNumber(totalIssues)} issues fixed
            </Badge>
          )}
          {totalIssues === 0 && stats.cleanedRows > 0 && (
            <Badge variant="success">Clean data</Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className={`h-4 w-4 shrink-0 ${color}`} />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 truncate">{label}</p>
                <p className={`text-sm font-semibold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
