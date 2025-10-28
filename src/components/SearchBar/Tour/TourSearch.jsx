'use client';

import { useRouter } from "next/navigation";
import { useSearchData } from "@/hooks/useSearchData";
import { FaHiking } from "react-icons/fa";
import AnimatedSearch from "@/utils/AnimatedSearch";
import slugify from "@/utils/slugify";

const TourSearchBar = () => {
  const router = useRouter();
  const { data: activitiesData, loading, error } = useSearchData('tour');

  const handleSearch = (selectedItem) => {
    const slug = slugify(selectedItem.name);
    if (selectedItem.type === "property") {
      router.push(`/${slug}/${selectedItem.id}`);
    } else {
      const slug = slugify(`${selectedItem.name}, ${selectedItem.country}`);
      router.push(`/tour/packages/${slug}/${selectedItem.id}`);
    }
  };

  const formatResultText = (item) => {
    if (item.type === "property") {
      return item.name; 
    }
    return `${item.name}, ${item.country}`;
  };
  const formatDisplayText = () => "ACTIVITIES/DESTINATION";


  if (error) return <div className="bg-white max-w-5xl mx-auto pb-6 text-center text-red-500">{error}</div>;

  return (
    <AnimatedSearch
      data={activitiesData}
      searchType="tour"
      placeholderConfig={{
        prefix: "Search Tour Packages For",
        showPrefix: true
      }}
      buttonText="Search Tour Packages"
      icon={FaHiking}
      onSearch={handleSearch}
      formatResultText={formatResultText}
      formatDisplayText={formatDisplayText}
      resultUrlTemplate="/tour/packages/{slug}/{id}"
      router={router}
    />
  );
};

export default TourSearchBar;