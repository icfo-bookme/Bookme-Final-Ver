import { fetchJson } from '@/api/fetchData';

const getHotelDetails = async (hotelId) => {
  return fetchJson(`/api/hotel/details/${hotelId}`);
};

export default getHotelDetails;
