import { fetchJson } from '@/api/fetchData';

export const getPropertyImages = async (id) => {
  return fetchJson(`/api/propertyImages/${id}`);
};
