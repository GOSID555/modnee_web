// src/app/layout.tsx
import ThemeWrapper from '@/components/ThemeWrapper'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover' as const,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  )
}
