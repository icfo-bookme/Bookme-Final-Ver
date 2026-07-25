import { fetchJson } from '@/api/fetchData';

const getproperties = async (id) => {
  return fetchJson(`/api/ships/${id}`);
};

export default getproperties;
