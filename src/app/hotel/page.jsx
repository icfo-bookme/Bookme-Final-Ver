import getAllHotels from '@/services/hotel/getAllHotels';
import HotelHeroSection from '@/app/components/hotel/Hotel/HotelHeroSection';
import HotelCTA from '@/app/components/hotel/Hotel/HotelCTA';
import HotelCard from '@/app/components/hotel/Hotel/HotelCard';
import HotelLoadingSkeleton from '@/app/components/hotel/Hotel/HotelLoadingSkeleton';

export const metadata = {
  title: "Hotels | BookMe",
  description: "Explore a wide range of hotels in popular destinations. Find the best deals, compare amenities, and book comfortable stays for families, couples, and solo travelers. Enjoy a hassle-free booking experience with BookMe.",
};


function calculateDiscountedPrice(originalPrice, discount) {
  return Math.round(originalPrice * (1 - discount / 100));
}

export default async function HotelHome() {
  let hotelData = [];
  let loading = false;

  try {
    loading = true;
    const hotelResult = await getAllHotels();
    hotelData = hotelResult;
    loading = false;
  } catch (error) {
    console.error("Failed to fetch hotel data:", error);
    loading = false;
  }

  if (loading) {
    return <HotelLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen">
      <HotelHeroSection />
      <main className="container mx-auto ">
        <section className="mt-12 ">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-center mb-2 text-blue-950">
            Best Hotels for Your Next Trip
          </h2>
          <HotelCard hotelData={hotelData} />
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