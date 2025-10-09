import Footer from "./components/shared/Footer/Footer";
import "./globals.css";
import { Inter } from "next/font/google";
import { SearchProvider } from "@/SearchContext";
import { PaginationProvider } from "@/services/tour/usePagination";
import HeaderWrapper from "./components/HeadWrapper/HeaderWrapper";
import { UserProvider } from "@/lib/UserContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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
        <title>BookMe</title>
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
