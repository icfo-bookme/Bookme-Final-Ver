import { fetchJson } from '@/api/fetchData';

const getPopularSummary = async (locationId) => {
  return fetchJson(`/api/popularPropertySummary/${locationId}`);
};

export default getPopularSummary;
