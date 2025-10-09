import getPopularSummary from "@/services/tour/getPopularSummary"
import SaintMartinClient from "./SaintMartin";

export default async function SaintMartin() {
  try {
    const locationId = 3;
    const data = (await getPopularSummary(locationId)).slice(0, 12)
    console.log('saintmartin data', data);
    return <SaintMartinClient data={data} />
  } catch (error) {
    console.error("Error fetching Saint Martin data:", error)
    return <SaintMartinClient data={[]} />
  }
}