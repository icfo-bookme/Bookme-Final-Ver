export default async function getActivities( ) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/activities`, {
    next: { revalidate: 43200 }, 
  });
  const activities = await res.json();
  return activities;
}