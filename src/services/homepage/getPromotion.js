import { fetchData } from '@/api/fetchData';

async function getPromotion() {
  return fetchData('/api/homepage/hot-package');
}

export default getPromotion;
