export default async function getProperty(id, page = 1) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/propertyByCategory/${id}?page=${page}`,{
    next: { revalidate: 43200 },
  });
  const packages = await res.json();
  return packages;
}