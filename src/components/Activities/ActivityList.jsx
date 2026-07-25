'use client';

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FiFilter } from "react-icons/fi";
import ActivityCard from "./ActivityCard";
import FilterSection from "./FilterSection";

const PRICE_RANGES = [
  { label: "Under BDT 10,000", min: 0, max: 10000 },
  { label: "BDT 10,000 - 20,000", min: 10000, max: 20000 },
  { label: "BDT 20,000 - 50,000", min: 20000, max: 50000 },
  { label: "Over BDT 50,000", min: 50000, max: Infinity },
];

const DURATION_RANGES = [
  { label: "0 to 30 minutes", min: 0, max: 30 },
  { label: "30 minutes to 1 hour", min: 30, max: 60 },
  { label: "1 to 5 hours", min: 60, max: 300 },
  { label: "5 hours to 1 day", min: 300, max: 1440 },
];

const parseRangeParam = (paramValue) =>
  String(paramValue ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getSelectedPriceLabels = (priceRanges, priceRangesParam) => {
  const selectedValues = parseRangeParam(priceRangesParam);
  return priceRanges
    .filter((range) => selectedValues.includes(`${range.min}-${range.max}`))
    .map((range) => range.label);
};

const getSelectedDurationLabels = (durationRanges, durationParam) => {
  const selectedValues = parseRangeParam(durationParam);
  return durationRanges
    .filter((range) => selectedValues.includes(`${range.min}-${range.max}`))
    .map((range) => range.label);
};

const getActiveFilterCount = (priceRanges, durationRanges) =>
  priceRanges.length + durationRanges.length;

const sortActivities = (activities, sortOption) => {
  const items = [...activities];

  if (sortOption === "price_low" || sortOption === "price_low_to_high") {
    return items.sort((a, b) => parseFloat(a.final_price || a.price || 0) - parseFloat(b.final_price || b.price || 0));
  }

  if (sortOption === "price_high" || sortOption === "price_high_to_low") {
    return items.sort((a, b) => parseFloat(b.final_price || b.price || 0) - parseFloat(a.final_price || a.price || 0));
  }

  if (sortOption === "name_az") {
    return items.sort((a, b) =>
      (a.property_name || "").localeCompare(b.property_name || "", undefined, { sensitivity: "base" })
    );
  }

  if (sortOption === "name_za") {
    return items.sort((a, b) =>
      (b.property_name || "").localeCompare(a.property_name || "", undefined, { sensitivity: "base" })
    );
  }

  return items;
};

const ActivityList = ({ activities }) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sortOption = searchParams.get("sort_by") ?? "";
  const priceRangesParam = searchParams.get("price_ranges") ?? "";
  const durationParam = searchParams.get("duration") ?? "";

  const selectedPriceRanges = useMemo(
    () => getSelectedPriceLabels(PRICE_RANGES, priceRangesParam),
    [priceRangesParam]
  );

  const selectedDurations = useMemo(
    () => getSelectedDurationLabels(DURATION_RANGES, durationParam),
    [durationParam]
  );

  const selectedFiltersCount = useMemo(
    () => getActiveFilterCount(selectedPriceRanges, selectedDurations),
    [selectedPriceRanges, selectedDurations]
  );

  const hasActiveFilters = selectedFiltersCount > 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showModal && modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  const updateQuery = (updateParams) => {
    const params = new URLSearchParams(searchParams.toString());
    updateParams(params);
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    updateQuery((params) => {
      if (value) params.set("sort_by", value);
      else params.delete("sort_by");
    });
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "priceRanges") {
      const range = PRICE_RANGES.find((item) => item.label === value);
      updateQuery((params) => {
        if (!range) return;

        const currentRanges = parseRangeParam(params.get("price_ranges") ?? "");
        const nextValue = `${range.min}-${range.max}`;
        const updatedRanges = currentRanges.includes(nextValue)
          ? currentRanges.filter((item) => item !== nextValue)
          : [...currentRanges, nextValue];

        if (updatedRanges.length > 0) {
          params.set("price_ranges", updatedRanges.join(","));
        } else {
          params.delete("price_ranges");
        }
      });
      return;
    }

    if (filterType === "durations") {
      const range = DURATION_RANGES.find((item) => item.label === value);
      updateQuery((params) => {
        if (!range) return;

        const currentRanges = parseRangeParam(params.get("duration") ?? "");
        const nextDuration = `${range.min}-${range.max}`;
        const updatedRanges = currentRanges.includes(nextDuration)
          ? currentRanges.filter((item) => item !== nextDuration)
          : [...currentRanges, nextDuration];

        if (updatedRanges.length > 0) {
          params.set("duration", updatedRanges.join(","));
        } else {
          params.delete("duration");
        }
      });
    }
  };

  const resetFilters = () => {
    updateQuery((params) => {
      params.delete("price_ranges");
      params.delete("duration");
    });
  };

  const sortedActivities = useMemo(() => sortActivities(activities, sortOption), [activities, sortOption]);

  return (
    <div className="px-4 md:py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:min-h-screen">
        <aside className="sticky top-16 hidden md:block col-span-1 self-start">
          <FilterSection
            priceRanges={PRICE_RANGES}
            durationRanges={DURATION_RANGES}
            filters={{
              priceRanges: selectedPriceRanges,
              durations: selectedDurations,
            }}
            handleFilterChange={handleFilterChange}
            resetFilters={resetFilters}
          />
        </aside>

        <main className="col-span-1 md:col-span-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {sortedActivities.length} {sortedActivities.length === 1 ? "Activity" : "Activities"} Found
              </h2>
              {hasActiveFilters && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedFiltersCount} active {selectedFiltersCount === 1 ? "filter" : "filters"}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm text-blue-600 border border-blue-600 rounded-md px-3 py-1 hover:bg-blue-50 transition-colors"
                >
                  Reset filters
                </button>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-500 hidden sm:inline-block">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 bg-white transition-colors"
                >
                  <option value="">Recommended</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name_az">Name: A-Z</option>
                  <option value="name_za">Name: Z-A</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {sortedActivities.length > 0 ? (
              sortedActivities.map((activity) => <ActivityCard key={activity.id} activity={activity} />)
            ) : (
              <div className="col-span-3 text-center py-10">
                <h3 className="text-lg font-medium text-gray-700">No activities match your filters</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FiFilter size={18} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-white text-blue-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {selectedFiltersCount}
            </span>
          )}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div ref={modalRef} className="bg-white w-full h-[85%] my-auto md:max-w-md md:rounded-lg overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg text-blue-950 font-semibold">Filters</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="p-4 relative overflow-visible">
              <FilterSection
                priceRanges={PRICE_RANGES}
                durationRanges={DURATION_RANGES}
                filters={{
                  priceRanges: selectedPriceRanges,
                  durations: selectedDurations,
                }}
                handleFilterChange={handleFilterChange}
                resetFilters={resetFilters}
              />
            </div>

            <div className="p-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityList;
