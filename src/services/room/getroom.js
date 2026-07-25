import { fetchJson } from '@/api/fetchData';

const getRooms = async (hotelId, checkin, checkout) => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const checkinDate = checkin || formatDate(today);
    const checkoutDate = checkout || formatDate(tomorrow);

    const data = await fetchJson(`/api/hotel/rooms/${hotelId}`, {
      params: { checkin: checkinDate, checkout: checkoutDate },
    });

    const rooms = (Array.isArray(data) ? data : data?.rooms) ?? [];

    return { success: true, rooms, error: null };
  } catch (error) {
    console.error('getRooms error:', error);
    return { success: false, rooms: [], error: error.message };
  }
};

export default getRooms;
