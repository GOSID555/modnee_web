// ❌ ห้ามมี "use client" ในไฟล์นี้

import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

import ThemeWrapper from '../components/ThemeWrapper'; // ✅ ย้าย ThemeProvider ไปแยก

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'แอปคำนวณหนี้',
  description: 'เครื่องมือช่วยคำนวณการชำระหนี้แบบมีแผน',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={geistSans.variable}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}