const getHotelDetails = async (hotelId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/details/${hotelId}`,{
        next: { revalidate: 43200 },
      }
    );
    return await response.json();
  } catch (error) {
    return [];
  }
};

export default getHotelDetails;