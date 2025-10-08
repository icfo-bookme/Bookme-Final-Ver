export default async function getTourDestinations() {
  const res = await fetch(`https://bookme.com.bd/admin/api/tourpackages/destinations`,
    { 
        next: { 
          revalidate: 1800 
        } 
      } 
  );
  const destinations = await res.json();
  return destinations;
}