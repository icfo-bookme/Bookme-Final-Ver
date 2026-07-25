import { fetchJson } from '@/api/fetchData';

export default async function getFlightRoutes(type) {
  return fetchJson(`/api/flight/route/${type}`);
}
