export default async function getCarBrand() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cars/brand`);
  const packages = await res.json();
  return packages;
}