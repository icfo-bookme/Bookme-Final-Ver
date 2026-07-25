import CommonSwiper from "@/utils/CommonSwiper";

export default function Hotel({ data = [] }) {

  return (
    <CommonSwiper
      data={data}
      title="Popular Hotels & Resorts"
      seeMoreLink="/hotels"
      seeMoreText="Hotels"
      basePath="/hotels/list/details"
      gradient="linear-gradient(90deg, #313881, #0678B4)"
      emptyMessage="No hotels available at the moment."
    />
  );
}
