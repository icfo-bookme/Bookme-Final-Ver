import getPopularSummary from "@/services/tour/getPopularSummary";
import SundarbanShipsClient from "./sundarban";

export default async function SundarbanShips() {
    try {
        const locationId = 2;
        const data = await getPopularSummary(locationId);
        
        return <SundarbanShipsClient data={data || []} />;
    } catch (error) {
        console.error("Error fetching Sundarban ships data:", error);
        return <SundarbanShipsClient data={[]} />;
    }
}