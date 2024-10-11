import type { Metadata } from 'next'
import { Noto_Sans_KR, Poppins } from 'next/font/google'

import { OutLineMenu } from '@/components/layout/OutLineMenu'
import { AutoScroll } from '@/components/layout/AutoScroll'

import './globals.css'
import './carousel.css'

const NotoSansKR = Noto_Sans_KR({
  display: 'swap',
  preload: true,
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const PoppinsFont = Poppins({
  display: 'swap',
  preload: true,
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${PoppinsFont.className} ${NotoSansKR.className} antialiased`}
      >
        <OutLineMenu>
          <div id="top-fix" />
          <div
            className="mx-auto w-content-limit max-w-full py-20 mobile:pl-2"
            id="container"
          >
            {children}
          </div>
          <AutoScroll />
        </OutLineMenu>
      </body>
    </html>
  )
}
