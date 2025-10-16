import TourSwiper from "@/utils/TourSwiper";


export default function SaintMartinClient({ data = [] }) {

    return (
        <TourSwiper
            data={data}
            title="Popular Saint Martin Ships"
            seeMoreLink="/tour/Saint-martin-ships/3"
            tourType="saintmartin"
            showContactNumber={true}
        />
    );
}