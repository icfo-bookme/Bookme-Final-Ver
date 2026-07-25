import { fetchJson } from '@/api/fetchData';

export default async function getDestination() {
  return fetchJson('/api/car/destinations');
}
