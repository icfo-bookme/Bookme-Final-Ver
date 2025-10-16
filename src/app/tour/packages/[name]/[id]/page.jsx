import PackageListingSearch from '@/components/tourPackages/ListingSearch/Search';
import TourList from '@/components/tourPackages/TourList';
import getTourList from '@/services/packages/getPropertyList';

export async function generateMetadata({ params }) {
  const { name } = params;
  const title = `${name} Tour Packages | BookMe`;
  const description = `Explore the best tour packages in ${name} with BookMe. Choose from a variety of curated experiences including sightseeing tours, island trips, river cruises, cultural excursions, and adventure packages. Whether you're planning a family getaway, a solo adventure, or a group trip, our flexible and personalized tour packages ensure an unforgettable journey. Book your ${name} tour package now and make your visit hassle-free, memorable, and truly special.`;
  const keywords = [
    `${name} tour packages`,
    `tours in ${name}`,
    `book ${name} tours`,
    `sightseeing in ${name}`,
    `adventure tours ${name}`,
    `cultural tours ${name}`,
    `family tours in ${name}`,
    `group tours ${name}`,
    `island trips in ${name}`,
    `river cruises in ${name}`,
  ];

  return {
    title,
    description,
    keywords,
  };
}
export default async function PackagesPage({ params }) {
  const { id } = params;

  const data = await getTourList({ id });
  if (!data) {
    throw new Error('Failed to fetch data');
  }

  return (
    <div className="  md:px-4 py-8">
      <div className='md:container max-w-7xl md:w-[90%] mx-auto'>
        <div className='pt-12 px-4 md:px-0'>
          <PackageListingSearch />
        </div>
        <div className='bg-blue-100 mx-auto  rounded-md'>
          <TourList tours={data} />
        </div>
      </div>
    </div>
  );
}