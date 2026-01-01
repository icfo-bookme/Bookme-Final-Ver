export default async function getDestination() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/car/destinations`,{
    next: { revalidate: 43200 },
  });
  const destinations = await res.json();
  return destinations;
}