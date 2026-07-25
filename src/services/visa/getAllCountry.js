import { fetchJson } from '@/api/fetchData';

const getAllCountry = async (id) => {
  return fetchJson('/api/countries/visa');
};

export default getAllCountry;