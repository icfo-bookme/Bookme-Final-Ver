import { fetchJson } from '@/api/fetchData';

const getDestination = async () => {
  return fetchJson('/api/hotel/destinations');
};

export default getDestination;
