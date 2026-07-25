import { fetchJson } from '@/api/fetchData';

export default async function getAllProperty() {
  return fetchJson('/api/tourpackages/properties');
}
