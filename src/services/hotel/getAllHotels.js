
import { fetchJson } from '@/api/fetchData';

const getAllHotels = async (page = 1) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const checkinDate = formatDate(today);
  const checkoutDate = formatDate(tomorrow);

  try {
    return await fetchJson('/api/hotels', {
      params: { checkin: checkinDate, checkout: checkoutDate, page },
      fetchOptions: { cache: 'no-store' },
      revalidate: 0,
    });
  } catch (error) {
    return [];
  }
};

export default getAllHotels;
