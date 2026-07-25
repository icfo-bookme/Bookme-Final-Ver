"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import slugify from "@/utils/slugify";
import LazyLoader from "@/utils/LazyLoader";

const calcDiscountPrice = (price, discount) =>
  Math.round(price * (1 - discount / 100));

export default function HotelCard({ hotelData = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const visibleHotels = hotelData.slice(0, visibleCount);

  return (
    <div className="container mx-auto px-4">

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
                    alt={hotel.hotel_name ? `Image of ${hotel.hotel_name} hotel, Hotel Booking,  Travel with BookMe.` : "Hotel Image"}
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
                        href={`/hotels/list/details/${slugify(
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
                      href={`/hotels/list/details/${slugify(
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
        totalItems={hotelData.length}
        initialCount={12}
        increment={12}
        onVisibleChange={setVisibleCount}
        loadingText="Loading more hotels..."
      />


    </div>
  );
}
