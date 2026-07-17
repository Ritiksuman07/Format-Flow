export function csvEncodeRow(row: string[], delimiter: string = ','): string {
  return row
    .map((cell) => {
      const str = String(cell)
      if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    })
    .join(delimiter)
}

export function generateCSV(
  headers: string[],
  data: string[][],
  delimiter: string = ','
): string {
  const lines: string[] = []
  lines.push(csvEncodeRow(headers, delimiter))
  for (const row of data) {
    lines.push(csvEncodeRow(row, delimiter))
  }
  return lines.join('\n')
}

export function downloadCSV(
  headers: string[],
  data: string[][],
  filename: string = 'cleaned-data.csv'
): void {
  const csv = generateCSV(headers, data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
