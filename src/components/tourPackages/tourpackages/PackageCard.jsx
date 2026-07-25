"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaSearch, FaRegClock } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { PiUsersThree } from "react-icons/pi";
import { GoCommentDiscussion } from "react-icons/go";
import slugify from "@/utils/slugify";
import LazyLoader from "@/utils/LazyLoader";



const TourPackageCard = ({ packageData = [] }) => {
    const [visibleCount, setVisibleCount] = useState(12);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const renderSummaryIcon = (iconName) => {
        switch (iconName) {
            case 'IoLocationOutline':
                return <IoLocationOutline className="mr-1 mt-0.5 flex-shrink-0" />;
            case 'FaRegClock':
                return <FaRegClock className="mr-1 mt-0.5 flex-shrink-0" />;
            case 'PiUsersThree':
                return <PiUsersThree className="mr-1 mt-0.5 flex-shrink-0" />;
            case 'GoCommentDiscussion':
                return <GoCommentDiscussion className="mr-1 mt-0.5 flex-shrink-0" />;
            default:
                return null;
        }
    };
    return (
        <div className="container mx-auto px-4">
            {/* Main Content */}
            <div className="pt-4 pb-6">
                {packageData?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {packageData?.slice(0, visibleCount)?.map(pkg => {
                            const price = Number(pkg?.price) || 0;
                            const imageUrl = pkg?.image
                                ? `${baseUrl}/storage/${pkg.image}`
                                : "/default-tour.jpg";

                            return (
                                <div
                                    key={pkg.id}
                                    className="bg-gray-100 w-[96%] mx-auto rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className="relative h-40 sm:h-48 w-full">
                                        <Image
                                            src={imageUrl}
                                            alt={`Image of ${pkg.property_name}, Tour Packages, Tour Activities, BookMe Accommodation, Comfortable Stay, Affordable Prices.`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            priority={pkg.id === 455} // Just an example priority
                                        />
                                        {/* You can add discount badges here if needed */}
                                    </div>

                                    <div className="p-3 sm:p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <Link
                                                href={`/${slugify(pkg.property_name)}/${pkg.id}`}
                                            >
                                                <h3 className="text-base sm:text-lg font-bold text-blue-950 ">
                                                    {pkg.property_name || "No Name"}
                                                </h3>
                                            </Link>
                                        </div>

                                        <div className="flex items-start text-gray-600 text-xs sm:text-sm mb-3">
                                            <FaMapMarkerAlt className="mr-1 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">
                                                {pkg.address || "Unknown location"}
                                            </span>
                                        </div>

                                        {/* Package Summaries */}
                                        <div className="grid grid-cols-4 gap-2 mb-3 text-xs sm:text-sm text-gray-600">
                                            {pkg.summaries?.slice(1, 3).map((summary, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start col-span-2"
                                                >
                                                    {renderSummaryIcon(summary.icon_name)}
                                                    <span className="ml-1">{summary.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Package Summaries */}
                                        <div className="space-y-2 mb-3">
                                            {pkg.summaries?.slice(3, 4).map((summary, index) => (
                                                <div key={index} className="flex items-start text-xs sm:text-sm text-gray-600">
                                                    {renderSummaryIcon(summary.icon_name)}
                                                    <span>{summary.value}</span>
                                                </div>
                                            ))}
                                        </div>


                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <div>
                                                <p className="text-2xs xs:text-xs text-gray-500">
                                                    Starting From
                                                </p>

                                                {price && price > 0 ? (
                                                    <p className="text-base sm:text-lg font-bold text-blue-600">
                                                        {price.toLocaleString()} BDT
                                                    </p>
                                                ) : (
                                                    <p className="text-base font-medium text-blue-500">
                                                        Contact for price
                                                    </p>
                                                )}
                                            </div>

                                            <Link
                                                href={`/${slugify(pkg.property_name)}/${pkg.id}`}
                                                style={{
                                                    background: "linear-gradient(90deg, #313881, #0678B4)",
                                                }}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-700">No tour packages found</h3>
                        <p className="text-gray-500 mt-2">
                            {searchTerm
                                ? `No packages match "${searchTerm}". Try a different search term.`
                                : "No tour packages available at the moment."}
                        </p>


                    </div>
                )}
            </div>
            <LazyLoader
                totalItems={packageData?.length}
                initialCount={12}
                increment={12}
                onVisibleChange={setVisibleCount}
                loadingText="Loading more packages..."
            />
        </div>
    );
};

export default TourPackageCard;