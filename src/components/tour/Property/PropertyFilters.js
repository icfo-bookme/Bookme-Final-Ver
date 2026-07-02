"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RangeSlider } from "flowbite-react";
import { FaFilter, FaSortAmountDown } from "react-icons/fa";
import PropertySearch from "./PropertySearch";

export default function PropertyFilters({ id }) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [price, setPrice] = useState(
    Number(searchParams.get("max_price")) || 10000
  );

  const handleApply = (params) => {
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (e) => {

    const params = new URLSearchParams(searchParams);

    params.set("sort", e.target.value);
    params.set("page", 1);

    handleApply(params);
  };

  const handlePriceChange = (value) => {

    setPrice(value);

    const params = new URLSearchParams(searchParams);

    params.set("min_price", 0);
    params.set("max_price", value);
    params.set("page", 1);

    handleApply(params);
  };

  return (
    <div
      className={`mb-8 rounded-lg shadow md:w-[90%] border border-gray-300 mx-auto bg-gray-50 p-5 ${isSearchFocused
        ? "lg:hidden absolute inset-0 h-[20rem] pt-20 px-4 pb-4 z-20"
        : ""
        }`}
    >
      <PropertySearch
        searchTerm={search}
        setSearchTerm={setSearch}
        id={id}

      />

      <div className="flex flex-col lg:flex-row gap-6 w-full">

        {/* PRICE FILTER */}
        <div className="w-full lg:w-2/3 bg-blue-50 p-4 rounded-lg border border-blue-100">

          <div className="flex items-center gap-4">

            <div className="flex items-center gap-2 text-blue-700">
              <FaFilter className="h-5 w-5" />
              <span className="text-sm font-medium">Price Range</span>
            </div>

            <div className="flex-1 flex items-center gap-4">

              <RangeSlider
                min={0}
                max={10000}
                step={500}
                value={price}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full mt-[-18px] appearance-none h-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-bold text-blue-700 whitespace-nowrap min-w-[90px]">
                {price.toLocaleString()}
                {price > 9500 ? "+" : ""} TK
              </span>

            </div>

          </div>

        </div>

        {/* SORT FILTER */}
        <div className="w-full lg:w-1/3 flex items-center gap-3">

          <div className="hidden lg:flex items-center gap-2 text-gray-700">
            <FaSortAmountDown className="h-4 w-4" />
            <span className="text-sm font-medium">Sort by:</span>
          </div>

          <select
            className="w-full border border-gray-300 rounded-lg text-gray-700 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none bg-white shadow-sm"
            defaultValue={searchParams.get("sort") || ""}
            onChange={handleSortChange}
          >
            <option value="">Most Popular</option>
            <option value="price_low_to_high">Price: Low to High</option>
            <option value="price_high_to_low">Price: High to Low</option>
            {/* <option value="popularity">Most Popular</option> */}
          </select>

        </div>

      </div>
    </div>
  );
}