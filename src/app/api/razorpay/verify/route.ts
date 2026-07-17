import { NextResponse } from 'next/server'
import { getRazorpayInstance, verifySubscriptionSignature } from '@/lib/razorpay-server'

export async function POST(request: Request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      email,
      name,
    } = await request.json()

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    const valid = verifySubscriptionSignature(
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature
    )

    if (!valid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    const razorpay = getRazorpayInstance()
    const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id)

    const renewsAt = subscription.current_end
      ? new Date(subscription.current_end * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    return NextResponse.json({
      verified: true,
      subscription: {
        tier: 'pro',
        status: subscription.status === 'active' ? 'active' : 'pending',
        razorpaySubscriptionId: razorpay_subscription_id,
        razorpayPaymentId: razorpay_payment_id,
        customerEmail: email || null,
        customerName: name || null,
        renewsAt,
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Verification failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
