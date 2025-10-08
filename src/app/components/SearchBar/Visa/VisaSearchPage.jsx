'use client';

import { useRouter } from "next/navigation";
import { useSearchData } from "@/hooks/useSearchData";
import { FaHiking } from "react-icons/fa";
import AnimatedSearch from "@/utils/AnimatedSearch";

const VisaSearch = () => {
  const router = useRouter();
  const { data: activitiesData, loading, error } = useSearchData('visa');

  const handleSearch = (selectedItem) => {
    const slug = `${selectedItem.name}`
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
    router.push(`/visa/${slug}/${selectedItem.id}`);
  };

  const formatResultText = (item) => `${item.name}`;
  const formatDisplayText = () => "VISA DESTINATION";

  if (error) return <div className="bg-white max-w-5xl mx-auto pb-6 text-center text-red-500">{error}</div>;

  return (
    <AnimatedSearch
      data={activitiesData}
      searchType="visa"
      placeholderConfig={{
        prefix: "Search Visa For",
        showPrefix: true
      }}
      buttonText="Search Visa"
     
      onSearch={handleSearch}
      formatResultText={formatResultText}
      formatDisplayText={formatDisplayText}
      resultUrlTemplate="/visa/{slug}/{id}"
      router={router}
    />
  );
};

export default VisaSearch;