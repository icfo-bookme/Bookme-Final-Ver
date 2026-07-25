import { fetchJson } from '@/api/fetchData';

export default async function getActivitiesDestinations() {
  return fetchJson('/api/activities/destinations');
}
