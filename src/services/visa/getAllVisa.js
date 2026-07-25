import { fetchJson } from '@/api/fetchData';

const getAllVisa = async () => {
  return fetchJson('/api/countries/visa');
};

export default getAllVisa;