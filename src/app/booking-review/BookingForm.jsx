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
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onGuestInfoChange({
      ...guestInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!guestInfo.name || !guestInfo.phone) {
      alert('Please fill out the required fields.');
      setIsSubmitting(false);
      return;
    }

    const confirmedBooking = {
      order_date: new Date().toISOString().split("T")[0],
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
        check_in_date: new Date(bookingData.checkin).toISOString().split('T')[0],
        check_out_date: new Date(bookingData.checkout).toISOString().split('T')[0],
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
        router.push('/confirmation');
      } else {
        alert('Failed to confirm booking. Please try again.');
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('An error occurred while confirming your booking.');
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Full Name *"
          id="name"
          name="name"
          type="text"
          value={guestInfo.name}
          onChange={handleInputChange}
          required
          helperText={user ? "Your account name is pre-filled, but you can change it if needed." : ""}
          placeholder="Enter your full name"
        />

        <FormField
          label="Phone Number *"
          id="phone"
          name="phone"
          type="tel"
          value={guestInfo.phone}
          onChange={handleInputChange}
          required
          helperText={user && user.phone ? "Your account phone number is pre-filled." : ""}
          placeholder="Enter your phone number"
        />

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

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: 'linear-gradient(90deg, #313881, #0678B4)',
            }}
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

