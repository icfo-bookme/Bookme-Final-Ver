import { fetchJson } from '@/api/fetchData';

const getFooterPolicy = async () => {
  return fetchJson('/api/footer-policies');
};

export default getFooterPolicy;
