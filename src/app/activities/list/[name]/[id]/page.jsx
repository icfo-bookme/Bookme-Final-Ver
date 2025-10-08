import ActivityList from '@/app/components/Activities/ActivityList';
import ActivityListingSearch from '@/app/components/Activities/ActivitySearch';
import getActivitiesList from '@/services/Activities/getActivitiesList';

// Dynamic metadata
export async function generateMetadata({ params }) {
  const { name } = params;

  const title = `${name} Activities | BookMe`;

  const description = `Discover an exciting variety of activities and experiences in ${name}. From thrilling adventures like parasailing, jet skiing, and speed boat rides to relaxing tours, sightseeing, and cultural experiences, BookMe offers something for everyone. Plan your perfect trip and enjoy personalized service, flexible booking options, and safe, unforgettable experiences. Whether you're traveling solo, with family, or in a group, explore the best activities, local attractions, and hidden gems in ${name}. Book now to create lasting memories and make your visit to ${name} truly special.`;

  const keywords = [
    `${name} activities`,
    `things to do in ${name}`,
    `adventure activities in ${name}`,
    `cultural experiences in ${name}`,
    `sightseeing tours in ${name}`,
    `outdoor activities in ${name}`,
    `family-friendly activities in ${name}`,
    `water sports in ${name}`,
    `local attractions in ${name}`,
    `hidden gems in ${name}`,
  ];

  return {
    title,
    description,
    keywords,
  };
}


export default async function PackagesPage({ params }) {
  const { name, id } = await params;

  const data = await getActivitiesList({ id });
  if (!data) {
    throw new Error('Failed to fetch data');
  }

  return (
    <div className="md:px-4 md:py-8">
      <div className='md:container max-w-7xl md:w-[90%] mx-auto'>
        <div className='pt-[50px] px-4 md:px-0'>
          <ActivityListingSearch />
        </div>
        <div className='bg-blue-100 mx-auto pt-1 rounded-md'>
          <ActivityList activities={data} />
        </div>
      </div>
    </div>
  );
}
