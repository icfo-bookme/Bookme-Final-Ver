export default async function getCarList({ id }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/car/propertyList/${id}`,{
      next: { revalidate: 43200 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch car list: ${res.status} ${res.statusText}`);
      return [];
    }

    const packages = await res.json();

    if (!packages || !Array.isArray(packages)) {
      return [];
    }

    return packages;
  } catch (error) {
    console.error("Error fetching car list:", error);
    return [];
  }
}
