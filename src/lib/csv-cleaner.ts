import type { Stats, CleaningOptions } from '@/types'

export function trimWhitespace(data: string[][]): { result: string[][]; trimmed: number } {
  let trimmed = 0
  const result = data.map((row) =>
    row.map((cell) => {
      const trimmed_cell = cell.trim()
      if (trimmed_cell !== cell) trimmed++
      return trimmed_cell
    })
  )
  return { result, trimmed }
}

export function removeDuplicates(data: string[][]): { result: string[][]; removed: number } {
  const seen = new Set<string>()
  const result: string[][] = []
  let removed = 0

  for (const row of data) {
    const key = row.join('||')
    if (seen.has(key)) {
      removed++
    } else {
      seen.add(key)
      result.push(row)
    }
  }

  return { result, removed }
}

export function removeEmptyRows(data: string[][]): { result: string[][]; removed: number } {
  const result: string[][] = []
  let removed = 0

  for (const row of data) {
    const isEmpty = row.every((cell) => !cell || !cell.trim())
    if (isEmpty) {
      removed++
    } else {
      result.push(row)
    }
  }

  return { result, removed }
}

export function removeEmptyColumns(data: string[][]): { result: string[][]; removed: number } {
  if (data.length === 0) return { result: data, removed: 0 }

  const colCount = data[0].length
  const keepCol = new Array(colCount).fill(false)

  for (const row of data) {
    for (let col = 0; col < colCount; col++) {
      if (row[col] && row[col].trim()) {
        keepCol[col] = true
      }
    }
  }

  const removed = keepCol.filter((k) => !k).length
  const result = data.map((row) => row.filter((_, idx) => keepCol[idx]))

  return { result, removed }
}

export function applyCleaning(
  data: string[][],
  options: CleaningOptions
): { data: string[][]; stats: Stats } {
  let working = data.map((row) => [...row])

  const stats: Stats = {
    originalRows: data.length,
    cleanedRows: data.length,
    duplicatesRemoved: 0,
    emptyRowsRemoved: 0,
    emptyColumnsRemoved: 0,
    cellsTrimmed: 0,
    errorsFound: 0,
  }

  if (options.removeEmptyColumns) {
    const r = removeEmptyColumns(working)
    working = r.result
    stats.emptyColumnsRemoved = r.removed
  }

  if (options.removeEmptyRows) {
    const r = removeEmptyRows(working)
    working = r.result
    stats.emptyRowsRemoved = r.removed
  }

  if (options.removeDuplicates) {
    const r = removeDuplicates(working)
    working = r.result
    stats.duplicatesRemoved = r.removed
  }

  if (options.trimWhitespace) {
    const r = trimWhitespace(working)
    working = r.result
    stats.cellsTrimmed = r.trimmed
  }

  stats.cleanedRows = working.length
  return { data: working, stats }
}
