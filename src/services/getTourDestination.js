import { fetchJson } from '@/api/fetchData';

const getTourDestination = async () => {
  return fetchJson('/api/tour/destinations');
};

export default getTourDestination;
