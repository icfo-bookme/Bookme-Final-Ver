import TourSwiper from "@/utils/TourSwiper";

export default function SundarbanShipsClient({ data = [] }) {
   
    return (
        <TourSwiper
            data={data}
            title="Popular Sundarban Ships"
            seeMoreLink="/tour/Sundarban/2"
            tourType="sundarban"
        />
    );
}