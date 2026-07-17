'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRazorpayCheckout } from '@/hooks/use-razorpay-checkout'

interface UpgradePromptProps {
  reason: string
  onDismiss: () => void
}

export function UpgradePrompt({ reason, onDismiss }: UpgradePromptProps) {
  const { checkout, loading } = useRazorpayCheckout()

  return (
    <Card className="border-indigo-200/60 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-950/20">
      <div className="relative p-4">
        <button
          onClick={onDismiss}
          className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:pr-6">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Upgrade to Pro</p>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{reason}</p>
          </div>
          <Button
            variant="premium"
            size="sm"
            className="shrink-0"
            loading={loading}
            onClick={() => checkout()}
          >
            Subscribe
          </Button>
        </div>
      </div>
    </Card>
  )
}
