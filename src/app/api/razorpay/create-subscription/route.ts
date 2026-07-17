import { NextResponse } from 'next/server'
import { getRazorpayInstance, getRazorpayKeyId } from '@/lib/razorpay-server'

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()
    const planId = process.env.RAZORPAY_PLAN_ID

    if (!planId) {
      return NextResponse.json(
        { error: 'Razorpay plan not configured. Set RAZORPAY_PLAN_ID.' },
        { status: 500 }
      )
    }

    const razorpay = getRazorpayInstance()

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 120,
      customer_notify: 1,
      notes: {
        product: 'csv-cleaner-pro',
        ...(email ? { email } : {}),
      },
      notify_info: email
        ? { notify_email: email }
        : undefined,
    })

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: getRazorpayKeyId(),
      status: subscription.status,
      shortUrl: subscription.short_url,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create subscription'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
