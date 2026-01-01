export default async function getAllProperty() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tourpackages/properties`,{
    next: { revalidate: 43200 },
  });
  const packages = await res.json();
  return packages;
}