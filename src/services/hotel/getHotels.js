import { fetchJson } from '@/api/fetchData';

const getHotels = async (page = 1) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const checkinDate = formatDate(today);
  const checkoutDate = formatDate(tomorrow);

  return fetchJson('/api/all/hotels', {
    params: { checkin: checkinDate, checkout: checkoutDate, page },
  });
};

export default getHotels;