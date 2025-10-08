import { Roboto } from "next/font/google";
import { Suspense } from "react";
import Banner from "./components/Home/Banner";
import Sundarban from "./components/Home/sundarban/sundarban";

import getServicesData from "@/services/homepage/getServicesData";
import HpmepageBlog from "./components/pre-footer-content/Homepage";
import HotelMain from "./components/Home/Hotel/Main";
import TravelBookingTabs from "./components/SearchBar/SearchBar";
import VisaMain from "./components/Home/Visa/Main";
import TangourMain from "./components/Home/Tangour/Main";
import LoadingSpinner from "./components/SearchBar/Hotels/LoadingSpinner";
import FlightRoute from "./components/Home/Flight/FlightRoute";
import CTASection from "./components/Home/CTASection/CTASection";
import Faq from "./components/Faq/Faq";
import PromotionsMain from "./components/Home/Promotion/main";
import SaintMartin from "./components/Home/Saintmartin/Main";

export const dynamic = "force-dynamic";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: "BookMe - Hotels, Flights, Visa, Ship Tickets & Tour Packages Worldwide",
  description:
    "Book hotels, flights, visas, car rentals, cruises, and tour packages worldwide with BookMe. Find the best travel deals, last-minute discounts, and secure bookings with ease.",
  keywords: [
    // Primary (Brand + Core Global)
    "BookMe", "online travel booking", "cheap flights", "hotel booking platform",
    "global travel deals", "tour packages", "car rental service", "visa application service",
    "cruise booking", "holiday booking site", "travel agency", "vacation booking",
    "travel deals", "discount travel booking", "worldwide travel services",
    "travel planning platform", "book travel online", "cheap vacation deals",

  
    // Flights
    "book domestic flights", "book international flights", "cheap flight tickets online",
    "last-minute flight deals", "business class flight booking", "economy class ticket booking",
    "cheap airfare", "flight booking discounts", "multi-city flight booking",
    "Dhaka to Dubai flights", "Bangkok to Singapore flights",
    "air ticket booking platform", "low-cost airline booking",

    // Visa
    "tourist visa application", "visa service", "US visa assistance",
    "UK visa application online", "Thailand visa processing",
    "visa application assistance", "fast visa service", "visa support service",
    "international visa requirements", "student visa service", "work visa processing",
    "business visa application", "visa documentation support",

    // Tour Packages
    "family holiday packages", "Maldives honeymoon packages", "Europe tour deals",
    "luxury travel packages", "custom travel planning", "group travel packages",
    "adventure travel deals", "international holiday packages",
    "budget holiday packages", "honeymoon travel packages",
    "guided tours", "affordable tour packages", "all-inclusive travel deals",

    // Car Rentals
    "rent a car near airport", "car rental", "luxury car hire",
    "luxury car rentals for families", "one-way car rental", "international car rental service",
    "cheap car hire online", "affordable car rentals", "car rental with driver",
    "daily car rental service", "monthly car rental service", "car hire for vacation",

    // Ships & Cruises
    "cruise booking online", "luxury cruise deals", "ferry tickets booking",
    "family cruise vacations","Sundarban ships Ticket Booking",
    "river cruise booking", "cheap cruise vacations", "last-minute cruise booking",

    // Long-Tail - High Intent
    "book cheap hotel near me",
    "affordable Maldives honeymoon package",
    "Dhaka to Dubai cheap flight booking online",
    "book Saint Martin ship ticket online",
    "last-minute flight deals to Cox'sbazar",
    "rent a car near International Airport",
    "best budget hotels near Dhaka, Chittagong",
    "cheap family cruise vacation in the Cox's bazar",
    "luxury Europe tour package with flights included",
    "fast visa processing service for Thailand",
    "discount Maldives all-inclusive honeymoon deal",
    "best Sundarban cruise package for family trip",
    "book cheap domestic flight tickets online",
    "secure online visa application for Europe",
    "last-minute luxury hotel booking deals",
    "cheap group tour package",
    "discount car rental near Chattogram airport",
    "affordable beach resort",
    "guided international holiday tour package",
  ],
   alternates: {
    canonical: 'https://bookme.com.bd',
  },
};

const mainComponentMap = {
  Visa: VisaMain,
  Hotel: HotelMain,
  Ships: null,
  Flight: null,
};

const ShipsSubComponents = {
  "Tanguar Haor": TangourMain,
  Sundarban: Sundarban,
  "Saint Martin": SaintMartin,
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

  const visibleServices = sortedServices.filter(
    (service) => service.isShow === "yes"
  );

  return (
    <main className={`${roboto.className} bg-blue-50`}>
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] md:min-h-[60vh]">
        {/* Banner Background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="h-60 bg-gray-200 animate-pulse" />}>
            <Banner />
          </Suspense>
        </div>

        {/* Search Widget */}
        <div className="absolute top-28 inset-0 z-10 flex items-center justify-center px-4">
          <div className="w-full max-w-5xl mx-auto">
            <Suspense
              fallback={
                <LoadingSpinner />
              }
            >
              <TravelBookingTabs searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 bg-blue-50">
        <div className="w-full max-w-screen-xl mx-auto px-4 space-y-10">
          {servicesData.length > 0 ? (
            <>
              <Suspense
                fallback={<div className="h-40 bg-gray-200 animate-pulse" />}
              >
                <PromotionsMain servicesData={servicesData} />
              </Suspense>

              {visibleServices?.map((service) => {
                if (service.category_name === "Ships") {
                  const ShipsSubCategories = sortedServices
                    .filter(
                      (s) =>
                        Object.keys(ShipsSubComponents).includes(
                          s.category_name
                        ) && s.isShow === "yes"
                    )
                    .sort((a, b) => {
                      const aSerial = a.serialno
                        ? parseInt(a.serialno)
                        : Infinity;
                      const bSerial = b.serialno
                        ? parseInt(b.serialno)
                        : Infinity;
                      return aSerial - bSerial;
                    });

                  return ShipsSubCategories.map((subCategory) => {
                    const SubComponent =
                      ShipsSubComponents[subCategory.category_name];
                    return SubComponent ? (
                      <Suspense
                        key={subCategory.category_name}
                        fallback={
                          <div className="h-40 bg-gray-200 animate-pulse rounded-lg" />
                        }
                      >
                        <SubComponent />
                      </Suspense>
                    ) : null;
                  });
                }

                const Component = mainComponentMap[service.category_name];
                return Component ? (
                  <Suspense
                    key={service.category_name}
                    fallback={
                      <div className="h-40 bg-gray-200 animate-pulse rounded-lg" />
                    }
                  >
                    <Component />
                  </Suspense>
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
      <section>
        <FlightRoute />
      </section>

      <section className="">
        <CTASection />
      </section>

      <section className="">
        <Faq />
      </section>

      {/* Blog Section */}
      <section className="bg-blue-50 py-10">
        <div className="w-full max-w-screen-xl mx-auto px-4">
          <Suspense
            fallback={
              <div className="h-60 bg-gray-200 animate-pulse rounded-lg" />
            }
          >
            <HpmepageBlog />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
