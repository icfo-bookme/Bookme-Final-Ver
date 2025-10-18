import Footer from "../components/shared/Footer/Footer";
import "./globals.css";
import { Inter } from "next/font/google";
import { SearchProvider } from "@/context/SearchContext";
import { PaginationProvider } from "@/context/usePagination";
import HeaderWrapper from "../components/HeadWrapper/HeaderWrapper";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
export const metadata = {
  title: "BookMe - Book Hotels, Flights & Tour Packages Worldwide",
  icons: {
    icon: "/favicon.ico",
  },
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
  openGraph: {
    title: "BookMe – Your All-in-One Travel Booking Platform",
    description: "Easily book hotels, flights, and tour packages worldwide with exclusive deals from BookMe.",
    url: "https://bookme.com.bd",
    siteName: "BookMe",
    images: [
      {
        url: "https://bookme.com.bd/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookMe Travel Deals and Bookings",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookMe – Hotels, Flights & Tour Packages Worldwide",
    description: "Find and book the best hotels, flights, and tours globally with BookMe.",
    images: ["https://bookme.com.bd/og-image.jpg"],
    creator: "@BookMeBD",
  },
};


export default function DashboardLayout({ children }) {

  return (
    <html lang="en" data-theme="white">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="32x32" />
        <title>BookMe - Easy Online Booking for Trips, Hotels & More</title>
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
