import { fetchJson } from '@/api/fetchData';

const getHotelOrders = async (id) => {
  return fetchJson(`/api/hotel/orders/${id}`);
};

export default getHotelOrders;
