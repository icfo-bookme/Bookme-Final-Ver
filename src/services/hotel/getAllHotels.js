
const getAllHotels = async () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const checkinDate = formatDate(today);
  const checkoutDate = formatDate(tomorrow);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotels?checkin=${checkinDate}&checkout=${checkoutDate}`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    return await response.json();
  } catch (error) {
    return [];
  }
};

export default getAllHotels;