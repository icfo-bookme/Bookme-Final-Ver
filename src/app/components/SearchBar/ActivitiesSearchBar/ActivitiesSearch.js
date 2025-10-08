'use client';

import { useRouter } from "next/navigation";
import { useSearchData } from "@/hooks/useSearchData";
import { FaHiking } from "react-icons/fa";
import AnimatedSearch from "@/utils/AnimatedSearch";

const ActivitiesSearchBar = () => {
  const router = useRouter();
  const { data: activitiesData, loading, error } = useSearchData('activities');

  const handleSearch = (selectedItem) => {
    const slug = `${selectedItem.name}, ${selectedItem.country}`
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
    router.push(`/activities/list/${slug}/${selectedItem.id}`);
  };

  const formatResultText = (item) => `${item.name}, ${item.country}`;
  const formatDisplayText = () => "ACTIVITIES/DESTINATION";


  if (error) return <div className="bg-white max-w-5xl mx-auto pb-6 text-center text-red-500">{error}</div>;

  return (
    <AnimatedSearch
      data={activitiesData}
      searchType="activities"
      placeholderConfig={{
        prefix: "Search Activities For",
        showPrefix: true
      }}
      buttonText="Search Activities"
      icon={FaHiking}
      onSearch={handleSearch}
      formatResultText={formatResultText}
      formatDisplayText={formatDisplayText}
      resultUrlTemplate="/activities/list/{slug}/{id}"
      router={router}
    />
  );
};

export default ActivitiesSearchBar;