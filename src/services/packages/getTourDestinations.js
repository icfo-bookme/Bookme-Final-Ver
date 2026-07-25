import { fetchJson } from '@/api/fetchData';

export default async function getTourDestinations() {
  return fetchJson('/api/tourpackages/destinations');
}
