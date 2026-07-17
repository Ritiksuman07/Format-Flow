import { NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay-server'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!signature || !verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const event = JSON.parse(body)
    const eventType = event.event as string

    switch (eventType) {
      case 'subscription.activated':
      case 'subscription.charged':
      case 'subscription.completed':
      case 'subscription.cancelled':
      case 'subscription.paused':
      case 'subscription.resumed':
      case 'payment.failed':
        // Client-side localStorage handles license state; webhook is for audit/logging.
        // Extend here with a database when server-side license sync is needed.
        console.log(`[Razorpay webhook] ${eventType}`, event.payload?.subscription?.entity?.id)
        break
      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
