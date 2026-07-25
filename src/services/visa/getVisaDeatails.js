import { fetchJson } from '@/api/fetchData';

const getVisaDetails = async (id) => {
  return fetchJson(`/api/propertySummary/4/${id}`);
};

export default getVisaDetails;