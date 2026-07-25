
import { fetchJson } from '@/api/fetchData';

const getAminities = async () => {
  return fetchJson('/api/aminities');
};

export default getAminities;
