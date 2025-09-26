import type React from "react"
import type { Metadata } from "next"
import { Poppins, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Glimmer from "@/components/ui/glimmer"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Selah - A Sacred Space for Prayer",
  description:
    "A digital prayer space for reflection and connection. Type your prayers and let them rise like incense.",
    generator: 'v0.app',
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    other: [
      { rel: "icon", url: "/icon.png" },
      { rel: "shortcut icon", url: "/icon.png" },
    ],
  },
}
// Include icons in metadata so Next.js will generate favicon/head tags
export const metadataWithIcons: Metadata = {
  ...metadata,
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    other: [
      { rel: "icon", url: "/icon.png" },
      { rel: "shortcut icon", url: "/icon.png" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${jetbrainsMono.variable} antialiased`}>
      <head>
        <link rel="icon" href="/icon.png" />
      </head>
      <body className="font-sans px-2 sm:px-0">
        <Glimmer />
        <a href="/" aria-label="Home" className="site-icon fixed top-4 left-4 z-50">
          <img src="/icon.png" alt="Site icon" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md shadow-lg object-cover" />
        </a>
        {children}
      </body>
    </html>
  )
}
