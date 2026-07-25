import { fetchData } from '@/api/fetchData';

async function getcartsession(id) {
  return fetchData(`/api/cart-sessions/${id}`);
}
export default getcartsession;
