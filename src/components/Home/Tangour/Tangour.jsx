import TourSwiper from "@/utils/TourSwiper";

export default function Tangour({ data = [] }) {
  return (
    <TourSwiper
      data={data}
      title="Popular Tangour Haor Boats"
      seeMoreLink="/tour/tanguar-haor/1"
      tourType="tangour"
      showContactNumber={true}
    />
  );
}