import React from "react";

const FilterSection = ({
  priceRanges,
  durationRanges,
  filters,
  handleFilterChange,
  resetFilters,
}) => {
  return (
    <div className="bg-white  h-full sticky top-16 p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-4 text-blue-900">Filters</h3>
      
      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-bold text-blue-950 mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.label} className="flex items-center">
              <input
                type="checkbox"
                id={`price-${range.label}`}
                checked={filters.priceRanges.includes(range.label)}
                onChange={() => handleFilterChange("priceRanges", range.label)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`price-${range.label}`} className="ml-2 text-sm text-gray-700">
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Duration Filter */}
      <div className="mb-6">
        <h4 className="font-bold text-blue-950 mb-3">Duration</h4>
        <div className="space-y-2">
          {durationRanges.map((range) => (
            <div key={range.label} className="flex items-center">
              <input
                type="checkbox"
                id={`duration-${range.label}`}
                checked={filters.durations.includes(range.label)}
                onChange={() => handleFilterChange("durations", range.label)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`duration-${range.label}`} className="ml-2 text-sm text-gray-700">
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Clear Filters Button */}
      <button
        onClick={resetFilters}
        className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSection;
