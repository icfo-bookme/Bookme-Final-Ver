export const getHeroBanners = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/carousel-slider/destination/${id}`, {
        next: { revalidate: 43200 },
      }
    );
    const HeroBanner = await response.json();
    
    return HeroBanner;
  } catch (error) {
    return [];
  }
};
