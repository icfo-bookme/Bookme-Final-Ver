import { fetchJson } from '@/api/fetchData';

export default async function getProperty(id, page = 1) {
  return fetchJson(`/api/propertyByCategory/${id}`, { params: { page } });
}
