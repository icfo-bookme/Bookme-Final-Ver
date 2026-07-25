import { fetchJson } from '@/api/fetchData';

const getFacilities = async (id) => {
  return fetchJson(`/api/propertyfacilities/${id}`);
};

export default getFacilities;
