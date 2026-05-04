"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaSearch, FaRegClock } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { PiUsersThree } from "react-icons/pi";
import { GoCommentDiscussion } from "react-icons/go";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { GiDiamondHard } from "react-icons/gi";
import LazyLoader from "@/utils/LazyLoader";
import slugify from "@/utils/slugify";

function calculateDiscountedPrice(originalPrice, discount) {
    return Math.round(originalPrice * (1 - discount / 100));
}



// Function to format duration summary
function formatDuration(durationValue) {
    if (!durationValue || typeof durationValue !== 'string') {
        return durationValue;
    }

    // Check if it matches the duration pattern (e.g., "0h 0m to 4h 30m", "1h 0m to 2h 0m", etc.)
    const durationPattern = /^(\d+h\s?\d*m?)\s+to\s+(\d+h\s?\d*m?)$/i;
    const match = durationValue.match(durationPattern);

    if (!match) {
        return durationValue;
    }

    const startTime = match[1].trim();
    const endTime = match[2].trim();

    // Parse hours and minutes
    const parseTime = (timeStr) => {
        const hoursMatch = timeStr.match(/(\d+)h/i);
        const minutesMatch = timeStr.match(/(\d+)m/i);

        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
        const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

        return { hours, minutes, totalMinutes: hours * 60 + minutes };
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    // If start is 0h 0m, return only end time
    if (start.totalMinutes === 0) {
        return formatTime(end.hours, end.minutes);
    }

    // Format both start and end times
    const formattedStart = formatTime(start.hours, start.minutes);
    const formattedEnd = formatTime(end.hours, end.minutes);

    return `${formattedStart} to ${formattedEnd}`;
}

function formatTime(hours, minutes) {
    if (hours === 0 && minutes === 0) {
        return "0m";
    }

    if (hours === 0) {
        return `${minutes}m`;
    }

    if (minutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
}

const ActivitiesCard = ({ packageData = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const [visibleCount, setVisibleCount] = useState(12);


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
            case 'MdOutlineFreeCancellation':
                return <MdOutlineFreeCancellation className="mr-1 mt-0.5 flex-shrink-0" />;
            case 'GiDiamondHard':
                return <GiDiamondHard className="mr-1 mt-0.5 flex-shrink-0" />;
            default:
                return null;
        }
    };

    const getFormattedSummaryValue = (summary) => {
        if (summary.icon_name === 'FaRegClock' && summary.value) {
            return formatDuration(summary.value);
        }
        return summary.value;
    };

    return (
        <div className="container mx-auto px-4">
            {/* Sticky Search Bar Container */}
            

            {/* Main Content */}
            <div className="pt-4 pb-6">
                {packageData?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {packageData
                            ?.slice(0, visibleCount)
                            .map(pkg => {
                                const price = Number(pkg?.price) || 0;
                                const discountPercent = Number(pkg?.discount_percent) || 0;
                                const discountAmount = Number(pkg?.discount_amount) || 0;
                                const finalPrice = pkg?.final_price ||
                                    (discountPercent > 0
                                        ? calculateDiscountedPrice(price, discountPercent)
                                        : price - discountAmount);

                                const imageUrl = pkg?.image
                                    ? `${baseUrl}/storage/${pkg.image}`
                                    : "/default-tour.jpg";

                                return (
                                    <div
                                        key={pkg.id}
                                        className="bg-gray-100 w-[96%] mx-auto rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 relative"
                                    >
                                        {/* Discount Badge */}
                                        {(discountPercent > 0 || discountAmount > 0) && (
                                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                                                {discountPercent > 0
                                                    ? `${discountPercent}% OFF`
                                                    : `${discountAmount} BDT OFF`}
                                            </div>
                                        )}

                                        <div className="relative h-40 sm:h-48 w-full">
                                            <Image
                                                src={imageUrl}
                                                alt={`Image of ${pkg.property_name} tour package, BookMe Travel Service, Exciting Tour Packages Available, Affordable Prices. Travel Activities.`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        </div>

                                        <div className="p-3 sm:p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <Link
                                                    href={`/${slugify(pkg.property_name)}/${pkg.id}`}
                                                >
                                                    <h3 className="text-base sm:text-lg font-bold text-blue-950 hover:text-blue-700 transition-colors">
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
                                            <div className="h-28">
                                                {pkg.summaries && pkg.summaries.length > 0 && (
                                                    <>
                                                        <div className="grid grid-cols-4 gap-2 mb-3 text-xs sm:text-sm text-gray-600">
                                                            {pkg.summaries.slice(0, 2).map((summary, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-start col-span-2"
                                                                >
                                                                    {renderSummaryIcon(summary.icon_name)}
                                                                    <span className="ml-1">{getFormattedSummaryValue(summary)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-2 mb-3 text-xs sm:text-sm text-gray-600">
                                                            {pkg.summaries.slice(2, 3).map((summary, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-start col-span-4"
                                                                >
                                                                    {renderSummaryIcon(summary.icon_name)}
                                                                    <span className="ml-1">{getFormattedSummaryValue(summary)}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                                <div>
                                                    <p className="text-2xs xs:text-xs text-gray-500">
                                                        Starting From
                                                    </p>
                                                    <div className="flex items-center">
                                                        {discountPercent > 0 || discountAmount > 0 ? (
                                                            <>
                                                                <p className="text-base sm:text-lg font-bold text-blue-600">
                                                                    {finalPrice.toLocaleString()} BDT
                                                                </p>
                                                                {price > 0 && (
                                                                    <p className="text-xs text-gray-500 line-through ml-2">
                                                                        {price.toLocaleString()} BDT
                                                                    </p>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <p className="text-base sm:text-lg font-bold text-blue-600">
                                                                {price > 0 ? `${price.toLocaleString()} BDT` : "Price on request"}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/${slugify(pkg.property_name)}/${pkg.id}`}
                                                    style={{
                                                        background: "linear-gradient(90deg, #313881, #0678B4)",
                                                    }}
                                                    className="px-3 sm:px-4 py-1.5 sm:py-2 hover:opacity-90 text-white text-sm font-medium rounded-lg transition-colors duration-200"
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

                        {searchTerm && similarPackages.length > 0 && (
                            <div className="mt-6 max-w-md mx-auto">
                                <h4 className="font-medium text-gray-700 mb-2">Did you mean:</h4>
                                <div className="grid gap-2">
                                    {similarPackages.map(pkg => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => selectSuggestion(pkg.property_name)}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
                                        >
                                            {pkg.property_name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <LazyLoader
                totalItems={packageData.length}
                initialCount={12}
                increment={12}
                onVisibleChange={setVisibleCount}
                loadingText="Loading more Activities..."
            />
        </div>

    );
};

export default ActivitiesCard;