'use client'

import { Upload, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubscriptionBadge } from '@/components/subscription-badge'
import { useState } from 'react'
import Link from 'next/link'
import { isPro } from '@/lib/subscription'
import { useRazorpayCheckout } from '@/hooks/use-razorpay-checkout'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { checkout, loading } = useRazorpayCheckout()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 glass dark:border-zinc-800/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
            <Upload className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            CSV Cleaner
          </span>
          <SubscriptionBadge />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: '/#tool', label: 'Tool' },
            { href: '/#pricing', label: 'Pricing' },
            { href: '/billing', label: 'Billing' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {label}
            </Link>
          ))}
          <ProButton checkout={checkout} loading={loading} />
        </nav>

        <button
          className="rounded-md p-1.5 text-zinc-600 md:hidden dark:text-zinc-400"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800 md:hidden">
          <div className="flex flex-col gap-1">
            <Link href="/#tool" className="rounded-md px-2 py-2 text-sm font-medium">Tool</Link>
            <Link href="/#pricing" className="rounded-md px-2 py-2 text-sm font-medium">Pricing</Link>
            <Link href="/billing" className="rounded-md px-2 py-2 text-sm font-medium">Billing</Link>
            <div className="pt-2">
              <ProButton checkout={checkout} loading={loading} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function ProButton({
  checkout,
  loading,
}: {
  checkout: () => Promise<void>
  loading: boolean
}) {
  if (isPro()) {
    return (
      <Link href="/billing">
        <Button size="sm" variant="outline">Billing</Button>
      </Link>
    )
  }

  return (
    <Button size="sm" variant="premium" loading={loading} onClick={() => checkout()}>
      Upgrade
    </Button>
  )
}
