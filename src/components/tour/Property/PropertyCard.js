"use client";

import Image from "next/image";
import Link from "next/link";
import PropertyAmenities from "./PropertyAmenities";
import PropertyContactButtons from "./PropertyContactButtons";
import slugify from "@/utils/slugify";

export default function PropertyCard({ property, index, onCardClick, contact }) {

  const containsBangla = (text) => /[\u0980-\u09FF]/.test(text);

  const propertyName = property.property_name;

  const propertySlug = slugify(propertyName);

  const price = property?.pricing?.final_price;
  const originalPrice = property?.pricing?.original_price;
  const discount = property?.pricing?.discount_percent;

  return (
    <div data-index={index} className="mb-5">

      <div className="shadow-custom flex flex-col lg:flex-row gap-5 pt-5 pl-5 pr-5 pb-0 rounded bg-white relative">

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-5 right-5 lg:top-5 lg:left-[315px] z-10 w-14 h-14 p-2 text-white text-center font-semibold text-sm bg-red-700 rounded-full flex items-center justify-center">
            {discount}% OFF
          </div>
        )}

        {/* Image */}
        <div className="md:min-w-[400px] relative">

          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${property.main_img}`}
            alt={property.property_name}
            width={500}
            height={300}
            className="object-cover w-full md:w-[300px] md:h-[230px] h-[200px] mx-auto"
          />

        </div>

        {/* Content */}
        <div className="flex flex-col w-full pr-4 pb-4">

          {/* Title */}
          <Link
            href={`/Property/${propertySlug}/${property.property_id}`}
            onClick={() => onCardClick(index)}
          >
            <h1 className="font-heading font-semibold text-lg text-[#00026E]">
              {property.property_name}
            </h1>
          </Link>

          {/* Price */}
          <h1 className="font-normal text-sm text-[#00026E] text-right md:mb-0 mb-[20px]">

            Starting from <br />

            <span className="font-bold text-lg text-blue-900">

              {price ? (
                <>
                  {price.toLocaleString()} TK
                </>
              ) : (
                "contact for price"
              )}

            </span>

            {originalPrice > price && (
              <div className="text-sm line-through text-gray-400">
                {originalPrice?.toLocaleString()} TK
              </div>
            )}

          </h1>

          {/* Amenities */}
          {property.property_summaries && (
            <div className="flex flex-col gap-3">

              <PropertyAmenities summaries={property.property_summaries} />

              {/* Buttons */}
              <div className="flex flex-row flex-wrap md:justify-between items-center gap-[5px] sm:gap-[25px]">

                <div className="flex">

                  <Link
                    href={`/Property/${propertySlug}/${property.property_id}`}
                    onClick={() => onCardClick(index)}
                    className="text-white font-medium py-2 px-4 rounded-md text-sm text-center transition-all duration-300 transform hover:scale-[1.03] shadow-md hover:shadow-lg flex items-center"
                    style={{
                      background: "linear-gradient(90deg, #313881, #0678B4)",
                    }}
                  >
                    See Details
                  </Link>

                  <Link
                    href={`/Property/${propertySlug}/${property.property_id}`}
                    onClick={() => onCardClick(index)}
                    className="ml-2 text-white font-medium py-2 px-4 rounded-md text-sm text-center transition-all duration-300 transform hover:scale-[1.03] shadow-md hover:shadow-lg flex items-center"
                    style={{
                      background: "linear-gradient(90deg, #313881, #0678B4)",
                    }}
                  >
                    Book Now
                  </Link>

                </div>

                <PropertyContactButtons
                  contactNumber={contact}
                  pid={property.property_id}
                />

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
