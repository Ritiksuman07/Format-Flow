import Papa from 'papaparse'
import type { ParsedCSV } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PapaParse: any = Papa

export function parseCSV(
  content: string,
  options?: { delimiter?: string; encoding?: string }
): ParsedCSV {
  const result = PapaParse.parse(content, {
    delimiter: options?.delimiter || '',
    encoding: options?.encoding || 'UTF-8',
    header: false,
    skipEmptyLines: false,
  })

  const data = result.data as string[][]
  const headers = data.length > 0 ? data[0] : []
  const rows = data.slice(1)

  return {
    data: rows,
    headers,
    errors: (result.errors || []).map((e: { row?: number; message: string }) => ({
      row: e.row ?? -1,
      message: e.message,
    })),
    meta: {
      delimiter: result.meta.delimiter || ',',
      linebreak: result.meta.linebreak || '\n',
      aborted: result.meta.aborted || false,
      truncated: result.meta.truncated || false,
      fields: result.meta.fields || [],
    },
  }
}

export function detectDelimiter(content: string): string {
  const firstLine = content.split('\n')[0]
  const counts = {
    ',': (firstLine.match(/,/g) || []).length,
    '\t': (firstLine.match(/\t/g) || []).length,
    ';': (firstLine.match(/;/g) || []).length,
    '|': (firstLine.match(/\|/g) || []).length,
  }

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

export function detectEncoding(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) return 'UTF-8'
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return 'UTF-16LE'
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return 'UTF-16BE'
  return 'UTF-8'
}
