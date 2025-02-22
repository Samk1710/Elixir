import type { Metadata } from "next"
import { Inter, Rubik } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { ChatBot } from "@/components/utils/chat-bot"
import { Providers } from "@/components/providers"
import '@rainbow-me/rainbowkit/styles.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" })

export const metadata: Metadata = {
  title: "Elixir - Blood Donation Platform",
  description: "Donate Blood. Save Lives. Earn NFTs.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${inter.variable} ${rubik.variable} font-inter`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Navbar />
            <main>{children}</main>
            <ChatBot />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}