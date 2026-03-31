const getRooms = async (hotelId, checkin, checkout) => {
  try {

    console.log('getRooms called with:', { hotelId, checkin, checkout });
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => {
      return date.toISOString().split('T')[0]; 
    };

    const checkinDate = checkin ? checkin : formatDate(today);
    const checkoutDate = checkout ? checkout : formatDate(tomorrow);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/rooms/${hotelId}?checkin=${checkinDate}&checkout=${checkoutDate}`,
      {
        next: { revalidate: 43200 },
      }
    );

    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const data = await response.json();
    const rooms = (Array.isArray(data) ? data : data?.rooms) ?? [];

    return { success: true, rooms, error: null };

  } catch (error) {
    console.error('getRooms error:', error);

    return { success: false, rooms: [], error: error.message };
  }
};

export default getRooms;