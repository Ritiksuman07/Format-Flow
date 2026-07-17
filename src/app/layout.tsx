import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CSV Cleaner - Free Online CSV Cleaning & Validation Tool",
  description:
    "Clean, validate, and fix your CSV files online for free. Remove duplicates, trim whitespace, validate emails and phones. No upload required - 100% in your browser.",
  keywords: [
    "csv cleaner",
    "csv validator",
    "clean csv online",
    "remove duplicates csv",
    "csv email validator",
    "free csv tool",
    "csv data cleaner",
  ],
  openGraph: {
    title: "CSV Cleaner - Free Online Tool",
    description: "Clean and validate your CSV files in seconds. 100% browser-based.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' ||
                  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  )
}
