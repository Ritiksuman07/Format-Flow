'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  Download,
  FileText,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import {
  getSubscription,
  getUsage,
  setSubscription,
  clearSubscription,
} from '@/lib/subscription'
import { getSupportedPaymentMethods } from '@/lib/payments'
import { useRazorpayCheckout } from '@/hooks/use-razorpay-checkout'
import { cancelRazorpaySubscription } from '@/lib/razorpay-client'
import type { Subscription, UsageRecord } from '@/types'
import { formatNumber } from '@/lib/utils'

export default function BillingPage() {
  const [sub, setSub] = useState<Subscription>(getSubscription())
  const [usage, setUsage] = useState<UsageRecord>(getUsage())
  const [cancelling, setCancelling] = useState(false)
  const [cancelMsg, setCancelMsg] = useState<string | null>(null)
  const { checkout, loading, error } = useRazorpayCheckout()

  useEffect(() => {
    const handler = () => {
      setSub(getSubscription())
      setUsage(getUsage())
    }
    window.addEventListener('subscription-updated', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('subscription-updated', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const isProActive = sub.tier === 'pro' && (sub.status === 'active' || sub.status === 'pending')
  const daysLeft = sub.renewsAt
    ? Math.max(0, Math.ceil((new Date(sub.renewsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  const handleCancel = async () => {
    if (!sub.razorpaySubscriptionId) return
    if (!confirm('Cancel your Pro subscription? You will keep access until the end of the billing period.')) return

    setCancelling(true)
    setCancelMsg(null)

    const result = await cancelRazorpaySubscription(sub.razorpaySubscriptionId, true)
    setCancelling(false)

    if (result.success) {
      setSubscription({ ...sub, status: 'cancelled' })
      setCancelMsg('Subscription cancelled. Access continues until period end.')
    } else {
      setCancelMsg(result.error || 'Failed to cancel')
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Billing</h1>
        <p className="mb-8 text-sm text-zinc-500">Manage your subscription and usage.</p>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Current plan
                <Badge variant={isProActive ? 'success' : 'default'}>
                  {isProActive ? 'Pro' : 'Free'}
                </Badge>
              </CardTitle>
              <CardDescription>
                {isProActive
                  ? sub.status === 'cancelled'
                    ? 'Cancelled — access until period end'
                    : `Renews in ${daysLeft} days`
                  : 'Upgrade for unlimited processing'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProActive ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Unlimited rows &middot; 500MB files
                  </div>
                  {sub.customerEmail && (
                    <p className="text-xs text-zinc-500">
                      {sub.customerEmail}
                    </p>
                  )}
                  {sub.razorpaySubscriptionId && sub.status !== 'cancelled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      loading={cancelling}
                      onClick={handleCancel}
                    >
                      Cancel subscription
                    </Button>
                  )}
                  {cancelMsg && (
                    <p className="text-xs text-zinc-500">{cancelMsg}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-zinc-500">10,000 rows &middot; 50MB files</p>
                  <Button variant="premium" className="w-full gap-2" loading={loading} onClick={() => checkout()}>
                    <Sparkles className="h-4 w-4" /> Upgrade to Pro
                  </Button>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                Usage
              </CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">
                {formatNumber(usage.rowsProcessed)}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                rows processed · {usage.filesProcessed} files
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4 text-indigo-500" />
                Payment methods
              </CardTitle>
              <CardDescription>Powered by Razorpay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {getSupportedPaymentMethods().map((method) => (
                  <span
                    key={method}
                    className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium dark:border-zinc-700"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Download className="h-4 w-4 text-indigo-500" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usage.filesProcessed > 0 ? (
                <div className="text-sm text-zinc-500">
                  <p className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    {usage.filesProcessed} file{usage.filesProcessed !== 1 ? 's' : ''} this month
                  </p>
                  {usage.lastFileDate && (
                    <p className="mt-1 text-xs text-zinc-400">
                      Last: {new Date(usage.lastFileDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <p className="flex items-center gap-1.5 text-sm text-zinc-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  No files processed yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {isProActive && (
          <div className="mt-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-red-500"
              onClick={() => {
                if (confirm('Clear local subscription data? This does not cancel your Razorpay subscription.')) {
                  clearSubscription()
                }
              }}
            >
              Reset local data
            </Button>
          </div>
        )}
      </main>
    </>
  )
}
