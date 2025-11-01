export default async function getCarModel() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cars/model`, {
    cache: "no-store",
  });
  const packages = await res.json();
  return packages;
}