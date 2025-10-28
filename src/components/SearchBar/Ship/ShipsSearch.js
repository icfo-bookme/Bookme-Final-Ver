'use client';

import { useRouter } from "next/navigation";
import { useSearchData } from "@/hooks/useSearchData";
import AnimatedSearch from "@/utils/AnimatedSearch";
import slugify from "@/utils/slugify";

const ShipsSearch = () => {
  const router = useRouter();
  const { data: shipsData, loading, error } = useSearchData('ships');
  
  const handleSearch = (selectedItem) => {
    console.log("Selected Item:", selectedItem);
    const slug = slugify(selectedItem.name);
    if (selectedItem.type === "property") {
      router.push(`/Property/${slug}/${selectedItem.id}`);
    } else {
      const slug = slugify(`${selectedItem.name}, ${selectedItem.country}`);
      router.push(`/ships/${slug}/${selectedItem.id}`);
    }
  };

  const formatResultText = (item) => {
    if (item.type === "property") {
      return item.name; 
    }
    return `${item.name}, ${item.country}`;
  };

  const formatDisplayText = (item) => { 
    return "LOCATION/PROPERTY";
  };

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