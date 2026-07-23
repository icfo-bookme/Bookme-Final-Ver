export default async function getActivitiesList({ id, searchParams = {} }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const url = new URL(`${baseUrl}/api/activities/propertyList/${id}`);

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          url.searchParams.append(key, item);
        }
      });
    } else {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 43200 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch activities list: ${res.status}`);
  }

  return res.json();
}
