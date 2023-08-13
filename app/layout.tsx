import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import Provider from '@/_providers/Provider'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'personatokens.ai',
  description: 'Mint your unique AI companions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-secondary", inter.className)}>
        <Provider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            {children}
            <Analytics />
            <Toaster />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}
