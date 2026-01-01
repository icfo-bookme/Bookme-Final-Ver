export default async function getCarBrand() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cars/brand`,{
    next: { revalidate: 43200 },
  });
  const packages = await res.json();
  return packages;
}