
const getAllHotels = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotels`, { 
        next: { 
          revalidate: 1800 
        } 
      } 
    );
    return await response.json();
  } catch (error) {
    return [];
  }
};

export default getAllHotels;