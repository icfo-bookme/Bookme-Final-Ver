import { Inter } from "next/font/google";
import Footer from "../components/shared/Footer/Footer";
import "./globals.css";
import HeaderWrapper from "../components/HeadWrapper/HeaderWrapper";
import { UserProvider } from "@/context/UserContext";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "BookMe - Book Hotels, Flights & Tour Packages Worldwide",
  description:
    "Book hotels, flights, visas, and tours with BookMe. Find top travel deals and secure bookings instantly.",
  keywords: [
    "BookMe",
    "book hotels online",
    "cheap flights",
    "visa services",
    "tour packages",
    "global travel deals",
    "online booking site",
    "travel agency",
    "holiday deals",
  ],
  alternates: {
    canonical: "https://bookme.com.bd",
  },
  metadataBase: new URL("https://bookme.com.bd"),
  applicationName: "BookMe",
  openGraph: {
    siteName: "BookMe",
    url: "https://bookme.com.bd",
    type: "website",
  },
  other: {
    "apple-mobile-web-app-title": "BookMe",
    "application-name": "BookMe",
  },
};

export default function Layout({ children }) {
  return (
    <html lang="en" data-theme="white">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TPGZ8PRZ');
          `}
        </Script>

        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>

      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TPGZ8PRZ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <UserProvider>
          <div className="bg-white">
            <HeaderWrapper />
            <main className="min-h-[100vh] py-[12px]">{children}</main>
            <Footer />
          </div>
        </UserProvider>
      </body>
    </html>
  );
}