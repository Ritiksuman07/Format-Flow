'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Check, Zap } from 'lucide-react'
import { isPro } from '@/lib/subscription'
import { detectUserCurrency, formatPrice, getSupportedPaymentMethods } from '@/lib/payments'
import { useRazorpayCheckout } from '@/hooks/use-razorpay-checkout'
import { PRICES } from '@/types'
import type { PriceDisplay } from '@/types'

export function PricingSection() {
  const [userPrice, setUserPrice] = useState<PriceDisplay>(PRICES[0]) // default USD
  const [proStatus, setProStatus] = useState(false)
  const [annual, setAnnual] = useState(false)
  const { checkout, loading, error } = useRazorpayCheckout()

  useEffect(() => {
    setUserPrice(detectUserCurrency())
    setProStatus(isPro())
    const handler = () => setProStatus(isPro())
    window.addEventListener('subscription-updated', handler)
    return () => window.removeEventListener('subscription-updated', handler)
  }, [])

  const monthlyCost = userPrice.monthly
  const yearlyTotal = userPrice.yearly
  const yearlyPerMonth = Math.round(yearlyTotal / 12)
  const savings = monthlyCost * 12 - yearlyTotal
  const savingsPercent = Math.round((savings / (monthlyCost * 12)) * 100)

  const plans = [
    {
      name: 'Free',
      price: 'Free',
      period: '',
      description: 'For occasional CSV cleanup',
      features: [
        '10,000 rows per file',
        'All basic cleaning operations',
        'Email validation',
        'CSV export',
        'Max 50MB file size',
      ],
      cta: proStatus ? 'Current plan' : 'Get started',
      variant: 'outline' as const,
      disabled: proStatus,
      action: null as (() => void) | null,
    },
    {
      name: 'Pro Monthly',
      price: formatPrice(monthlyCost, userPrice.locale, userPrice.currency),
      period: '/month',
      description: 'Billed monthly · cancel anytime',
      popular: false,
      features: [
        'Unlimited rows',
        'All cleaning + validation',
        '500MB file size limit',
        'Priority support',
        'Cancel anytime',
      ],
      cta: proStatus ? 'Manage billing' : 'Subscribe monthly',
      variant: 'outline' as const,
      disabled: false,
      action: proStatus ? null : () => checkout(),
    },
    {
      name: 'Pro Annual',
      price: formatPrice(yearlyTotal, userPrice.locale, userPrice.currency),
      period: '/year',
      description: `Just ${formatPrice(yearlyPerMonth, userPrice.locale, userPrice.currency)}/mo — save ${savingsPercent}%`,
      popular: true,
      badge: `Save ${formatPrice(savings, userPrice.locale, userPrice.currency)}`,
      features: [
        'Unlimited rows',
        'All cleaning + validation',
        '500MB file size limit',
        'Priority support',
        'Cancel anytime',
      ],
      cta: proStatus ? 'Manage billing' : 'Subscribe yearly',
      variant: 'premium' as const,
      disabled: false,
      action: proStatus ? null : () => checkout(),
    },
  ]

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Pricing
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {getSupportedPaymentMethods().map((method) => (
            <span
              key={method}
              className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
            >
              {method}
            </span>
          ))}
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.popular
                  ? 'relative ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/10'
                  : ''
              }
            >
              {plan.popular && (
                <div className="px-6 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Best value
                    </span>
                    {plan.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <Zap className="h-3 w-3" />
                        {plan.badge}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <CardHeader>
                <CardTitle className="flex items-baseline gap-1">
                  <span className="text-2xl">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm font-normal text-zinc-400">{plan.period}</span>
                  )}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="mb-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.action ? (
                  <Button
                    variant={plan.variant}
                    className="w-full"
                    loading={loading}
                    onClick={plan.action}
                  >
                    {plan.cta}
                  </Button>
                ) : plan.name === 'Free' ? (
                  <Button variant={plan.variant} className="w-full" disabled={plan.disabled}>
                    {plan.cta}
                  </Button>
                ) : (
                  <a href="/billing">
                    <Button variant={plan.variant} className="w-full">{plan.cta}</Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}

        <p className="mt-8 text-center text-xs text-zinc-400">
          Secure payments via Razorpay · UPI, cards, net banking &amp; wallets
        </p>
      </div>
    </section>
  )
}
