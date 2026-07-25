import { fetchJson } from '@/api/fetchData';

export default async function getCarBrand() {
  return fetchJson('/api/cars/brand');
}
