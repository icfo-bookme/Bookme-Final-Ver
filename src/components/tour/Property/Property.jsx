"use client";

import PropertyFilters from "./PropertyFilters";
import PropertyCard from "./PropertyCard";
import Banner from "../Banner/Banner";
import Pagination from "@/utils/Pagination";


export default function PropertyList({
  id,
  initialData,
  contact,
  page,
  name,
  sort,
  minPrice,
  maxPrice,
}) {

  const properties = initialData?.data || [];
  const pagination = initialData?.pagination || {};
  return (
    <div className="bg-white">

      {/* Banner */}
      <div className="w-full pt-[40px] md:pt-[50px] relative">

        <Banner id={id} />

        <div className="" id="list-start"></div>
        <div className="hidden w-[80%] mx-auto lg:block absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20">

          <div className="container mx-auto px-4">

            <PropertyFilters id={id} />



          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container bg-white md:w-[85%] mx-auto px-4 pt-16 lg:pt-24">

        {/* Mobile Filter */}
        <div className="lg:hidden mb-6">

          <PropertyFilters id={id} />

        </div>

        {/* Properties */}
        <div className="space-y-6">

          {properties?.map((property, index) => (

            <PropertyCard
              key={property.property_id}
              property={property}
              contact={contact}
              index={index}
            />
          ))}
        </div>

        {/* Pagination */}
        <Pagination pagination={pagination} page={page} route={`/ships/${name}/${id}?sort=${sort}&min_price=${minPrice}&max_price=${maxPrice}`} />
        {properties.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No properties found. Please try a different search.
          </div>
        )}
      </div>
    </div>
  );
}