import { fetchJson } from '@/api/fetchData';

export default async function getCarModel() {
  return fetchJson('/api/cars/model');
}
