export default async function getActivitiesList({ id }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/activities/propertyList/${id}`,{
    next: { revalidate: 43200 },
  });
  const packages = await res.json();
  return packages;
}