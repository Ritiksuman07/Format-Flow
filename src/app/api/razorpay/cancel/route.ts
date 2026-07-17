import { NextResponse } from 'next/server'
import { getRazorpayInstance } from '@/lib/razorpay-server'

export async function POST(request: Request) {
  try {
    const { subscriptionId, cancelAtCycleEnd = true } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 })
    }

    const razorpay = getRazorpayInstance()
    const result = await razorpay.subscriptions.cancel(subscriptionId, {
      cancel_at_cycle_end: cancelAtCycleEnd ? 1 : 0,
    })

    return NextResponse.json({
      cancelled: true,
      status: result.status,
      endedAt: result.ended_at
        ? new Date(result.ended_at * 1000).toISOString()
        : null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cancellation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
