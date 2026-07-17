'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CSVUploaderProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
}

export function CSVUploader({ onFileSelect, isLoading }: CSVUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.tsv') && !file.name.endsWith('.txt')) {
        alert('Please select a CSV file')
        return
      }
      setSelectedFile(file)
      onFileSelect(file)
    },
    [onFileSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const clearFile = useCallback(() => {
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !selectedFile && inputRef.current?.click()}
      className={cn(
        'relative cursor-pointer rounded-2xl border border-dashed p-10 text-center transition-all duration-200',
        dragOver
          ? 'border-indigo-400 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20'
          : selectedFile
            ? 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-700 dark:bg-emerald-950/10'
            : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.tsv,.txt"
        onChange={handleChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium">{selectedFile.name}</p>
          <p className="text-xs text-zinc-400">
            {(selectedFile.size / 1024).toFixed(1)} KB
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); clearFile() }}
            className="mt-1 flex items-center gap-1 text-xs text-zinc-400 hover:text-red-500"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <Upload className={cn('h-5 w-5 text-zinc-500', isLoading && 'animate-bounce')} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Drop your CSV here
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">or click to browse · up to 50MB</p>
          </div>
        </div>
      )}
    </div>
  )
}
