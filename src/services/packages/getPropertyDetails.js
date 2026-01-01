export default async function getPropertyDetails({ id }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tourpackages/propertydetails/${id}`,{
      next: { revalidate: 43200 },
    });
    if (!res.ok) {
      return [];
    }

    let property;
    try {
      property = await res.json();
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      return [];
    }
    if (
      property == null ||
      (typeof property === 'object' && Object.keys(property).length === 0)
    ) {
      return [];
    }

    return property;
  } catch (error) {
    console.error("Fetch failed:", error);
    return [];
  }
}
