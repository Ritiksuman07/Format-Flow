import type { PriceDisplay } from '@/types'
import { PRICES } from '@/types'

export function detectUserCurrency(): PriceDisplay {
  if (typeof window === 'undefined') return PRICES[0]
  try {
    const locale = navigator.language || 'en-US'
    const country = locale.split('-')[1]?.toUpperCase() || 'US'

    const currencyMap: Record<string, string> = {
      US: 'USD', IN: 'INR', GB: 'GBP',
      DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
      CA: 'USD', AU: 'USD', SG: 'USD',
    }

    const userCurrency = currencyMap[country] || 'USD'
    return PRICES.find((p) => p.currency === userCurrency) || PRICES[0]
  } catch {
    return PRICES[0]
  }
}

export function formatPrice(price: number, locale: string, currency: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  } catch {
    return `${currency} ${price}`
  }
}

export function getSupportedPaymentMethods(): string[] {
  return [
    'UPI',
    'Visa',
    'Mastercard',
    'RuPay',
    'Net Banking',
    'Wallet',
    'Pay Later',
  ]
}
