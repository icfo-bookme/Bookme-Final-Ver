export default async function getFlightRoutes(type) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/flight/route/${type}`, { next: { revalidate: 43200 }  });
  const flightRoutes = await res.json();
  return flightRoutes;
} 