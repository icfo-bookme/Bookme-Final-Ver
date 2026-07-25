import { fetchJson } from '@/api/fetchData';

const getPropertyDetails = async (id) => {
  return fetchJson(`/api/property-summary/${id}`);
};

export default getPropertyDetails;
