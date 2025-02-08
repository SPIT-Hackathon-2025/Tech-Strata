import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react" // Import React
import SessionWrapper from "@/components/sessionWrapper/sessionWrapper" 
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CodeCollab - Collaborative Online IDE",
  description: "Code together in real-time with our powerful online IDE",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <SessionWrapper >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
        </SessionWrapper>
      </body>
    </html>
  )
}

