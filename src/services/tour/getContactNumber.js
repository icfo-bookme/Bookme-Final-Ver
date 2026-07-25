import { fetchJson } from '@/api/fetchData';

const getContactNumber = async () => {
  return fetchJson('/api/contact-attributes');
};

export default getContactNumber;
