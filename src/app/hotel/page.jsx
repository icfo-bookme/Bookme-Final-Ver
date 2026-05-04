import HotelHeroSection from "@/components/hotel/Hotel/HotelHeroSection";
import HotelCTA from "@/components/hotel/Hotel/HotelCTA";
import HotelCard from "@/components/hotel/Hotel/HotelCard";
import getHotels from "@/services/hotel/getHotels";
import Pagination from "@/utils/Pagination";


export const metadata = {
  title: "Hotels Booking | Best Deals & Comfortable Stays - BookMe",
  description:
    "Explore and book hotels in top destinations with BookMe...",
  alternates: {
    canonical: "https://bookme.com.bd/hotel",
  },
};

export default async function HotelHome({ searchParams }) {
  const page = searchParams?.page || 1;

  let hotelData = [];
  let pagination = null;

 const hotelResult = await getHotels(page);
 hotelData = hotelResult?.data || [];
    pagination = hotelResult?.pagination;


  return (
    <div className="min-h-screen">
      <HotelHeroSection />
    
      <div className="" id="list-start"></div>
      <main className="container mx-auto">
        <section className="mt-12">
          <h2 className="text-xl font-bold text-center mb-2 text-blue-950">
            Best Hotels for Your Next Trip
          </h2>

          <HotelCard hotelData={hotelData} />

          {/* Pagination UI . */}
         <Pagination pagination={pagination} page={page} route="/hotel" />
          {hotelData.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No hotels found. Please try a different search.
            </div>
          )}
        </section>

        <HotelCTA />
      </main>
    </div>
  );
}