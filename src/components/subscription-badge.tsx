'use client'

import { useState, useEffect } from 'react'
import { getSubscription } from '@/lib/subscription'

export function SubscriptionBadge() {
  const [tier, setTier] = useState<string>('free')

  useEffect(() => {
    const update = () => setTier(getSubscription().tier)
    update()
    window.addEventListener('subscription-updated', update)
    return () => window.removeEventListener('subscription-updated', update)
  }, [])

  if (tier !== 'pro') return null

  return (
    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
      Pro
    </span>
  )
}
