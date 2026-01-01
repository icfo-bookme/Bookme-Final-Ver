export default async function getTourList({ id }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tourpackages/propertySummary/${id}`,{
    next: { revalidate: 43200 },
  });
  const packages = await res.json();
  return packages;
}