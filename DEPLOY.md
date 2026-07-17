# Deploy CSV Cleaner to Vercel

## Step 1: Push to GitHub
```bash
cd C:\Users\Samrat\Desktop\proto1
git init
git add .
git commit -m "initial commit: CSV Cleaner with payment system"
# Create repo at https://github.com/new (name: csv-cleaner)
git remote add origin https://github.com/Ritiksuman07/csv-cleaner.git
git push -u origin main
```

## Step 2: Deploy on Vercel
1. Go to https://vercel.com/new
2. Import `Ritiksuman07/csv-cleaner`
3. Framework preset: Next.js (auto-detected)
4. Click Deploy (takes ~2 minutes)

## Step 3: Add Domain hackiom.xyz
1. In Vercel dashboard → Project → Settings → Domains
2. Enter `hackiom.xyz`
3. Follow Vercel's DNS instructions (CNAME your domain to `cname.vercel-dns.com`)

## Step 4: Setup Lemon Squeezy (Payment Gateway)
Lemon Squeezy accepts **all major credit/debit cards** globally (Visa, MC, Amex, Discover, UnionPay, JCB) plus Apple Pay, Google Pay, PayPal. They handle multi-currency (INR, USD, EUR, GBP) and global tax compliance.

### Create Lemon Squeezy Account
1. Go to https://lemonsqueezy.com → Sign up
2. Complete your store setup (name, country, payout info)
3. You can withdraw to Indian bank account in USD

### Create Pro Product
1. Dashboard → Products → New Product
2. Name: `CSV Cleaner Pro`
3. Description: `Unlimited CSV cleaning & validation`
4. Pricing: Recurring → $15/month (or ₹1249/month)
5. Add variant and publish

### Get Your URLs
1. Go to the product → Checkout → Copy the checkout URL
2. It will look like: `https://hackiom.lemonsqueezy.com/checkout/buy/xxxxxxxx`

### Set Environment Variables in Vercel
Go to Vercel → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_LEMON_SQUEEZY_URL=https://hackiom.lemonsqueezy.com/checkout/buy/xxxxxxxx
LEMON_SQUEEZY_API_KEY=your_api_key_here
LEMON_SQUEEZY_WEBHOOK_SECRET=generate_a_random_secret
```

### (Optional) Setup Webhook for automatic license management
1. In Lemon Squeezy → Store → Webhooks
2. URL: `https://hackiom.xyz/api/lemon-squeezy`
3. Events: `order_created`, `subscription_created`, `subscription_updated`, `subscription_cancelled`
4. Secret: same as `LEMON_SQUEEZY_WEBHOOK_SECRET`

## Step 5: Update the Checkout URL
In `src/lib/subscription.ts`, find:
```
'https://hackiom.lemonsqueezy.com/checkout/buy/YOUR_PRODUCT_ID'
```
Replace with your actual product checkout URL from step 4.

## Step 6: Redeploy
After setting env vars and updating URL, push to git and Vercel auto-deploys.

---

## No Env Vars Needed For:
- ✅ Free tier (works immediately after deploy)
- ✅ CSV processing (100% client-side)
- ✅ Dark mode
- ✅ File uploads

## Revenue Flow
```
User → Clicks "Upgrade" → Lemon Squeezy Checkout → 
  Pays with any card → Redirected to /success →
    Subscription saved in browser → Unlimited features unlocked
```

## Local Development
```cmd
cd C:\Users\Samrat\Desktop\proto1
npm install
npm run dev
```
Opens at http://localhost:3000
