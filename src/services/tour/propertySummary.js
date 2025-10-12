const propertySummary = async (locationId) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/propertySummary/${locationId}`, {
      next: { revalidate: 43200 },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
};

export default propertySummary;