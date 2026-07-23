'use client';
import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TourCard from './TourCard';
import FilterSidebar from './FilterSidebar';

const PRICE_RANGES = [
  { label: 'Under BDT 10,000', min: 0, max: 10000 },
  { label: 'BDT 10,000 - 20,000', min: 10000, max: 20000 },
  { label: 'BDT 20,000 - 50,000', min: 20000, max: 50000 },
  { label: 'Over BDT 50,000', min: 50000, max: Infinity },
];

// const DURATION_BUCKETS = [
//   { label: '1 Night', value: '1' },
//   { label: '2 Nights', value: '2' },
//   { label: '3 Nights', value: '3' },
//   { label: '4 Nights', value: '4' },
//   { label: '5 Nights', value: '5' },
//   { label: 'More than 6 Nights', value: '6+' },
// ];

const parseRangeParam = (value) =>
  String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const getSelectedPriceLabels = (priceRangesParam) => {
  const values = parseRangeParam(priceRangesParam);
  return PRICE_RANGES.filter((range) => values.includes(`${range.min}-${range.max}`)).map((range) => range.label);
};

// const getSelectedDurationLabels = (durationsParam) => parseRangeParam(durationsParam);

// const getTourNights = (tour) => {
//   const durationSummary = tour.summaries?.find((s) => s.icon_name === 'FaRegClock');
//   if (!durationSummary) return null;
//   const match = String(durationSummary.value).match(/(\d+)/);
//   return match ? Number(match[1]) : null;
// };

// const matchesDuration = (tour, selectedDurations) => {
//   const nights = getTourNights(tour);
//   if (nights === null) return false;
//   return selectedDurations.some((duration) => {
//     if (duration === '6+') return nights >= 6;
//     return nights === Number(duration);
//   });
// };

const sortTours = (tours, sortOption) => {
  const items = [...tours];

  if (sortOption === 'price_low' || sortOption === 'price_low_to_high') {
    return items.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  }

  if (sortOption === 'price_high' || sortOption === 'price_high_to_low') {
    return items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  }

  if (sortOption === 'name_az') {
    return items.sort((a, b) => (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' }));
  }

  if (sortOption === 'name_za') {
    return items.sort((a, b) => (b.title || '').localeCompare(a.title || '', undefined, { sensitivity: 'base' }));
  }

  return items;
};

const TourList = ({ tours }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortOption = searchParams.get('sort_by') ?? '';
  const priceRangesParam = searchParams.get('price_ranges') ?? '';
  // const durationsParam = searchParams.get('durations') ?? '';

  const selectedPriceRanges = useMemo(() => getSelectedPriceLabels(priceRangesParam), [priceRangesParam]);
  // const selectedDurations = useMemo(() => getSelectedDurationLabels(durationsParam), [durationsParam]);
  const activeFilterCount = selectedPriceRanges.length; // + selectedDurations.length;

  const filteredTours = useMemo(() => {
    let result = [...tours];

    if (selectedPriceRanges.length > 0) {
      result = result.filter((tour) =>
        selectedPriceRanges.some((label) => {
          const range = PRICE_RANGES.find((item) => item.label === label);
          return range && Number(tour.price) >= Number(range.min) && Number(tour.price) <= Number(range.max);
        })
      );
    }

    // if (selectedDurations.length > 0) {
    //   result = result.filter((tour) => matchesDuration(tour, selectedDurations));
    // }

    return sortTours(result, sortOption);
  }, [tours, selectedPriceRanges, sortOption]);

  const updateQuery = (updateParams) => {
    const params = new URLSearchParams(searchParams.toString());
    updateParams(params);
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    updateQuery((params) => {
      if (value) params.set('sort_by', value);
      else params.delete('sort_by');
    });
  };

  const handleFilterChange = (filterType, value) => {
    updateQuery((params) => {
      const currentValues = parseRangeParam(filterType === 'priceRanges' ? params.get('price_ranges') : params.get('durations'));
      const nextValue = filterType === 'priceRanges'
        ? `${PRICE_RANGES.find((item) => item.label === value)?.min ?? ''}-${PRICE_RANGES.find((item) => item.label === value)?.max ?? ''}`
        : value;
      const updatedValues = currentValues.includes(nextValue)
        ? currentValues.filter((item) => item !== nextValue)
        : [...currentValues, nextValue];

      if (updatedValues.length > 0) {
        params.set(filterType === 'priceRanges' ? 'price_ranges' : 'durations', updatedValues.join(','));
      } else {
        params.delete(filterType === 'priceRanges' ? 'price_ranges' : 'durations');
      }
    });
  };

  const resetFilters = () => {
    updateQuery((params) => {
      params.delete('price_ranges');
      params.delete('durations');
      params.delete('sort_by');
    });
  };

  return (
    <div className="px-4 md:py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1">
          <FilterSidebar
            tours={tours}
            filters={{
              priceRanges: selectedPriceRanges,
              // durations: selectedDurations,
            }}
            priceRanges={PRICE_RANGES}
            // durationOptions={DURATION_BUCKETS}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        <div className="col-span-1 md:col-span-3">
          <div className="flex flex-col md:flex-row justify-between gap-4 pb-2">
            <div>
              <h1 className="text-blue-950 text-xl font-bold">
                <span>{filteredTours.length}</span> Packages Found
              </h1>
              {activeFilterCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">{activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm text-blue-600 border border-blue-600 rounded-md px-3 py-1 hover:bg-blue-50 transition-colors"
                >
                  Reset filters
                </button>
              )}

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 hidden sm:inline-block">Sort by:</span>
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
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
            ) : (
              <div className="col-span-3 text-center py-10">
                <h3 className="text-lg font-medium text-gray-700">No tours match your filters</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourList;
