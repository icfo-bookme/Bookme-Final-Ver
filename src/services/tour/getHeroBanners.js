import { fetchJson } from '@/api/fetchData';

export const getHeroBanners = async (id) => {
  return fetchJson(`/api/carousel-slider/destination/${id}`);
};
