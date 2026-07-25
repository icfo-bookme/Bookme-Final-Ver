import { fetchJson } from '@/api/fetchData';

export default async function getActivities() {
  return fetchJson('/api/activities');
}
