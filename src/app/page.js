import { Roboto } from "next/font/google";
import { Suspense } from "react";
import nextDynamic from "next/dynamic";

import Banner from "../components/Home/Banner";
import TravelBookingTabs from "../components/SearchBar/SearchBar";
import PromotionsMain from "../components/Home/Promotion/main";
import LazySection from "../components/shared/LazySection";
import LoadingSpinner from "../components/SearchBar/Hotels/LoadingSpinner";

import getServicesData from "@/services/homepage/getServicesData";

// Skeleton Placeholder Component
const Skeleton = ({ className = "h-40" }) => (
  <div className={`w-full bg-gray-200 animate-pulse rounded-lg ${className}`} />
);

// Dynamic Imports with Skeleton Fallbacks
const VisaMain = nextDynamic(() => import("../components/Home/Visa/Main"), { loading: () => <Skeleton height="h-60" /> });
const HotelMain = nextDynamic(() => import("../components/Home/Hotel/Main"), { loading: () => <Skeleton height="h-60" /> });
const TangourMain = nextDynamic(() => import("../components/Home/Tangour/Main"));
const Sundarban = nextDynamic(() => import("../components/Home/sundarban/Main"));
const SaintMartin = nextDynamic(() => import("../components/Home/Saintmartin/Main"));

const FlightRoute = nextDynamic(() => import("../components/Home/Flight/FlightRoute"));
const CTASection = nextDynamic(() => import("../components/Home/CTASection/CTASection"));
const Faq = nextDynamic(() => import("../components/Faq/Faq"));
const HomepageBlog = nextDynamic(() => import("../components/pre-footer-content/Homepage"));

export const dynamic = "force-dynamic";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"], display: "swap" });

// Clean Component Lookup Registry
const SERVICE_COMPONENTS = {
  Visa: VisaMain,
  Hotel: HotelMain,
  "Tanguar Haor": TangourMain,
  Sundarban: Sundarban,
  "Saint Martin": SaintMartin,
};

export default async function Home({ searchParams }) {
  let servicesData = [];

  try {
    servicesData = (await getServicesData()) || [];
  } catch (error) {
    console.error("Error fetching services data:", error);
  }

  const sortedServices = servicesData
    .filter((s) => s.isShow === "yes")
    .sort((a, b) => Number(a.serialno || 999) - Number(b.serialno || 999));

  return (
    <main className={`${roboto.className} bg-blue-50 min-h-screen`}>
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<Skeleton className="h-60" />}>
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

      {/* Dynamic Services Section */}
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-4 space-y-10">
          {servicesData.length === 0 ? (
            <p className="text-center text-red-600 text-lg font-semibold py-12">
              Failed to load services data. Please try again later.
            </p>
          ) : (
            <>
              <PromotionsMain servicesData={servicesData} />

              {/* Render dynamic components without extra nested loops */}
              {sortedServices.map((service) => {
                const Component = SERVICE_COMPONENTS[service.category_name];
                if (!Component) return null;

                return (
                  <LazySection key={service.id || service.category_name} placeholder={<Skeleton />}>
                    <Component />
                  </LazySection>
                );
              })}
            </>
          )}
        </div>
      </section>

      {/* Below-the-Fold Sections */}
      <LazySection placeholder={<Skeleton className="h-40" />}>
        <FlightRoute />
      </LazySection>

      <LazySection placeholder={<Skeleton className="h-60" />}>
        <CTASection />
      </LazySection>

      <LazySection placeholder={<Skeleton className="h-60" />}>
        <Faq />
      </LazySection>

      <LazySection placeholder={<Skeleton className="h-60" />}>
        <HomepageBlog />
      </LazySection>
    </main>
  );
}