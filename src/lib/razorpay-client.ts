'use client'

import { setSubscription } from '@/lib/subscription'
import type { Subscription } from '@/types'

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: () => void) => void }
  }
}

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export interface CheckoutOptions {
  email?: string
  name?: string
  onSuccess?: () => void
  onDismiss?: () => void
  onError?: (message: string) => void
}

export async function openRazorpayCheckout(options: CheckoutOptions = {}): Promise<void> {
  const { email, name, onSuccess, onDismiss, onError } = options

  const res = await fetch('/api/razorpay/create-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  })

  const data = await res.json()
  if (!res.ok) {
    onError?.(data.error || 'Failed to start checkout')
    return
  }

  const loaded = await loadRazorpayScript()
  if (!loaded || !window.Razorpay) {
    onError?.('Failed to load payment gateway')
    return
  }

  const rzp = new window.Razorpay({
    key: data.keyId,
    subscription_id: data.subscriptionId,
    name: 'CSV Cleaner',
    description: 'Pro — Unlimited CSV cleaning & validation',
    image: '/icon.svg',
    prefill: {
      email: email || '',
      name: name || '',
    },
    theme: { color: '#6366f1' },
    handler: async (response: {
      razorpay_payment_id: string
      razorpay_subscription_id: string
      razorpay_signature: string
    }) => {
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_subscription_id: response.razorpay_subscription_id,
          razorpay_signature: response.razorpay_signature,
          email,
          name,
        }),
      })

      const verifyData = await verifyRes.json()
      if (!verifyRes.ok || !verifyData.verified) {
        onError?.(verifyData.error || 'Payment verification failed')
        return
      }

      setSubscription(verifyData.subscription as Subscription)
      onSuccess?.()
    },
    modal: {
      ondismiss: () => onDismiss?.(),
    },
  })

  rzp.on('payment.failed', () => {
    onError?.('Payment failed. Please try again.')
  })

  rzp.open()
}

export async function cancelRazorpaySubscription(
  subscriptionId: string,
  cancelAtCycleEnd = true
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch('/api/razorpay/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscriptionId, cancelAtCycleEnd }),
  })

  const data = await res.json()
  if (!res.ok) {
    return { success: false, error: data.error || 'Cancellation failed' }
  }
  return { success: true }
}
