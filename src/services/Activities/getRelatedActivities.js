import { fetchJson } from '@/api/fetchData';

export default async function getRelatedActivities(destination_id, property_id) {
  return fetchJson(`/api/related/properties/${destination_id}/${property_id}`);
}
