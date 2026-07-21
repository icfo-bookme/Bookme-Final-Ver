'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/hotel/HotelListingSearch/SearchBar';
import Link from 'next/link';
import HotelFilters from '@/components/hotel/HotelListing/HotelFilters';
import HotelCard from '@/components/hotel/HotelListing/HotelCard';

const HotelListContent = ({
  checkin,
  checkout,
  locationID,
  hotelID,
  rooms,
  adult,
  hotels,
  amenities,
  maxPrice,
  initialName = '',
  initialMinPrice,
  initialMaxPrice,
  initialStarRating = '',
  initialAmenities = '',
  initialSortBy = '',
}) => {
  const router = useRouter();
  // Format today/tomorrow for fallback
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const fmt = d => d.toISOString().split('T')[0];
  const defaultCheckin = checkin || fmt(today);
  const defaultCheckout = checkout || fmt(tomorrow);

  // Parse initial filter values from server props
  const parseInitialStars = () => {
    if (!initialStarRating) return [];
    return initialStarRating.split(',').map(Number).filter(s => s >= 1 && s <= 7);
  };

  const parseInitialAmenities = () => {
    if (!initialAmenities) return [];
    return initialAmenities.split(',').map(Number).filter(id => id > 0);
  };

  const parseInitialMinPrice = () => {
    const val = parseInt(initialMinPrice);
    return !isNaN(val) && val >= 0 ? val : 0;
  };

  const parseInitialMaxPrice = () => {
    const val = parseInt(initialMaxPrice);
    return !isNaN(val) && val > 0 ? val : maxPrice;
  };

  const [selectedAmenities, setSelectedAmenities] = useState(parseInitialAmenities());
  const [selectedStars, setSelectedStars] = useState(parseInitialStars());
  const [priceRange, setPriceRange] = useState([parseInitialMinPrice(), parseInitialMaxPrice()]);
  const [sortOption, setSortOption] = useState(initialSortBy || 'recommended');
  const [searchQuery, setSearchQuery] = useState(initialName || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchRef = useRef(null);
  const mobileFiltersRef = useRef(null);

  const activePriceFilter = priceRange[0] > 0 || priceRange[1] < maxPrice;
  const selectedFiltersCount =
    selectedAmenities.length +
    selectedStars.length +
    (activePriceFilter ? 1 : 0) +
    (searchQuery ? 1 : 0);
  const hasActiveFilters = selectedFiltersCount > 0;

  const buildParamsAndNavigate = (overrides = {}) => {
    const params = new URLSearchParams();

    if (locationID) params.set('locationID', locationID);
    if (hotelID) params.set('hotelID', hotelID);
    if (rooms) params.set('rooms', rooms);
    if (adult) params.set('adult', adult);
    params.set('checkin', defaultCheckin);
    params.set('checkout', defaultCheckout);

    const nameVal = overrides.name !== undefined ? overrides.name : searchQuery;
    const starsVal = overrides.stars !== undefined ? overrides.stars : selectedStars;
    const amVal = overrides.amenities !== undefined ? overrides.amenities : selectedAmenities;
    const priceVal = overrides.priceRange !== undefined ? overrides.priceRange : priceRange;
    const sortVal = overrides.sortOption !== undefined ? overrides.sortOption : sortOption;

    if (nameVal.trim()) params.set('name', nameVal.trim());
    if (starsVal.length > 0) params.set('star_rating', starsVal.join(','));
    if (amVal.length > 0) params.set('amenities', amVal.join(','));
    if (priceVal[0] > 0) params.set('min_price', priceVal[0]);
    if (priceVal[1] < maxPrice) params.set('max_price', priceVal[1]);
    if (sortVal && sortVal !== 'recommended') params.set('sort_by', sortVal);

    const destinationUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(destinationUrl);
  };

  const handleSearchSubmit = (event) => {
    if (event?.preventDefault) event.preventDefault();
    buildParamsAndNavigate({ name: searchQuery });
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit(event);
    }
  };

  // Close suggestions & mobile filter on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }

      if (showMobileFilters) {
        const button = document.getElementById("mobile-filter-button");
        if (
          mobileFiltersRef.current &&
          !mobileFiltersRef.current.contains(e.target) &&
          e.target !== button &&
          !button?.contains(e.target)
        ) {
          setShowMobileFilters(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMobileFilters]);

  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showMobileFilters]);

  const handleAmenityChange = (amenityId) => {
    const updated = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter(id => id !== amenityId)
      : [...selectedAmenities, amenityId];
    setSelectedAmenities(updated);
    buildParamsAndNavigate({ amenities: updated });
  };

  const handleStarChange = (star) => {
    const updated = selectedStars.includes(star)
      ? selectedStars.filter(s => s !== star)
      : [...selectedStars, star];
    setSelectedStars(updated);
    buildParamsAndNavigate({ stars: updated });
  };

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value);
    const newRange = [value, priceRange[1]];
    setPriceRange(newRange);
    buildParamsAndNavigate({ priceRange: newRange });
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value);
    const newRange = [priceRange[0], value];
    setPriceRange(newRange);
    buildParamsAndNavigate({ priceRange: newRange });
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    buildParamsAndNavigate({ sortOption: e.target.value });
  };

  const resetSearchSuggestions = () => {
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const updateSearchSuggestions = (query) => {
    if (!query) {
      resetSearchSuggestions();
      return;
    }

    const matchedHotels = hotels
      .filter((hotel) => hotel.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);

    setSuggestions(matchedHotels);
    setShowSuggestions(true);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      updateSearchSuggestions(query);
      return;
    }

    resetSearchSuggestions();
    buildParamsAndNavigate({ name: '' });
  };

  const selectSuggestion = (hotelName) => {
    setSearchQuery(hotelName);
    resetSearchSuggestions();
    buildParamsAndNavigate({ name: hotelName });
  };

  const resetAllFilters = () => {
    setSelectedAmenities([]);
    setSelectedStars([]);
    setPriceRange([0, maxPrice]);
    setSearchQuery('');
    resetSearchSuggestions();
    setSortOption('recommended');

    buildParamsAndNavigate({
      amenities: [],
      stars: [],
      priceRange: [0, maxPrice],
      name: '',
      sortOption: 'recommended',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace('BDT', 'BDT ');
  };

  return (
    <div className="container mx-auto max-w-7xl py-16 lg:px-8 md:pt-20 bg-white text-blue-950">
      <div className="mb-8 md:mb-8 rounded-xl">
        <SearchBar
          initialValues={{
            checkin: defaultCheckin,
            checkout: defaultCheckout,
            locationID,
            hotelID,
            rooms,
            adults: adult,
          }}
        />
      </div>

      <div className='bg-blue-100 p-5 rounded-lg'>
        {/* Mobile Filter Button */}
        <div className="md:hidden fixed bottom-6 left-0 right-0 flex justify-center z-20">
          <button
            id="mobile-filter-button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-white text-blue-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {selectedFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-end">
            <div ref={mobileFiltersRef} className="w-4/5 h-full bg-white overflow-y-auto">
              <HotelFilters
                amenities={amenities}
                selectedAmenities={selectedAmenities}
                handleAmenityChange={handleAmenityChange}
                selectedStars={selectedStars}
                handleStarChange={handleStarChange}
                priceRange={priceRange}
                handleMinPriceChange={handleMinPriceChange}
                handleMaxPriceChange={handleMaxPriceChange}
                maxPrice={maxPrice}
                formatPrice={formatPrice}
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
                handleSearchKeyDown={handleSearchKeyDown}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                suggestions={suggestions}
                selectSuggestion={selectSuggestion}
                resetAllFilters={resetAllFilters}
                searchRef={searchRef}
                isMobile={true}
                onCloseFilters={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Filters */}
          <div className="hidden md:block md:w-1/4">
            <HotelFilters
              amenities={amenities}
              selectedAmenities={selectedAmenities}
              handleAmenityChange={handleAmenityChange}
              selectedStars={selectedStars}
              handleStarChange={handleStarChange}
              priceRange={priceRange}
              handleMinPriceChange={handleMinPriceChange}
              handleMaxPriceChange={handleMaxPriceChange}
              maxPrice={maxPrice}
              formatPrice={formatPrice}
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              handleSearchKeyDown={handleSearchKeyDown}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              suggestions={suggestions}
              selectSuggestion={selectSuggestion}
              resetAllFilters={resetAllFilters}
              searchRef={searchRef}
            />
          </div>

          {/* Hotels List */}
          <div className="w-full md:w-3/4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {hotels.length} {hotels.length === 1 ? 'Hotel' : 'Hotels'} Found
                </h2>
                {selectedFiltersCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedFiltersCount} active {selectedFiltersCount === 1 ? 'filter' : 'filters'}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-sm text-blue-600 border border-blue-600 rounded-md px-3 py-1 hover:bg-blue-50 transition-colors"
                >
                  Reset all
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 hidden md:inline">Sort by:</span>
                  <select
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price_low">Price (Low to High)</option>
                    <option value="price_high">Price (High to Low)</option>
                    <option value="name_az">Name (A-Z)</option>
                    <option value="name_za">Name (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>

            {hotels.length > 0 ? (
              <div className="space-y-5">
                {hotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    amenities={amenities}
                    checkin={defaultCheckin}
                    checkout={defaultCheckout}
                    rooms={rooms}
                    adult={adult}
                    isHighlighted={hotelID == hotel.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fa-solid fa-hotel text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No hotels found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {selectedAmenities.length > 0 || selectedStars.length > 0 || priceRange[1] < maxPrice || searchQuery
                    ? "No hotels match your selected filters. Try adjusting your filters."
                    : "We could not find any hotels matching your criteria."}
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-4 inline-block px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors mr-2"
                >
                  Clear Filters
                </button>
                <Link
                  href="/hotel"
                  className="mt-4 inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Modify Search
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelListContent;