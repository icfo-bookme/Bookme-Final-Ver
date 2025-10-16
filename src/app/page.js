import { Roboto } from "next/font/google";
import { Suspense } from "react";
import nextDynamic from "next/dynamic"; 
import Banner from "../components/Home/Banner";
import getServicesData from "@/services/homepage/getServicesData";
import LoadingSpinner from "../components/SearchBar/Hotels/LoadingSpinner";
import TravelBookingTabs from "../components/SearchBar/SearchBar";
import PromotionsMain from "../components/Home/Promotion/main";
import LazySection from "../components/shared/LazySection";


// Dynamic imports (use nextDynamic)
const VisaMain = nextDynamic(() => import("../components/Home/Visa/Main"), { ssr: true });
const HotelMain = nextDynamic(() => import("../components/Home/Hotel/Main"), { ssr: true });
const TangourMain = nextDynamic(() => import("../components/Home/Tangour/Main"), { ssr: true });
const Sundarban = nextDynamic(() => import("../components/Home/sundarban/sundarban"), { ssr: true });
const SaintMartin = nextDynamic(() => import("../components/Home/Saintmartin/Main"), { ssr: true });
const CTASection = nextDynamic(() => import("../components/Home/CTASection/CTASection"), { ssr: true });
const Faq = nextDynamic(() => import("../components/Faq/Faq"), { ssr: true });
const FlightRoute = nextDynamic(() => import("../components/Home/Flight/FlightRoute"), { ssr: true });
const HomepageBlog = nextDynamic(() => import("../components/pre-footer-content/Homepage"), { ssr: true });

export const dynamic = "force-dynamic"; 

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

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
  openGraph: {
    title: "BookMe – Your All-in-One Travel Booking Platform",
    description:
      "Easily book hotels, flights, and tour packages worldwide with exclusive deals from BookMe.",
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
    description:
      "Find and book the best hotels, flights, and tours globally with BookMe.",
    images: ["https://bookme.com.bd/og-image.jpg"],
    creator: "@BookMeBD",
  },
};

export default async function Home({ searchParams }) {
  let servicesData = [];
  try {
    servicesData = await getServicesData();
  } catch (error) {
    console.error("Error fetching services data:", error);
  }

  const sortedServices = [...servicesData].sort((a, b) => {
    const aSerial = a.serialno ? parseInt(a.serialno) : Infinity;
    const bSerial = b.serialno ? parseInt(b.serialno) : Infinity;
    return aSerial - bSerial;
  });

  const visibleServices = sortedServices.filter((s) => s.isShow === "yes");

  const ShipsSubComponents = {
    "Tanguar Haor": TangourMain,
    Sundarban,
    "Saint Martin": SaintMartin,
  };

  const mainComponentMap = {
    Visa: VisaMain,
    Hotel: HotelMain,
    Ships: null,
    Flight: null,
  };

  return (
    <main className={`${roboto.className} bg-blue-50`}>
     
      <section className="relative w-full min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="h-60 bg-gray-200 animate-pulse" />}>
            <Banner />
          </Suspense>
        </div>

        <div className="absolute top-28 inset-0 z-10 flex items-center justify-center px-4">
          <div className="w-full max-w-5xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <TravelBookingTabs searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* === Services Section === */}
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-4 space-y-10">
          {servicesData.length > 0 ? (
            <>
              <PromotionsMain servicesData={servicesData} />

              {visibleServices.map((service) => {
                if (service.category_name === "Ships") {
                  const ShipsSubCategories = sortedServices.filter(
                    (s) =>
                      Object.keys(ShipsSubComponents).includes(s.category_name) &&
                      s.isShow === "yes"
                  );

                  return ShipsSubCategories.map((subCategory) => {
                    const SubComponent = ShipsSubComponents[subCategory.category_name];
                    return (
                      <LazySection
                        key={subCategory.category_name}
                        placeholder={<div className="h-40 bg-gray-200 animate-pulse rounded-lg" />}
                      >
                        <SubComponent />
                      </LazySection>
                    );
                  });
                }

                const Component = mainComponentMap[service.category_name];
                return Component ? (
                  <LazySection
                    key={service.category_name}
                    placeholder={<div className="h-40 bg-gray-200 animate-pulse rounded-lg" />}
                  >
                    <Component />
                  </LazySection>
                ) : null;
              })}
            </>
          ) : (
            <p className="text-center text-red-600 text-lg font-semibold py-12">
              Failed to load services data. Please try again later.
            </p>
          )}
        </div>
      </section>

      {/* === Below-the-fold (Lazy Rendered) === */}
      <LazySection placeholder={<div className="h-40 bg-gray-200 animate-pulse" />}>
        <FlightRoute />
      </LazySection>

      <LazySection placeholder={<div className="h-60 bg-gray-200 animate-pulse" />}>
        <CTASection />
      </LazySection>

      <LazySection placeholder={<div className="h-60 bg-gray-200 animate-pulse" />}>
        <Faq />
      </LazySection>

      <LazySection placeholder={<div className="h-60 bg-gray-200 animate-pulse" />}>
        <HomepageBlog />
      </LazySection>
    </main>
  );
}
