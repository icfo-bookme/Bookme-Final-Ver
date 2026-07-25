import CarRentalSearchBar from '@/components/car/CarRentalSearchBar';
import VehicleList from '@/components/car/VehicleList';
import getCarBrand from '@/services/Car/getCarBrand';
import getCarList from '@/services/Car/getCarList';
import getCarModel from '@/services/Car/getCarModel';
import getDestination from '@/services/Car/getDestination';

export default async function page({ params, searchParams }) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const { dropoff: dropoffId, date: pickupDate, time: pickupTime } = resolvedSearchParams;
  

  const [data, brands, models, destination] = await Promise.all([
    getCarList({ id, searchParams: resolvedSearchParams }),
    getCarBrand(),
    getCarModel(),
    getDestination(),
  ]);
  
  if (!data) {
    throw new Error('Failed to fetch data');
  }

  const initialSearchParams = {
    pickupId: id ? parseInt(id, 10) : null,
    dropoffId: dropoffId ? parseInt(dropoffId, 10) : null,
    pickupDate: pickupDate,
    pickupTime: pickupTime
  };

  return (
    <div className="md:px-4 py-8 bg-blue-100">
      <div className='md:container max-w-7xl md:w-[90%] mx-auto'>
        <div className='pt-5 md:w-[97%] mx-auto px-4 mb-6 md:mb-0 md:px-0'>
          <CarRentalSearchBar 
            locationsData={destination} 
            initialParams={initialSearchParams} 
          />
        </div>
        <div className='bg-blue-100 mx-auto rounded-md'>
          <VehicleList vehicles={data} models={models} brands={brands} />
        </div>
      </div>
    </div>
  );
}