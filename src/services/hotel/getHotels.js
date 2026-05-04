const getHotels = async (page = 1) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const checkinDate = formatDate(today);
  const checkoutDate = formatDate(tomorrow);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/all/hotels?checkin=${checkinDate}&checkout=${checkoutDate}&page=${page}`,
    {
      // ✅ Next.js caching MUST be here (ONLY works in server context)
      next: {
        revalidate: 60 * 60 * 12, // 12 hours
      },
    }
  );

  return response.json();
};

export default getHotels;