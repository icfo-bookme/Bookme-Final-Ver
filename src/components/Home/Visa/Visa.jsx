import CommonSwiper from "@/utils/CommonSwiper";

export default function Visa({ data = [] }) {

  return (
    <CommonSwiper
      data={data}
      title="Popular Visa Destinations"
      seeMoreLink="/visa"
      seeMoreText="Destinations"
      basePath="/visa"
      gradient="linear-gradient(90deg, #313881, #0678B4)"
      emptyMessage="No visa destinations available at the moment."
    />
  );
}