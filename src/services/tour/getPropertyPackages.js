const getPropertyPackages = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/propertyUnit/${id}`, {
        next: { revalidate: 43200 },
      }
    );
    const propertyPackages = await response.json();
    return propertyPackages;
  } catch (error) {
    return [];
  }
};

export default getPropertyPackages;
