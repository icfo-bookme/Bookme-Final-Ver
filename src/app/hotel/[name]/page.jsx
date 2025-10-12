import HotelListContent from "../list/HotelListContent";

export async function generateMetadata({ params }) {
  const { name } = await params;

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

const fetchHotelsByLocation = async (locationID) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/listing/${locationID}`);
  if (!res.ok) throw new Error('Failed to fetch hotels by location');
  const data = await res.json();

  return data.map(hotel => {
    const price = hotel.price_after_discount || 0;
    const numericPrice = typeof price === 'string'
      ? parseFloat(price.replace(/[^0-9.]/g, '')) || 0
      : price || 0;

    return {
      ...hotel,
      numericPrice,
      starNumber: parseInt(hotel.star) || 0,
      hasPrice: numericPrice > 0
    };
  });
};

const fetchHotelsById = async (hotelID) => {
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hotels/list/${hotelID}`);
  if (!res.ok) throw new Error('Failed to fetch hotel by ID');
  const data = await res.json();

  return data.map(hotel => {
    const price = hotel.price_after_discount || 0;
    const numericPrice = typeof price === 'string'
      ? parseFloat(price.replace(/[^0-9.]/g, '')) || 0
      : price || 0;

    return {
      ...hotel,
      numericPrice,
      starNumber: parseInt(hotel.star) || 0,
      hasPrice: numericPrice > 0
    };
  });
};

const fetchAmenities = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/aminities`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return await res.json();
};

export default async function HotelListPage({ searchParams }) {
  const {
    checkin,
    checkout,
    locationID,
    hotelID,
    rooms = '1',
    adult = '2',
  } = await searchParams;

  if (!locationID && !hotelID) {
    return <div className="pt-96 text-red-600">Missing location ID or hotel ID in query parameters.</div>;
  }

  try {
    let hotels = [];
    if (locationID) {
      hotels = await fetchHotelsByLocation(locationID);
    } else if (hotelID) {
      hotels = await fetchHotelsById(hotelID);
    }

    const amenities = await fetchAmenities();

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
        amenities={amenities}
        maxPrice={maxPrice}
      />
    );
  } catch (error) {
    console.error(error);
    return <div className="p-8 text-red-600">Failed to load hotel data. Please try again later.</div>;
  }
}
