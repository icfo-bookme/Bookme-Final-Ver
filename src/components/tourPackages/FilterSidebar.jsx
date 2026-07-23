'use client';

import { useState } from 'react';
import { FiFilter } from 'react-icons/fi';

const PRICE_RANGES = [
  { label: 'Under BDT 10,000', min: 0, max: 10000 },
  { label: 'BDT 10,000 - 20,000', min: 10000, max: 20000 },
  { label: 'BDT 20,000 - 50,000', min: 20000, max: 50000 },
  { label: 'Over BDT 50,000', min: 50000, max: Infinity },
];

const FilterSidebar = ({ tours, filters, priceRanges, durationOptions = [], onFilterChange, onResetFilters, activeFilterCount = 0 }) => {
  const [showModal, setShowModal] = useState(false);

  const sidebarContent = (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg text-blue-900">Filters</h3>
        {activeFilterCount > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
            {activeFilterCount} active
          </span>
        )}
      </div>
      <hr />

      <div className="my-3">
        <h4 className="font-bold text-sm mb-2 text-blue-900">Price Range</h4>
        <div className="space-y-2 ml-2">
          {priceRanges.map((range, index) => (
            <label key={`${range.label}-${index}`} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.priceRanges.includes(range.label)}
                onChange={() => onFilterChange('priceRanges', range.label)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr />

      <div className="my-3">
        <h4 className="font-bold text-sm mb-2 text-blue-900">Duration</h4>
        <div className="space-y-2 ml-2">
          {durationOptions.map((duration, index) => (
            <label key={`${duration.value}-${index}`} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.durations.includes(duration.value)}
                onChange={() => onFilterChange('durations', duration.value)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{duration.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onResetFilters}
        className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <>
      <div className="hidden md:block sticky top-16">
        {sidebarContent}
      </div>

      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FiFilter size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-white text-blue-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg p-4 max-h-[90vh] overflow-y-auto w-11/12 sm:w-3/4 relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {sidebarContent}

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
