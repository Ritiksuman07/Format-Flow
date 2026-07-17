'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react'
import type { CellError } from '@/types'
import { cn } from '@/lib/utils'

interface CSVPreviewProps {
  headers: string[]
  data: string[][]
  errors: CellError[]
  maxPreview?: number
}

export function CSVPreview({ headers, data, errors, maxPreview = 50 }: CSVPreviewProps) {
  const [expanded, setExpanded] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const displayData = showAll ? data : data.slice(0, maxPreview)

  const errorMap = useMemo(() => {
    const map = new Map<string, CellError>()
    for (const err of errors) {
      map.set(`${err.row}-${err.col}`, err)
    }
    return map
  }, [errors])

  const errorCols = useMemo(() => {
    const cols = new Set<number>()
    for (const err of errors) cols.add(err.col)
    return cols
  }, [errors])

  if (headers.length === 0) return null

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Preview
          </span>
          <span className="text-xs text-gray-500">
            {data.length} rows &middot; {headers.length} columns
            {errors.length > 0 && (
              <span className="ml-2 text-red-500">
                &middot; {errors.length} issues
              </span>
            )}
          </span>
        </div>
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="overflow-x-auto" ref={scrollRef}>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="sticky left-0 z-10 min-w-[3rem] bg-gray-50 px-3 py-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  #
                </th>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className={cn(
                      'min-w-[120px] whitespace-nowrap px-3 py-2 font-medium',
                      errorCols.has(idx)
                        ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                        : 'bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {errorCols.has(idx) && <AlertCircle className="h-3 w-3 text-red-500" />}
                      {header || `Column ${idx + 1}`}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/50"
                >
                  <td className="sticky left-0 z-10 bg-white px-3 py-2 text-gray-400 dark:bg-gray-900">
                    {rowIdx + 1}
                  </td>
                  {row.map((cell, colIdx) => {
                    const err = errorMap.get(`${rowIdx}-${colIdx}`)
                    return (
                      <td
                        key={colIdx}
                        className={cn(
                          'max-w-[200px] truncate px-3 py-2',
                          err
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                            : 'text-gray-700 dark:text-gray-300'
                        )}
                        title={err ? err.message : cell}
                      >
                        <div className="flex items-center gap-1">
                          {err && <AlertCircle className="shrink-0 h-3 w-3 text-red-500" />}
                          <span className="truncate">{cell}</span>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {data.length > maxPreview && (
            <div className="border-t border-gray-100 px-4 py-2 text-center dark:border-gray-800">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                {showAll ? `Show first ${maxPreview} rows` : `Show all ${data.length} rows`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
