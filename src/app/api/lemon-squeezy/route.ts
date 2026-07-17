import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET

  const body = await request.text()
  const signature = request.headers.get('x-signature')

  if (secret && signature) {
    const crypto = await import('crypto')
    const expected = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (signature !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  try {
    const event = JSON.parse(body)
    const { name, data } = event

    switch (name) {
      case 'order_created':
      case 'subscription_created':
      case 'subscription_updated': {
        const attributes = data.attributes
        const customerEmail = attributes.user_email || attributes.email
        const customerName = attributes.user_name || attributes.name
        const variantId = attributes.variant_id || attributes.variant

        const isPro = variantId === process.env.LEMON_SQUEEZY_PRO_VARIANT_ID

        await updateSubscription({
          tier: isPro ? 'pro' : 'free',
          status: 'active',
          lemonSqueezyId: data.id,
          customerEmail,
          customerName,
          renewsAt: attributes.renews_at || attributes.expires_at,
        })

        return NextResponse.json({ message: 'Subscription updated' })
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        await updateSubscription({
          tier: 'free',
          status: 'expired',
          lemonSqueezyId: data.id,
          customerEmail: null,
          customerName: null,
          renewsAt: null,
        })

        return NextResponse.json({ message: 'Subscription deactivated' })
      }

      default:
        return NextResponse.json({ message: 'Event ignored' })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}

async function updateSubscription(data: {
  tier: string
  status: string
  lemonSqueezyId: string
  customerEmail: string | null
  customerName: string | null
  renewsAt: string | null | undefined
}) {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY
  if (!apiKey) return

  try {
    const now = new Date().toISOString()
    await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${data.lemonSqueezyId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    })
  } catch {}
}
