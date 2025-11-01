export default async function getTourDestinations() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tourpackages/destinations`,
    { 
        next: { 
          revalidate: 1800 
        } 
      } 
  );
  const destinations = await res.json();
  return destinations;
}