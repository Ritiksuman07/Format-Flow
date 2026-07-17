import type { Subscription, UsageRecord } from '@/types'
import {
  SUBSCRIPTION_KEY,
  USAGE_KEY,
  FREE_ROW_LIMIT,
  FREE_FILE_SIZE_LIMIT,
} from '@/types'

export function getSubscription(): Subscription {
  if (typeof window === 'undefined') return defaultSubscription()
  try {
    const data = localStorage.getItem(SUBSCRIPTION_KEY)
    if (data) {
      const parsed = JSON.parse(data) as Subscription & { lemonSqueezyId?: string }
      // Migrate legacy Lemon Squeezy storage
      if (!parsed.razorpaySubscriptionId && parsed.lemonSqueezyId) {
        return {
          ...parsed,
          razorpaySubscriptionId: parsed.lemonSqueezyId,
          razorpayPaymentId: null,
        }
      }
      return parsed
    }
  } catch {}
  return defaultSubscription()
}

export function setSubscription(sub: Subscription) {
  if (typeof window === 'undefined') return
  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(sub))
  window.dispatchEvent(new Event('subscription-updated'))
}

export function clearSubscription() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SUBSCRIPTION_KEY)
  window.dispatchEvent(new Event('subscription-updated'))
}

export function defaultSubscription(): Subscription {
  return {
    tier: 'free',
    status: 'never',
    razorpaySubscriptionId: null,
    razorpayPaymentId: null,
    customerEmail: null,
    customerName: null,
    renewsAt: null,
    startedAt: null,
    updatedAt: null,
  }
}

export function isPro(): boolean {
  const sub = getSubscription()
  if (sub.tier !== 'pro') return false
  if (sub.status === 'active' || sub.status === 'pending') return true
  if (sub.status === 'cancelled' && sub.renewsAt) {
    return new Date(sub.renewsAt) > new Date()
  }
  return false
}

export function canProcessRows(rowCount: number): { allowed: boolean; limit: number } {
  if (isPro()) return { allowed: true, limit: Infinity }
  return { allowed: rowCount <= FREE_ROW_LIMIT, limit: FREE_ROW_LIMIT }
}

export function canProcessFile(fileSize: number): { allowed: boolean; limit: number } {
  if (isPro()) return { allowed: true, limit: PRO_FILE_SIZE_LIMIT }
  return { allowed: fileSize <= FREE_FILE_SIZE_LIMIT, limit: FREE_FILE_SIZE_LIMIT }
}

export function getUsage(): UsageRecord {
  if (typeof window === 'undefined') return defaultUsage()
  try {
    const data = localStorage.getItem(USAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (parsed.month === getCurrentMonth()) return parsed
    }
  } catch {}
  return defaultUsage()
}

export function recordUsage(rows: number) {
  const usage = getUsage()
  usage.rowsProcessed += rows
  usage.filesProcessed += 1
  usage.lastFileDate = new Date().toISOString()
  usage.month = getCurrentMonth()
  if (typeof window !== 'undefined') {
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
  }
}

function getCurrentMonth(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function defaultUsage(): UsageRecord {
  return {
    rowsProcessed: 0,
    filesProcessed: 0,
    lastFileDate: null,
    month: getCurrentMonth(),
  }
}

export const PRO_FILE_SIZE_LIMIT = 500 * 1024 * 1024
