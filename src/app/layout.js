import { Inter } from "next/font/google";
import Footer from "../components/shared/Footer/Footer";
import "./globals.css";
import { SearchProvider } from "@/context/SearchContext";
import { PaginationProvider } from "@/context/usePagination";
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

  // Add this for Google site name
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

export default function DashboardLayout({ children }) {
  return (
    <html lang="en" data-theme="white">
      <head>
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
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-WMVC1JFLFC"></Script>
        <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WMVC1JFLFC');
        `}
      </Script>
      </head>
      <body className={inter.className}>
        <PaginationProvider>
          <SearchProvider>
            <UserProvider>
              <div className="bg-white">
                <HeaderWrapper />
                <main className="min-h-[100vh] py-[12px]">
                  {children}
                </main>
                <Footer />
              </div>
            </UserProvider>
          </SearchProvider>
        </PaginationProvider>
      </body>
    </html>
  );
}