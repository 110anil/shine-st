import './globals.css'
import favIcon from "@/public/favicon.ico";
import appleTouchIcon from "@/public/apple-touch-icon.png";
import favIcon16 from "@/public/favicon-16x16.png";
import favIcon32 from "@/public/favicon-32x32.png";
import logo from "@/images/logo.png";
import { Inter } from 'next/font/google'
import styles from './layoyt.module.css'
import cs from 'classnames'
const inter = Inter({ subsets: ['latin'] })
export const metadata = {
  title: 'Shine Studio | Wedding Photography | Maternity Photography | Pre-wedding Shoots | Faridabad | Delhi NCR | Gurgaon | Gurugram | Noida',
  description: 'For all your photography and videography needs',
}
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
    <head>
        <meta name="fragment" content="!" />
        <meta name="http-equiv" content="text/plain; charset=x-user-defined" />
        <meta name="google" content="notranslate" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-status-bar-style" content="purple-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta property="og:url" content="//shinestudio.in/" />
        <meta name="twitter:url" content="//shinestudio.in/" />
        <meta property="og:title" content={metadata.title} />
        <meta name="twitter:title" content={metadata.title} />
        <link type="image/png" rel="shortcut icon" href={favIcon.src} />
        <link type="image/png" rel="apple-touch-icon" href={appleTouchIcon.src} />
        <link rel="icon" type="image/png" sizes="32x32" href={favIcon16.src} />
        <link rel="icon" type="image/png" sizes="16x16" href={favIcon32.src} />
        <meta property="og:description" content={metadata.description} />
        <meta name="twitter:description" content={metadata.description} />
        <meta itemProp="image" content={logo.src} />
        <meta name="twitter:image:src" content={logo.src} />
        <meta property="og:image" content={logo.src} />
        <meta property="og:type" content="Product" />
        <meta name="twitter:card" content="Summary" />
        <meta name="twitter:domain" content="//shinestudio.in" />
        <meta property="og:site_name" content="ShineStudio" />
        <meta itemProp="keywords"
              content="Shine Studio, ShineStudio.in, Photography, Wedding Photography, Pre wedding, Birthday, Maternity, Premium Photographer, Cinematography, Delhi NCR, India" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1,user-scalable=0,maximum-scale=1" />
        <link rel="canonical" href="//shinestudio.in" />
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=no" />
    </head>
      <body className={cs(inter.className, styles.body)}>{children}</body>
    </html>
  )
}
