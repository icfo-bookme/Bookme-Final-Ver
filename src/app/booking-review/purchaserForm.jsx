'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'flowbite-react';
import api from '@/lib/api';
import FormField from '@/utils/FormField';

export default function PurchaserForm({
  guestInfo,
  user,
  onGuestInfoChange,
  bookingData,
  calculations
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // ✅ Format date in Bangladesh local time (YYYY-MM-DD)
  const formatBDLocalDate = (date) => {
    const d = new Date(date);
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const bdt = new Date(utc + 6 * 60 * 60 * 1000);
    const year = bdt.getFullYear();
    const month = String(bdt.getMonth() + 1).padStart(2, '0');
    const day = String(bdt.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ✅ Calculate nights from bookingData
  const calculateNights = () => {
    const cin = bookingData?.checkin;
    const cout = bookingData?.checkout;
    if (!cin || !cout) return calculations?.nights || 1;
    const a = new Date(cin); a.setHours(0, 0, 0, 0);
    const b = new Date(cout); b.setHours(0, 0, 0, 0);
    return Math.max(1, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));
  };

  // ✅ Find matching price segment for a date
  const findMatchingPriceSegment = (item, date) => {
    if (!item.price_segments || item.price_segments.length === 0) return null;
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const match = item.price_segments.find(segment => {
      const from = new Date(segment.effective_from);
      const to = new Date(segment.effective_till);
      from.setHours(0, 0, 0, 0);
      to.setHours(0, 0, 0, 0);
      return checkDate >= from && checkDate <= to;
    });
    return match || item.price_segments[0];
  };

  // ✅ Calculate total price for one item across all nights (segment-aware)
  const calculateItemTotal = (item) => {
    const cin = bookingData?.checkin;
    if (!cin) return 0;
    const checkinDate = new Date(cin);
    checkinDate.setHours(0, 0, 0, 0);
    const nights = calculateNights();

    if (!item.price_segments || item.price_segments.length === 0) {
      return ((item.price || 0) + (Number(item.taxes) || 0)) * nights;
    }

    let total = 0;
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(checkinDate);
      currentDate.setDate(checkinDate.getDate() + i);
      const segment = findMatchingPriceSegment(item, currentDate);
      if (segment) {
        const price = Number(segment.price_per_night) || 0;
        const discount = Number(segment.discount || 0);
        const discounted = Math.round(price - (price * discount / 100));
        total += discounted + (Number(item.taxes) || 0);
      }
    }
    return total;
  };

  // ✅ Get effective price per night (first/checkin segment, discount applied)
  const getEffectivePricePerNight = (item) => {
    const cin = bookingData?.checkin;
    if (!cin) return item.price || 0;
    if (!item.price_segments || item.price_segments.length === 0) return item.price || 0;
    const segment = findMatchingPriceSegment(item, new Date(cin));
    if (!segment) return item.price || 0;
    const price = Number(segment.price_per_night) || 0;
    const discount = Number(segment.discount || 0);
    return Math.round(price - (price * discount / 100));
  };

  // ✅ Grand totals computed fresh from segments
  const computedTotals = () => {
    if (!bookingData?.cart) return { roomTotal: 0, totalTaxes: 0, grandTotal: 0 };
    const nights = calculateNights();
    let roomTotal = 0;
    let totalTaxes = 0;

    bookingData.cart.forEach(item => {
      const itemTaxes = (Number(item.taxes) || 0) * nights;
      const itemTotal = calculateItemTotal(item);
      totalTaxes += itemTaxes;
      roomTotal += itemTotal - itemTaxes;
    });

    return { roomTotal, totalTaxes, grandTotal: roomTotal + totalTaxes, nights };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onGuestInfoChange({ ...guestInfo, [name]: value });

    setErrors(prev => {
      const newErrors = { ...prev };
      if (name === 'phone') {
        const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
        if (!bdPhoneRegex.test(value)) {
          newErrors.phone = 'Enter a valid Bangladeshi phone number.';
        } else {
          delete newErrors.phone;
        }
      } else if (name === 'name') {
        if (!value.trim()) {
          newErrors.name = 'Guest name is required.';
        } else {
          delete newErrors.name;
        }
      } else if (name === 'purchaser_name') {
        if (!value.trim()) {
          newErrors.purchaser_name = 'Purchaser name is required.';
        } else {
          delete newErrors.purchaser_name;
        }
      }
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate
    const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    let newErrors = {};
    if (!guestInfo.name?.trim()) newErrors.name = 'Guest name is required.';
    if (!guestInfo.purchaser_name?.trim()) newErrors.purchaser_name = 'Purchaser name is required.';
    if (!bdPhoneRegex.test(guestInfo.phone)) newErrors.phone = 'Enter a valid Bangladeshi phone number.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert(Object.values(newErrors)[0]);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    const nights = calculateNights();
    const totals = computedTotals();
    const checkinFormatted = formatBDLocalDate(bookingData.checkin);
    const checkoutFormatted = formatBDLocalDate(bookingData.checkout);

    // ✅ Build booking_details with correct segment-aware prices
    const bookingDetails = bookingData.cart.map(item => ({
      room_id: item.id,
      check_in_date: checkinFormatted,
      check_out_date: checkoutFormatted,
      total_guests: (Number(item.adults) || 1) + (Number(item.children) || 0),
      adults: Number(item.adults) || 1,
      children: Number(item.children) || 0,
      price_per_night: getEffectivePricePerNight(item),
      total_nights: nights,
      total_price: calculateItemTotal(item),
      taxes: (Number(item.taxes) || 0) * nights,
      breakfast: item.breakfast || '',
      special_requests: item.specialRequests || '',
      price_segments: item.price_segments || []
    }));

    const confirmedBooking = {
      // Order meta
      order_date: formatBDLocalDate(new Date()),
      order_status: 'pending',
      payment_status: 'unpaid',
      service_category_id: 3,

      // Customer info
      customerid: user?.id || null,
      customer_name: guestInfo.name,
      purchaser_name: guestInfo.purchaser_name,
      mobile_no: guestInfo.phone,
      email: guestInfo.email || '',
      special_requests: guestInfo.specialRequests || '',

      // Property
      property_id: bookingData.hotel_id,

      // Stay dates
      check_in_date: checkinFormatted,
      check_out_date: checkoutFormatted,
      total_nights: nights,

      // ✅ Pricing totals (segment-aware)
      room_total: totals.roomTotal,
      taxes_total: totals.totalTaxes,
      total_amount: totals.grandTotal,

      // Room line items
      booking_details: bookingDetails,
    };

    try {
      const response = await api.post('/api/booking-orders', confirmedBooking);

      if (response.status === 201 || response.status === 200) {
        localStorage.removeItem('bookingCart');
        localStorage.removeItem('bookingReviewData');
        localStorage.removeItem('bookingData');

        // ✅ DataLayer push with correct values
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'bookingConfirmed',
            booking: {
              bookingReference: response.data?.data?.orderno,
              customerName: guestInfo.name,
              purchaserName: guestInfo.purchaser_name,
              customerPhone: guestInfo.phone,
              customerEmail: guestInfo.email || '',
              propertyId: bookingData.hotel_id,
              checkIn: checkinFormatted,
              checkOut: checkoutFormatted,
              totalNights: nights,
              roomTotal: totals.roomTotal,
              totalTaxes: totals.totalTaxes,
              totalAmount: totals.grandTotal,
              rooms: bookingData.cart.map(item => ({
                roomId: item.id,
                roomName: item.name,
                roomType: item.type,
                adults: item.adults,
                children: item.children,
                pricePerNight: getEffectivePricePerNight(item),
                totalPrice: calculateItemTotal(item),
                breakfast: item.breakfast || '',
                specialRequests: item.specialRequests || ''
              }))
            }
          });
        }

        router.push(`/confirmation/${response.data.data.orderno}`);
      } else {
        setErrors({ form: 'Failed to confirm booking. Please try again.' });
        alert('Failed to confirm booking. Please try again.');
      }
    } catch (error) {
      
      setErrors({ form: 'An error occurred while confirming your booking.' });
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

      {errors.form && <p className="text-red-600 mb-4">{errors.form}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">

        <FormField
          label="Guest Full Name *"
          id="name"
          name="name"
          type="text"
          value={guestInfo.name || ''}
          onChange={handleInputChange}
          required
          placeholder="Enter guest full name"
          helperText={errors.name && <span className="text-red-600">{errors.name}</span>}
        />

        <FormField
          label="Guest Phone Number *"
          id="phone"
          name="phone"
          type="tel"
          value={guestInfo.phone || ''}
          onChange={handleInputChange}
          required
          placeholder="Enter guest phone number"
          helperText={
            errors.phone
              ? <span className="text-red-600">{errors.phone}</span>
              : 'Enter a valid Bangladeshi number (e.g., 01XXXXXXXXX)'
          }
        />

        <FormField
          label="Guest Email Address (Optional)"
          id="email"
          name="email"
          type="email"
          value={guestInfo.email || ''}
          onChange={handleInputChange}
          placeholder="Enter guest email address"
        />

        <FormField
          label="Purchaser Name *"
          id="purchaser_name"
          name="purchaser_name"
          type="text"
          value={guestInfo.purchaser_name || ''}
          onChange={handleInputChange}
          required
          placeholder="Enter purchaser full name"
          helperText={
            errors.purchaser_name
              ? <span className="text-red-600">{errors.purchaser_name}</span>
              : user
                ? 'Your account name is pre-filled, but you can change it if needed.'
                : ''
          }
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
            value={guestInfo.specialRequests || ''}
            onChange={handleInputChange}
            className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special requests or notes..."
          />
        </div>

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