export default async function getRelatedActivities(destination_id, property_id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/related/properties/${destination_id}/${property_id}`, {
    next: { revalidate: 43200 },
  });

  const data = await res.json();
  return data;
}
