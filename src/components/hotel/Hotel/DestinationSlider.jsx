

import DestinationSliderClient from "./DestinationSliderClient";

async function getDestinationData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/destinations`);
    if (!response.ok) throw new Error('Failed to fetch destinations');
    
    const data = await response.json();
    return data.slice(0, 21); 
  } catch (error) {
    console.error('Error fetching destination data:', error);
    return [];
  }
}

export default async function DestinationSliderPage() {
  const destinations = await getDestinationData();
  
  return <DestinationSliderClient destinations={destinations} />;
}
