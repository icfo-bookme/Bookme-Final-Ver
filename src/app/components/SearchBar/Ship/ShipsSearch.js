'use client';

import { useRouter } from "next/navigation";
import { useSearchData } from "@/hooks/useSearchData";
import AnimatedSearch from "@/utils/AnimatedSearch";

const ShipsSearch = () => {
  const router = useRouter();
  const { data: shipsData, loading, error } = useSearchData('ships');

  const handleSearch = (selectedItem) => {
    const slug = `${selectedItem.name}, ${selectedItem.country}`
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
    router.push(`/ships/${slug}/${selectedItem.id}`);
  };

  const formatResultText = (item) => `${item.name}, ${item.country}`;
  const formatDisplayText = () => "LOCATION/TOUR";

 
  if (error) return <div className="bg-white max-w-5xl mx-auto pb-6 text-center text-red-500">{error}</div>;

  return (
    <AnimatedSearch
      data={shipsData}
      searchType="ships"
      placeholderConfig={{
        prefix: "Search Ships For",
        showPrefix: true
      }}
      buttonText="Search Ships"
      onSearch={handleSearch}
      formatResultText={formatResultText}
      formatDisplayText={formatDisplayText}
      resultUrlTemplate="/ships/{slug}/{id}"
      router={router}
    />
  );
};

export default ShipsSearch;