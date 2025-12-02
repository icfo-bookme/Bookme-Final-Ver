'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'flowbite-react';
import api from '@/lib/api';
import FormField from '@/utils/FormField';

export default function BookingForm({ 
  guestInfo, 
  user, 
  onGuestInfoChange, 
  bookingData, 
  calculations 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Format date in Bangladesh local time (YYYY-MM-DD)
  const formatBDLocalDate = (date) => {
    const d = new Date(date);
    // Offset for Bangladesh Time (+6)
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const bdt = new Date(utc + 6 * 60 * 60 * 1000);
    const year = bdt.getFullYear();
    const month = String(bdt.getMonth() + 1).padStart(2, '0');
    const day = String(bdt.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

 const handleInputChange = (e) => {
  const { name, value } = e.target;

  // Update guest info
  onGuestInfoChange({
    ...guestInfo,
    [name]: value,
  });

  // Real-time validation
  setErrors(prev => {
    const newErrors = { ...prev };

    if (name === "phone") {
      const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
      if (!bdPhoneRegex.test(value)) {
        newErrors.phone = "Enter a valid Bangladeshi phone number.";
      } else {
        delete newErrors.phone;
      }
    } else if (name === "name") {
      if (!value.trim()) {
        newErrors.name = "Name is required.";
      } else {
        delete newErrors.name;
      }
    }

    return newErrors;
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let newErrors = {};
    const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;

    if (!guestInfo.name) newErrors.name = "Name is required.";
    if (!bdPhoneRegex.test(guestInfo.phone)) newErrors.phone = "Enter a valid Bangladeshi phone number.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert(Object.values(newErrors)[0]);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    const confirmedBooking = {
      order_date: formatBDLocalDate(new Date()),
      customerid: user?.id || null,
      customer_name: guestInfo.name,
      mobile_no: guestInfo.phone,
      email: guestInfo.email || "",
      order_status: "pending",
      payment_status: "unpaid",
      property_id: bookingData.hotel_id,
      service_category_id: 3,
      booking_details: bookingData.cart.map(item => ({
        room_id: item.id,
        check_in_date: formatBDLocalDate(bookingData.checkin),
        check_out_date: formatBDLocalDate(bookingData.checkout),
        total_guests: 2,
        price_per_night: item.price,
        total_price: item.total,
        special_requests: item.specialRequests || ""
      })),
      ...bookingData,
      guestInfo,
      userId: user?.id || null,
      totalAmount: calculations.grandTotal,
      totalTaxes: calculations.totalTaxes,
      roomTotal: calculations.roomTotal,
      nights: calculations.nights,
    };

    try {
      const response = await api.post('/api/booking-orders', confirmedBooking);
      if (response.status === 201 || response.status === 200) {
        localStorage.removeItem('bookingCart');
        localStorage.removeItem('bookingReviewData');
        router.push(`/confirmation/${response.data.data.orderno}`);
      } else {
        setErrors({ form: "Failed to confirm booking. Please try again." });
        alert("Failed to confirm booking. Please try again.");
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      setErrors({ form: "An error occurred while confirming your booking." });
      alert("An error occurred while confirming your booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Guest Information
        {user && (
          <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
            Pre-filled from your profile
          </span>
        )}
      </h2>

      {errors.form && <p className="text-red-600 mb-4">{errors.form}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* NAME */}
        <FormField
          label="Full Name *"
          id="name"
          name="name"
          type="text"
          value={guestInfo.name}
          onChange={handleInputChange}
          required
          helperText={
            errors.name 
              ? <span className="text-red-600">{errors.name}</span>
              : user 
                ? "Your account name is pre-filled, but you can change it if needed."
                : ""
          }
          placeholder="Enter your full name"
        />

        {/* PHONE */}
        <FormField
          label="Phone Number *"
          id="phone"
          name="phone"
          type="tel"
          value={guestInfo.phone}
          onChange={handleInputChange}
          required
          helperText={
            errors.phone 
              ? <span className="text-red-600">{errors.phone}</span>
              : user?.phone 
                ? "Your account phone number is pre-filled." 
                : "Enter a valid Bangladeshi number (e.g., 01XXXXXXXXX)"
          }
          placeholder="Enter your phone number"
        />

        {/* EMAIL */}
        <FormField
          label="Email Address (Optional)"
          id="email"
          name="email"
          type="email"
          value={guestInfo.email}
          onChange={handleInputChange}
          helperText={user ? "Your account email is pre-filled." : ""}
          placeholder="Enter your email address"
        />

        {/* SPECIAL REQUESTS */}
        <div>
          <label
            htmlFor="specialRequests"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Special Requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            rows={4}
            value={guestInfo.specialRequests}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special requests or notes..."
          />
        </div>

        {/* BUTTON */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            style={{ background: 'linear-gradient(90deg, #313881, #0678B4)' }}
            className="w-full text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            <i className="fa-solid fa-check ml-2"></i>
          </Button>
        </div>
      </form>
    </div>
  );
}
