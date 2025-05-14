import './globals.css'
import { Space_Grotesk, IBM_Plex_Sans, Inter, Manrope } from 'next/font/google'
import Header from './components/Header'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

export const metadata = {
  title: 'CheqDeep - Certify Media Authenticity',
  description: 'Verify the authenticity of your photos and videos with our decentralized platform',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${inter.variable} ${manrope.variable} bg-gradient-to-b from-[#1F2B50]/5 to-transparent`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
