'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { openRazorpayCheckout } from '@/lib/razorpay-client'

export function useRazorpayCheckout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const checkout = useCallback(
    async (opts?: { email?: string; name?: string; redirectOnSuccess?: boolean }) => {
      setLoading(true)
      setError(null)

      await openRazorpayCheckout({
        email: opts?.email,
        name: opts?.name,
        onSuccess: () => {
          setLoading(false)
          if (opts?.redirectOnSuccess !== false) {
            router.push('/success')
          }
        },
        onDismiss: () => setLoading(false),
        onError: (msg) => {
          setLoading(false)
          setError(msg)
        },
      })
    },
    [router]
  )

  return { checkout, loading, error, clearError: () => setError(null) }
}
