import { fetchData } from '@/api/fetchData';

async function getServicesData() {
  return fetchData('/api/services');
}
export default getServicesData;
