'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRazorpayCheckout } from '@/hooks/use-razorpay-checkout'

export default function CancelPage() {
  const { checkout, loading } = useRazorpayCheckout()

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        Payment cancelled
      </h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        No charge was made. Your free plan is still active with 10,000 rows per file.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to tool
          </Button>
        </Link>
        <Button variant="premium" loading={loading} onClick={() => checkout()}>
          Try again
        </Button>
      </div>
    </div>
  )
}
