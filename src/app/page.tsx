'use client'

import { useState, useCallback } from 'react'
import { Header } from '@/components/header'
import { CSVUploader } from '@/components/csv-uploader'
import { CSVPreview } from '@/components/csv-preview'
import { CleaningControls } from '@/components/cleaning-controls'
import { StatsCard } from '@/components/stats-card'
import { ExportButton } from '@/components/export-button'
import { PricingSection } from '@/components/pricing-cards'
import { UpgradePrompt } from '@/components/upgrade-prompt'
import { parseCSV } from '@/lib/csv-parser'
import { applyCleaning } from '@/lib/csv-cleaner'
import { validateData } from '@/lib/validators'
import { downloadCSV } from '@/lib/export'
import { canProcessRows, canProcessFile, recordUsage, isPro } from '@/lib/subscription'
import type { CleaningOptions, CellError, Stats, ParsedCSV } from '@/types'
import {
  Shield, Zap, Lock, ArrowDown, Upload, Sparkles, Star,
  Users, FileText, CheckCircle, ChevronRight, ArrowRight,
} from 'lucide-react'

const defaultOptions: CleaningOptions = {
  trimWhitespace: true,
  removeDuplicates: true,
  removeEmptyRows: true,
  removeEmptyColumns: false,
  validateEmails: true,
  validatePhones: false,
  validateDates: false,
  validateNumbers: false,
}

const floatingSymbols = [
  { symbol: '</>', x: '5%', y: '15%', delay: '0s', size: '1.2rem' },
  { symbol: '{ }', x: '90%', y: '20%', delay: '1s', size: '1rem' },
  { symbol: '#!', x: '8%', y: '60%', delay: '2s', size: '0.9rem' },
  { symbol: 'CSV', x: '85%', y: '55%', delay: '0.5s', size: '1.1rem' },
  { symbol: '✧', x: '15%', y: '40%', delay: '1.5s', size: '1.8rem' },
  { symbol: '✦', x: '75%', y: '70%', delay: '3s', size: '1.4rem' },
  { symbol: '△', x: '50%', y: '12%', delay: '2.5s', size: '1rem' },
  { symbol: '◇', x: '92%', y: '80%', delay: '0.8s', size: '1.2rem' },
  { symbol: '○', x: '3%', y: '80%', delay: '1.8s', size: '1.5rem' },
  { symbol: '□', x: '60%', y: '85%', delay: '1.2s', size: '1rem' },
]

const trustStats = [
  { icon: Users, value: '10K+', label: 'Active users' },
  { icon: FileText, value: '1M+', label: 'Rows cleaned' },
  { icon: Star, value: '4.9', label: 'User rating' },
  { icon: CheckCircle, value: '100%', label: 'Browser-based' },
]

const testimonials = [
  {
    quote: 'Saved me hours of manual cleanup. The email validation alone is worth it.',
    author: 'Sarah K.',
    role: 'Marketing Manager',
  },
  {
    quote: 'Finally a CSV tool that respects privacy. No upload, no worries.',
    author: 'Raj M.',
    role: 'Data Analyst',
  },
  {
    quote: 'Dedupe and trim in one click. My new go-to tool for CSV cleanup.',
    author: 'Alex P.',
    role: 'Freelancer',
  },
]

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [parsed, setParsed] = useState<ParsedCSV | null>(null)
  const [cleanedData, setCleanedData] = useState<string[][] | null>(null)
  const [options, setOptions] = useState<CleaningOptions>(defaultOptions)
  const [errors, setErrors] = useState<CellError[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [blockReason, setBlockReason] = useState<string | null>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    const fileCheck = canProcessFile(file.size)
    if (!fileCheck.allowed) {
      setBlockReason('File exceeds 50MB limit. Pro supports up to 500MB.')
      setShowUpgrade(true)
      return
    }

    setShowUpgrade(false)
    setBlockReason(null)
    setFile(file)
    setCleanedData(null)
    setErrors([])
    setStats(null)

    const text = await file.text()
    const parsedResult = parseCSV(text)
    setParsed(parsedResult)
    setCleanedData(parsedResult.data)

    const rowCheck = canProcessRows(parsedResult.data.length)
    if (!rowCheck.allowed) {
      setBlockReason(
        `${parsedResult.data.length.toLocaleString()} rows exceeds the free limit of ${rowCheck.limit.toLocaleString()}. Upgrade for unlimited.`
      )
      setShowUpgrade(true)
    }
  }, [])

  const handleApplyCleaning = useCallback(() => {
    if (!parsed || !cleanedData) return

    const rowCheck = canProcessRows(cleanedData.length)
    if (!rowCheck.allowed) {
      setShowUpgrade(true)
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const cleaned = applyCleaning(cleanedData, options)
      const validationErrors = validateData(cleaned.data, parsed.headers, {
        emails: options.validateEmails,
        phones: options.validatePhones,
        dates: options.validateDates,
        numbers: options.validateNumbers,
      })

      setCleanedData(cleaned.data)
      setErrors(validationErrors)
      setStats({ ...cleaned.stats, errorsFound: validationErrors.length })
      recordUsage(cleaned.stats.originalRows)
      setIsProcessing(false)
    }, 100)
  }, [parsed, cleanedData, options])

  const handleExport = useCallback(() => {
    if (!parsed || !cleanedData) return
    const base = file?.name.replace(/\.csv$/, '') || 'cleaned-data'
    downloadCSV(parsed.headers, cleanedData, `${base}-cleaned.csv`)
  }, [parsed, cleanedData, file])

  const hasPro = isPro()
  const rowCount = parsed?.data.length || 0
  const isRowLimited = !hasPro && rowCount > 10000

  return (
    <>
      {/* Background decorative elements */}
      <div className="bg-orbs">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {floatingSymbols.map((s, i) => (
        <div
          key={i}
          className="bg-symbol animate-float-slow"
          style={{
            left: s.x,
            top: s.y,
            fontSize: s.size,
            animationDelay: s.delay,
            opacity: 0.12,
          }}
        >
          {s.symbol}
        </div>
      ))}

      <Header />

      <main className="relative mx-auto max-w-5xl px-4 z-10">
        {/* Hero */}
        <section className="relative py-16 text-center md:py-24">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative">
            <div className="animate-slide-up">
              <span className="promo-badge mb-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-200/60 bg-indigo-50/80 px-3.5 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
                <Sparkles className="h-3 w-3" />
                Free · No signup · 100% private
              </span>
            </div>

            <h1 className="animate-slide-up animate-slide-up-delay-1 mx-auto max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-5xl md:leading-[1.1]">
              Your messy CSV files{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                cleaned in seconds
              </span>
            </h1>

            <p className="animate-slide-up animate-slide-up-delay-2 mx-auto mt-4 max-w-xl text-base text-zinc-500 dark:text-zinc-400">
              Remove duplicates, trim whitespace, validate emails & phones — all in your browser.
              <span className="block mt-1 font-medium text-zinc-700 dark:text-zinc-300">
                Zero uploads. Zero servers. Zero risk.
              </span>
            </p>

            <div className="animate-slide-up animate-slide-up-delay-3 mt-8 flex flex-wrap justify-center gap-6 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-indigo-400" /> Privacy-first</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-indigo-400" /> Lightning fast</span>
              <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-indigo-400" /> No signup needed</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-indigo-400" /> 100% free tier</span>
            </div>

            <div className="animate-slide-up animate-slide-up-delay-4 mt-10 flex flex-wrap justify-center gap-3">
              <a
                href="#tool"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-md active:scale-[0.97]"
              >
                Try it now — it&apos;s free
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
              >
                See how it works
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="animate-slide-up pb-6">
          <div className="rounded-2xl border border-zinc-200/60 bg-white/50 px-6 py-5 dark:border-zinc-800/60 dark:bg-zinc-900/30">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {trustStats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center justify-center gap-3 md:justify-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
                    <Icon className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{value}</p>
                    <p className="text-[11px] text-zinc-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tool */}
        <section id="tool" className="pb-20">
          <div className="space-y-5">
            <CSVUploader onFileSelect={handleFileSelect} />

            {showUpgrade && blockReason && (
              <UpgradePrompt reason={blockReason} onDismiss={() => setShowUpgrade(false)} />
            )}

            {parsed && cleanedData && !isRowLimited && (
              <div className="space-y-5 animate-in">
                <CleaningControls
                  options={options}
                  onChange={setOptions}
                  onApply={handleApplyCleaning}
                  isProcessing={isProcessing}
                  hasData={cleanedData.length > 0}
                />

                <StatsCard stats={stats} />

                <div className="flex justify-center sm:justify-start">
                  <ExportButton
                    onExport={handleExport}
                    disabled={!cleanedData || cleanedData.length === 0}
                    rowCount={cleanedData?.length}
                  />
                </div>

                <CSVPreview
                  headers={parsed.headers}
                  data={cleanedData}
                  errors={errors}
                />
              </div>
            )}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-zinc-200 py-20 dark:border-zinc-800">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Three simple steps
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
              From messy to pristine in moments
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              No tutorials needed. Just drop, clean, and download.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: '01', icon: Upload, title: 'Upload', desc: 'Drop a CSV, TSV, or TXT file up to 50MB. Drag & drop or click to browse.', color: 'from-indigo-500 to-blue-500' },
              { step: '02', icon: Zap, title: 'Clean', desc: 'Trim whitespace, remove duplicates, validate emails & phones. All with one click.', color: 'from-purple-500 to-pink-500' },
              { step: '03', icon: ArrowDown, title: 'Download', desc: 'Export your cleaned file instantly. Your data never touched a server.', color: 'from-emerald-500 to-teal-500' },
            ].map(({ step, icon: Icon, title, desc, color }, idx) => (
              <div key={step} className="group relative text-center">
                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div className="absolute left-0 right-0 top-6 -z-10 mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100/50 to-purple-100/50 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 dark:from-indigo-900/20 dark:to-purple-900/20" />
                <p className="mb-1 text-[11px] font-medium text-zinc-400">{step}</p>
                <h3 className="mb-1.5 text-sm font-semibold text-zinc-900 dark:text-white">{title}</h3>
                <p className="mx-auto max-w-[220px] text-sm text-zinc-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-zinc-200 py-20 dark:border-zinc-800">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Loved by users
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              Trusted by data teams worldwide
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map(({ quote, author, role }) => (
              <div
                key={author}
                className="rounded-xl border border-zinc-200/60 bg-white/50 p-5 transition-all hover:border-zinc-300/80 hover:shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/30 dark:hover:border-zinc-700/80"
              >
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                  ))}
                </div>
                <p className="mb-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">&ldquo;{quote}&rdquo;</p>
                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">{author}</p>
                  <p className="text-[11px] text-zinc-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <PricingSection />
      </main>

      <footer className="relative z-10 border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
              <Upload className="h-3 w-3 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">CSV Cleaner</span>
          </div>
          <p className="text-xs text-zinc-400">
            Browser-based CSV cleaning · 100% private · Always free tier available
          </p>
        </div>
      </footer>
    </>
  )
}
