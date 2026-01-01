export default async function getActivitiesDestinations() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/activities/destinations`,
    { 
        next: { 
          revalidate: 43200
        } 
      } 
  );
  const destinations = await res.json();
  return destinations;
}