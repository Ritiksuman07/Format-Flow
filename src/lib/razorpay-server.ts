import Razorpay from 'razorpay'
import crypto from 'crypto'

export function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured')
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

export function getRazorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || ''
}

export function verifySubscriptionSignature(
  paymentId: string,
  subscriptionId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return false
  const body = `${paymentId}|${subscriptionId}`
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return expected === signature
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) return false
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return expected === signature
}
