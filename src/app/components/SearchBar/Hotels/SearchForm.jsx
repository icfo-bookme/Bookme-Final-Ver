'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchButton from "@/utils/SearchButton";
import DatePickerModal from "@/utils/DatePickerModal";
import GuestModal from "@/utils/GuestModal";
import LocationSearch from "./LocationSearch";
import DateInput from "./DateInput";
import GuestInput from "./GuestInput";
import slugify from "@/utils/slugify";

const SearchForm = ({ destinations, hotels, defaultDestination }) => {
  const router = useRouter();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [selectedLocationId, setSelectedLocationId] = useState(defaultDestination?.id || "");
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [dateRange, setDateRange] = useState([today, tomorrow]);
  const [checkinDate, setCheckinDate] = useState(today);
  const [checkoutDate, setCheckoutDate] = useState(tomorrow);

  const datePickerRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!selectedLocationId && !selectedHotelId) {
      alert("Please select a valid destination or hotel");
      return;
    }

    const formatDateForQuery = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const queryParams = {
      checkin: formatDateForQuery(checkinDate),
      checkout: formatDateForQuery(checkoutDate),
      rooms: String(rooms),
      adult: String(adults),
      child_ages: Array(children).fill(0).join(","),
    };

    if (selectedHotelId) {
      queryParams.hotelID = String(selectedHotelId);
      
      // Find the selected hotel to get its location for the URL
      const selectedHotel = hotels.find(
        (hotel) => String(hotel.hotel_id) === String(selectedHotelId)
      );
      
      if (!selectedHotel) {
        alert("Hotel not found!");
        return;
      }

      // Use hotel name for URL but search by hotel ID
      const hotelName = slugify(selectedHotel.hotel_name)
      

      const query = new URLSearchParams(queryParams).toString();
      router.push(`/hotel/${hotelName}?${query}`);

    } else {
      // Use location search
      queryParams.locationID = String(selectedLocationId);

      // Find the selected destination by its ID
      const selectedDestination = destinations.find(
        (dest) => String(dest.id) === String(selectedLocationId)
      );

      if (!selectedDestination) {
        alert("Destination not found!");
        return;
      }

      const destinationName = slugify(selectedDestination.name)
       

      const query = new URLSearchParams(queryParams).toString();
      router.push(`/hotel/${destinationName}?${query}`);
    }
  };

  // Handle date changes
  const handleDateChange = (update) => {
    setDateRange(update);
    if (update[0]) setCheckinDate(update[0]);
    if (update[1]) setCheckoutDate(update[1]);
  };

  return (
    <div className="max-w-5xl rounded-t-lg mx-auto pb-6 text-blue-950 relative">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl shadow-sm">
          {/* Location Search */}
          <LocationSearch
            destinations={destinations}
            hotels={hotels}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={setSelectedLocationId}
            selectedHotelId={selectedHotelId}
            setSelectedHotelId={setSelectedHotelId}
          />

          {/* Check-in Date */}
          <DateInput
            label="CHECK IN"
            date={checkinDate}
            onClick={() => setShowDatePicker(true)}
          />

          {/* Check-out Date */}
          <DateInput
            label="CHECK OUT"
            date={checkoutDate}
            onClick={() => setShowDatePicker(true)}
          />

          {/* Guest Input */}
          <GuestInput
            adults={adults}
            child={children}
            rooms={rooms}
            onClick={() => setShowGuestModal(true)}
          />
        </div>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DatePickerModal
            dateRange={dateRange}
            handleDateChange={handleDateChange}
            setShowDatePicker={setShowDatePicker}
            ref={datePickerRef}
          />
        )}

        {/* Guest Modal */}
        {showGuestModal && (
          <GuestModal
            adults={adults}
            setAdults={setAdults}
            childrenNumber={children}
            setChildren={setChildren}
            rooms={rooms}
            setRooms={setRooms}
            setShowGuestModal={setShowGuestModal}
          />
        )}

        {/* Search Button */}
        <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2 flex justify-end">
          <SearchButton type="submit">Search Hotels</SearchButton>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;