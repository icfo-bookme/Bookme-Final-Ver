import { fetchJson } from '@/api/fetchData';

const getCountries = async () => {
  try {
    const countries = await fetchJson('/api/countries');
    return { data: countries };
  } catch (error) {
    return { data: [] };
  }
};

export default getCountries;