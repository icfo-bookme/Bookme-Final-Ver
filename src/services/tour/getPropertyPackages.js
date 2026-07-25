import { fetchJson } from '@/api/fetchData';

const getPropertyPackages = async (id) => {
  return fetchJson(`/api/propertyUnit/${id}`);
};

export default getPropertyPackages;
