export const getPropertyImages = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/propertyImages/${id}`, {
        next: { revalidate: 43200 },
      }
    );
    const propertyImages = await response.json();
    return propertyImages;
  } catch (error) {
    return [];
  }
};
