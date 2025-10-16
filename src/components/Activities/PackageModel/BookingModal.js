'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Roboto } from "next/font/google";
import GuestSelector from "./GuestSelector";
import TimeSlotSelector from "./TimeSlotSelector";
import ModalHeader from "./ModalHeader";
import PackageInfo from "./PackageInfo";
import GuestSelectorField from "./GuestSelectorField";
import DateSelector from "../../../utils/DateSelector";
import PickupLocationField from "./PickupLocationField";
import SubmitButton from "./SubmitButton";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function BookingModal({ selectedPackage, property_id, onClose }) {
  const router = useRouter();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const bookingModalRef = useRef(null);

  const [bookingDetails, setBookingDetails] = useState({
    packageId: selectedPackage?.id || null,
    adults: 1,
    children: 0,
    date: "",
    time: "",
    pickupLocation: ""
  });

  const handleGuestChange = useCallback((guests) => {
    setBookingDetails(prev => ({ ...prev, ...guests }));
  }, []);

  const handlePickupLocationChange = useCallback((location) => {
    setBookingDetails(prev => ({ ...prev, pickupLocation: location }));
  }, []);

  const handleTimeChange = useCallback((time) => {
    setBookingDetails(prev => ({ ...prev, time }));
  }, []);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bookingModalRef.current && 
          !bookingModalRef.current.contains(event.target) &&
          !event.target.closest('.guest-selector-trigger') && 
          !showGuestModal) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, showGuestModal]);

  const handleBookingSubmit = async () => {
    if (!bookingDetails.date || !bookingDetails.time) {
      alert("Please select date and time");
      return;
    }
       

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },

        body: JSON.stringify({
          item_id: selectedPackage.id,
          pickup_location: bookingDetails.pickupLocation,
          total_guest: bookingDetails.adults + bookingDetails.children,
          date: bookingDetails.date,
          time: bookingDetails.time
        })
      });

      const text = await response.text();
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = JSON.parse(text);
       router.push(`/order/review/${data.id}`);
     
      
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Something went wrong while submitting your booking.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Select date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;
    const price = selectedPackage.discounted_price || selectedPackage.regular_price;
    return price * (bookingDetails.adults + bookingDetails.children);
  };

  const noPickupLocations = !bookingDetails.pickupLocation;

  return (
    <div className={`${roboto.className} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4`}>
      <div
        ref={bookingModalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <ModalHeader onClose={onClose} />
        
        <div className="p-6">
          <PackageInfo selectedPackage={selectedPackage} />
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PickupLocationField
                property_id={property_id}
                value={bookingDetails.pickupLocation}
                onChange={handlePickupLocationChange}
              />
              
              <GuestSelectorField
                guests={{ adults: bookingDetails.adults, children: bookingDetails.children }}
                onTrigger={() => setShowGuestModal(true)}
              />
            </div>

            <DateSelector
              value={bookingDetails.date}
              onChange={(date) => setBookingDetails(prev => ({ ...prev, date }))}
              formatDate={formatDate}
            />

            <TimeSlotSelector
              value={bookingDetails.time}
              onChange={handleTimeChange}
            />
          </div>

          <SubmitButton
            onSubmit={handleBookingSubmit}
            totalPrice={calculateTotalPrice()}
            disabled={!bookingDetails.date || !bookingDetails.time || noPickupLocations}
            noPickupLocations={noPickupLocations}
          />
        </div>
      </div>

      {showGuestModal && (
        <GuestSelector
          guests={{ adults: bookingDetails.adults, children: bookingDetails.children }}
          onChange={handleGuestChange}
          onClose={() => setShowGuestModal(false)}
        />
      )}
    </div>
  );
}