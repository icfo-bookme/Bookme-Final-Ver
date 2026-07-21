const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

const appendSearchParam = (params, key, value) => {
  if (value !== undefined && value !== '') {
    params.append(key, value);
  }
};

const buildSearchParams = ({ checkin, checkout, ...extraParams } = {}) => {
  const params = new URLSearchParams();

  appendSearchParam(params, 'checkin', checkin);
  appendSearchParam(params, 'checkout', checkout);
  appendSearchParam(params, 'name', extraParams.name);
  appendSearchParam(params, 'min_price', extraParams.min_price);
  appendSearchParam(params, 'max_price', extraParams.max_price);
  appendSearchParam(params, 'star_rating', extraParams.star_rating);
  appendSearchParam(params, 'amenities', extraParams.amenities);
  appendSearchParam(params, 'sort_by', extraParams.sort_by);

  return params;
};

const normalizeHotel = (hotel) => {
  const price = hotel.price_after_discount || 0;
  const numericPrice = typeof price === 'string'
    ? parseFloat(price.replace(/[^0-9.]/g, '')) || 0
    : price || 0;

  return {
    ...hotel,
    numericPrice,
    starNumber: parseInt(hotel.star) || 0,
    hasPrice: numericPrice > 0,
  };
};

const fetchHotelData = async (path, checkin, checkout, extraParams = {}) => {
  const params = buildSearchParams({ checkin, checkout, ...extraParams });
  const res = await fetch(`${baseUrl}${path}?${params.toString()}`);

  if (!res.ok) {
    throw new Error('Failed to fetch hotels');
  }

  const data = await res.json();
  return data.map(normalizeHotel);
};

export const fetchHotelsByLocation = (locationID, checkin, checkout, extraParams = {}) =>
  fetchHotelData(`/api/hotel/listing/${locationID}`, checkin, checkout, extraParams);

export const fetchHotelsById = (hotelID, checkin, checkout, extraParams = {}) =>
  fetchHotelData(`/api/hotels/list/${hotelID}`, checkin, checkout, extraParams);

export const fetchAmenities = async () => {
  const res = await fetch(`${baseUrl}/api/aminities`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];
  return res.json();
};
