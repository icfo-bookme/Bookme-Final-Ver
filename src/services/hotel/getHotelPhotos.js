
import { fetchJson } from '@/api/fetchData';

const getHotelPhotos = async (hotelId) => {
  return fetchJson(`/api/hotel/images/${hotelId}`);
};

export default getHotelPhotos;
