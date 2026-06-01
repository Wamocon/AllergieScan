import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { AppNavigation } from '@/components/AppNavigation'
import { AppTopBar } from '@/components/AppTopBar'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ToastProvider } from '@/components/Toast'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'AllergieScan - Sicher einkaufen mit Allergie',
    template: '%s | AllergieScan',
  },
  description: 'Pruefe Lebensmittel auf Allergene per Barcode, Foto oder Textsuche. Schnell, sicher, transparent.',
  keywords: ['Allergie', 'Lebensmittel', 'Scanner', 'Barcode', 'Allergene', 'DACH', 'Glutenfrei', 'Laktosefrei'],
  authors: [{ name: 'WAMOCON' }],
  openGraph: {
    type: 'website',
    siteName: 'AllergieScan',
    title: 'AllergieScan - Sicher einkaufen mit Allergie',
    description: 'Pruefe Lebensmittel auf Allergene per Barcode, Foto oder Textsuche.',
    url: 'https://www.allergiescan.net',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AllergieScan',
    description: 'Sicher einkaufen mit Allergie. Barcode scannen, Zutaten pruefen.',
  },
  metadataBase: new URL('https://www.allergiescan.net'),
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'de' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'AllergieScan',
              description: 'Pruefe Lebensmittel auf Allergene per Barcode oder Textsuche.',
              url: 'https://www.allergiescan.net',
              applicationCategory: 'HealthApplication',
              operatingSystem: 'Web',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
            }),
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a4d3a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* Plausible Analytics (V16) - DSGVO-compliant, no cookies */}
        <script defer data-domain="allergiescan.net" src="https://plausible.io/js/script.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </head>
      <body className="min-h-full bg-canvas-grain text-app">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ToastProvider>
              <AppTopBar />
              <AppNavigation />
              <div className="flex min-h-screen flex-col lg:pl-[240px]">
                <main className="flex-1 pb-20 lg:pb-0">
                  {children}
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
