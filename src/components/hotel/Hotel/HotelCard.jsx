"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import slugify from "@/utils/slugify";
import LazyLoader from "@/utils/LazyLoader";

const calcDiscountPrice = (price, discount) =>
  Math.round(price * (1 - discount / 100));

export default function HotelCard({ hotelData = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const filteredHotels = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return term
      ? hotelData.filter((h) =>
          h?.hotel_name?.toLowerCase().includes(term)
        )
      : hotelData;
  }, [hotelData, searchTerm]);

  const visibleHotels = filteredHotels.slice(0, visibleCount);

  return (
    <div className="container mx-auto px-4">
    
      <div className=" top-16 z-20 bg-white rounded-xl lg:w-[50%] lg:mx-auto py-3 shadow-sm border-b border-gray-200 -mx-4 px-4">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search hotels by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full py-3 h-12 px-4 pr-12 rounded-lg border text-gray-800 border-blue-500 outline-none ring-2 ring-blue-500 shadow-sm"
            />
            <FaSearch className="absolute right-4 text-gray-400" />
          </div>

          {/* Suggestions */}
          {showSuggestions && filteredHotels.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {filteredHotels.slice(0, 8).map((hotel) => (
                <div
                  key={hotel.hotel_id}
                  onClick={() => {
                    setSearchTerm(hotel.hotel_name);
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-2 hover:bg-blue-50 text-gray-950 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <p className="font-medium">{hotel.hotel_name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <CiLocationOn className="text-gray-800" />
                    {hotel.street_address || "No address"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleHotels.length > 0 ? (
          visibleHotels.map((hotel) => {
            const original =
              Number(hotel?.original_price) ||
              Number(hotel?.lowest_price) ||
              0;
            const discount = Number(hotel?.discount) || 0;
            const hasDiscount = discount > 0;
            const price = hasDiscount
              ? calcDiscountPrice(original, discount)
              : original;
            const img = `${baseUrl}/storage/${hotel.image}`;

            return (
              <div
                key={hotel.hotel_id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 w-full">
                  <Image
                    src={img}
                    alt={hotel.hotel_name || "Hotel"}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  {hasDiscount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        href={`/hotel/list/details/${slugify(
                          hotel.hotel_name
                        )}/${hotel.hotel_id}`}
                      >
                        <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                          {hotel.hotel_name}
                        </h3>
                      </Link>
                      <div className="flex items-center text-yellow-600">
                        <FaStar className="text-sm mr-1" />
                        <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded">
                          {hotel.star_rating || "0"}★
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 flex items-start">
                      <FaMapMarkerAlt className="mr-1 mt-0.5 text-gray-500" />
                      {hotel.street_address || "Unknown location"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                    <p className="text-blue-600 font-bold">
                      {price
                        ? `${price.toLocaleString()} BDT / night`
                        : "Contact for price"}
                    </p>
                    <Link
                      href={`/hotel/list/details/${slugify(
                        hotel.hotel_name
                      )}/${hotel.hotel_id}`}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                      style={{
                        background: "linear-gradient(90deg, #313881, #0678B4)",
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 col-span-full">
            <h3 className="text-lg font-medium text-gray-700">
              No hotels found
            </h3>
            <p className="text-gray-500 mt-1">
              {searchTerm
                ? `No hotels match "${searchTerm}".`
                : "No hotels available right now."}
            </p>
          </div>
        )}
      </div>

   
      <LazyLoader
        totalItems={filteredHotels.length}
        initialCount={12}
        increment={12}
        onVisibleChange={setVisibleCount}
        loadingText="Loading more hotels..."
      />
    </div>
  );
}
