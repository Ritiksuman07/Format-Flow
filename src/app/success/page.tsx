'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSubscription } from '@/lib/subscription'
import type { Subscription } from '@/types'

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(5)
  const [sub, setSub] = useState<Subscription | null>(null)

  useEffect(() => {
    setSub(getSubscription())

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          window.location.href = '/'
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
        <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        You&apos;re on Pro
      </h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        {sub?.customerEmail
          ? `Subscription active for ${sub.customerEmail}.`
          : 'Your subscription is now active.'}
        {' '}Unlimited rows and all premium features are unlocked.
      </p>
      <p className="mt-3 text-xs text-zinc-400">
        Redirecting in {countdown}s…
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button className="gap-2">
            Open tool <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/billing">
          <Button variant="outline">Billing</Button>
        </Link>
      </div>
    </div>
  )
}
