import { Poppins, Noto_Nastaliq_Urdu } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins'
})

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-nastaliq'
})

export const metadata = {
  title: 'Malik Poultry Farm — Fresh Poultry & Beverage Distributor in Kalaswala',
  description: 'Malik Poultry Farm supplies fresh & live chicken, broiler poultry, and popular cold drinks (Coca-Cola, Sprite, Fanta, Mountain Dew, Minute Maid) to families, restaurants, hotels, caterers, and wholesalers across Kalaswala, Pakistan. Open 24 hours.',
  keywords: 'Malik Poultry Farm, Kalaswala poultry, fresh chicken Pakistan, broiler chicken supplier, cold drinks distributor, Coca-Cola Kalaswala, wholesale poultry',
  openGraph: {
    title: 'Malik Poultry Farm — Fresh Poultry & Beverages',
    description: 'Trusted poultry supplier and beverage distributor in Kalaswala, Pakistan. Open 24 Hours.',
    type: 'website'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${nastaliq.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
