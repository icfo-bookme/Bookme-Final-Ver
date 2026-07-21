import HotelListContent from "../list/HotelListContent";
import { fetchHotelsByLocation, fetchHotelsById, fetchAmenities } from '@/services/hotel/hotelData';

export async function generateMetadata({ params }) {
  const { name } = params;

  const title = name ? `${name} Hotels | BookMe` : "Hotels | BookMe";

  const description = name
    ? `Discover the best hotels in ${name}, offering comfortable rooms, excellent amenities, and top-notch services for travelers of all kinds. Whether you are planning a family vacation, a business trip, or a romantic getaway, explore a wide range of hotels to suit every budget and preference. Compare prices, read reviews, and find exclusive deals to make your stay in ${name} enjoyable and memorable. Book now to secure the perfect accommodation and enjoy a hassle-free experience in one of the most beautiful destinations.`
    : `Find the best hotels with affordable prices and exceptional amenities. Browse through a wide variety of accommodations suitable for families, couples, and solo travelers. Compare hotel prices, read genuine reviews, and discover exclusive deals to make your stay comfortable and enjoyable. Plan your trip with ease and secure the best options for your visit. Enjoy quality services, convenient locations, and a memorable experience while traveling. Book your hotel today and make your journey stress-free and enjoyable.`;

  const dynamicKeywords = name
    ? [
      `${name} hotels`,
      `book hotels in ${name}`,
      `${name} hotel deals`,
      `cheap hotels in ${name}`,
      `luxury hotels in ${name}`,
      `stay in ${name}`,
      `${name} travel`,
      `${name} hotel booking`,
      `${name} budget hotels and resorts`,
      `${name} best resorts for honeymoon`,
      `family friendly resorts in ${name}`,
    ]
    : [];

  return {
    title,
    description,
    keywords: [...dynamicKeywords],
  };
}

export default async function HotelListPage({ searchParams }) {
  const {
    checkin,
    checkout,
    locationID,
    hotelID,
    rooms = '1',
    adult = '2',
    name,
    min_price,
    max_price,
    star_rating,
    amenities,
    sort_by,
  } = searchParams;

  if (!locationID && !hotelID) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Missing location ID or hotel ID in query parameters.
      </div>
    );
  }


  try {
    let hotels = [];
    if (locationID) {
      hotels = await fetchHotelsByLocation(locationID, checkin, checkout, {
        name,
        min_price,
        max_price,
        star_rating,
        amenities,
        sort_by,
      });
    } else if (hotelID) {
      hotels = await fetchHotelsById(hotelID, checkin, checkout, {
        name,
        min_price,
        max_price,
        star_rating,
        amenities,
        sort_by,
      });
    }

    const amenitiesList = await fetchAmenities();

    const pricedHotels = hotels.filter(hotel => hotel.hasPrice);
    const maxPrice = pricedHotels.length > 0
      ? Math.ceil(Math.max(...pricedHotels.map(h => h.numericPrice)) / 1000) * 1000
      : 10000;

    return (
      <HotelListContent
        checkin={checkin}
        checkout={checkout}
        locationID={locationID}
        hotelID={hotelID}
        rooms={rooms}
        adult={adult}
        hotels={hotels}
        amenities={amenitiesList}
        maxPrice={maxPrice}
        initialName={name || ''}
        initialMinPrice={min_price}
        initialMaxPrice={max_price}
        initialStarRating={star_rating || ''}
        initialAmenities={amenities || ''}
        initialSortBy={sort_by || ''}
      />
    );
  } catch (error) {
    console.error(error);
    return <div className="p-8 text-red-600">Failed to load hotel data. Please try again later.</div>;
  }
}