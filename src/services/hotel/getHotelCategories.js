
import { fetchJson } from '@/api/fetchData';

const getHotelCategories = async () => {
  return fetchJson('/api/hotel/categories');
};

export default getHotelCategories;
