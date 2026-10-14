import type { Metadata } from 'next'
import './globals.css'
import BootstrapRuntime from '@/components/BootstrapRuntime'
export const metadata: Metadata = {
  title: 'Bootstrap Builder – Next.js',
  description: 'Drag-and-drop Bootstrap page generator'
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
        <BootstrapRuntime />
      </body>
    </html>
  )
}
