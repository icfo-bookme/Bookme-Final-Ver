'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { PiUsersThreeBold } from "react-icons/pi";
import { TbWorldPlus } from "react-icons/tb";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";

const iconSize = "text-base";

const iconMap = {
    FaRegClock: <FaRegClock className={`text-blue-500 ${iconSize}`} />,
    PiUsersThree: <PiUsersThreeBold className={`text-green-600 ${iconSize}`} />,
    TbWorldPlus: <TbWorldPlus className={`text-purple-500 ${iconSize}`} />,
    MdOutlineFreeCancellation: <MdOutlineFreeCancellation className={`text-red-500 ${iconSize}`} />,
};

// Slugify utility
const slugify = (text = "") =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-");

// Improved formatTimeDisplay function
const formatTimeDisplay = (timeString) => {
    if (!timeString) return '';

    // Function to clean individual time parts
    const cleanTimePart = (part) => {
        return part
            .replace(/\b0h\s?/g, '')
            .replace(/\b0m\b/g, '')
            .replace(/\s0min\b/g, '')
            .replace(/\s0m\b/g, '')
            .trim();
    };

    // Check if it contains "to" (range)
    if (timeString.includes(' to ')) {
        const [start, end] = timeString.split(' to ');
        const cleanedStart = cleanTimePart(start);
        const cleanedEnd = cleanTimePart(end);
        
        // If both parts are empty after cleaning, return empty
        if (!cleanedStart && !cleanedEnd) return '';
        
        // If one part is empty, return only the other part
        if (!cleanedStart) return cleanedEnd;
        if (!cleanedEnd) return cleanedStart;
        
        // If both parts have content, join them with " to "
        return `${cleanedStart} to ${cleanedEnd}`;
    } else {
        // Single time value
        const cleaned = cleanTimePart(timeString);
        return cleaned || '';
    }
};

// Get summary text (same as ActivityCard)
const getSummaryText = (summary) => {
    const validKeys = Object.keys(summary).filter(key =>
        key !== 'icon_name' &&
        key !== 'icon_import' &&
        summary[key] &&
        summary[key].trim() !== ''
    );

    if (validKeys.length > 0) {
        const text = summary[validKeys[0]];
        if (validKeys[0] === 'Duration' || text.includes('h') || text.includes('m')) {
            const formattedTime = formatTimeDisplay(text);
            return formattedTime || ''; // Return empty if formatted time is empty
        }
        return text;
    }

    return '';
};

// Get summary key (same as ActivityCard)
const getSummaryKey = (summary) => {
    const validKeys = Object.keys(summary).filter(key =>
        key !== 'icon_name' &&
        key !== 'icon_import' &&
        summary[key] &&
        summary[key].trim() !== ''
    );

    return validKeys.length > 0 ? validKeys[0] : '';
};

const RelatedActivities = ({ packages = [] }) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <h1 className="col-span-full text-2xl font-bold text-gray-800">Related Activities</h1>

            {packages.map((pkg) => (
                <Link href={`/${slugify(pkg.property_name)}/${pkg.id}`} key={pkg.id}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-100 group">
                        <div className="relative w-full h-48">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${pkg.image}`}
                                alt={pkg.property_name ? `Image of ${pkg.property_name} tour package, BookMe Tour Package, Travel with BookMe, Exciting Tour Packages Available, Affordable Prices.` : "Tour Package Image" }
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 30vw, 25vw"
                            />
                            {pkg.discount_percent > 0 && (
                                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    {pkg.discount_percent}% OFF
                                </div>
                            )}
                        </div>

                        <div className="p-5">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-1">
                                {pkg.property_name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-1">{pkg.address}</p>

                            {/* Updated summary display using the same logic as ActivityCard */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {pkg.summaries && pkg.summaries.slice(0, 4).map((summary, i) => {
                                    const summaryText = getSummaryText(summary);
                                    const summaryKey = getSummaryKey(summary);
                                    if (!summaryText) return null;

                                    return (
                                        <span
                                            key={i}
                                            className="flex items-start text-xs text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                            title={summaryKey}
                                        >
                                            <div className="mr-2">
                                                {iconMap[summary.icon_name] || null}
                                            </div>
                                            {summaryText}
                                        </span>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between mt-4 mb-3">
                                <div className="flex items-center">
                                    {(!pkg.final_price || parseFloat(pkg.final_price) === 0) ? (
                                        <span className="text-sm font-medium text-red-600">
                                            Contact for Price
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-lg font-bold text-indigo-600">
                                                {parseFloat(pkg.final_price).toLocaleString()} BDT
                                            </span>
                                            {pkg.discount_percent > 0 && (
                                                <span className="text-sm text-gray-500 line-through ml-2">
                                                    {parseFloat(pkg.price).toLocaleString()} BDT
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>

                                <button
                                    style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                                    className="flex items-center text-white px-3 py-1.5 rounded hover:opacity-90 text-sm font-medium transition-colors group"
                                >
                                    See Details
                                    <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default RelatedActivities;