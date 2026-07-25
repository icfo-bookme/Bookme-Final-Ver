import { fetchJson } from '@/api/fetchData';

const getProfileDetails = async (id) => {
  return fetchJson(`/api/customer-details/${id}`);
};

export default getProfileDetails;
