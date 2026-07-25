import { fetchJson } from '@/api/fetchData';

export default async function getPropertyDetails({ id }) {
  try {
    const property = await fetchJson(`/api/tourpackages/propertydetails/${id}`);

    if (
      property == null ||
      (typeof property === 'object' && Object.keys(property).length === 0)
    ) {
      return [];
    }

    return property;
  } catch (error) {
    console.error("Fetch failed:", error);
    return [];
  }
}
