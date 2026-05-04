export const revalidate = 60;
import HotelCTA from '@/components/hotel/Hotel/HotelCTA';
import HeroSection from '../../components/Activities/ActivitiesPage/HeroSection';
import ActivitiesCard from '../../components/Activities/ActivitiesPage/ActivitiesCard';
import getProperty from '@/services/getProperty';
import Pagination from '@/utils/Pagination';

export const metadata = {
  title: "Activities & Experiences | BookMe",
  description: "Discover a wide range of activities and experiences to make your trip memorable. From thrilling adventures to relaxing tours, explore options with detailed information, pricing, and exclusive deals. Plan and book exciting experiences easily with BookMe.",
  alternates: {
    canonical: "https://bookme.com.bd/activities",
  },
};


export default async function HotelHome({ searchParams }) {
  const page = searchParams?.page || 1;
  const data = await getProperty(6, page);
  const activities = data.data || [];
  const pagination = data.pagination;

  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="" id="list-start"></div>
      <main className="container mx-auto ">
        <section className="mt-12 ">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-center mb-2 text-blue-950">
            Best Activities for Your Next Trip
          </h2>
          <ActivitiesCard packageData={activities} />
          {activities.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No Activities found. Please try a different search.
            </div>
          )}
        </section>
        <div className="m-8">
          <Pagination pagination={pagination} page={page} route="/activities" />
        </div>
        <HotelCTA />
      </main>
    </div>
  );
}