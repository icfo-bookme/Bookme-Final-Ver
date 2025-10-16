'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import LoadingSpinner from '@/utils/LoadingSpinner';
import BookingForm from './BookingForm';
import BookingSummary from './BookingSummary';
import BookingHeader from './BookingHeader';

export default function BookingReviewPage() {
  const [bookingData, setBookingData] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    email: '',
    specialRequests: '',
  });
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      setGuestInfo(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Calculate utility functions
  const calculateNights = () => {
    if (!bookingData) return 0;
    const checkinDate = new Date(bookingData.checkin);
    const checkoutDate = new Date(bookingData.checkout);
    const diffTime = Math.abs(checkoutDate - checkinDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateRoomTotal = () => {
    if (!bookingData?.cart) return 0;
    const nights = calculateNights();
    return bookingData.cart.reduce(
      (total, item) => total + item.price * nights,
      0
    );
  };

  const calculateTotalTaxes = () => {
    if (!bookingData?.cart) return 0;
    const nights = calculateNights();
    return bookingData.cart.reduce(
      (total, item) => total + (item.taxes || 0) * nights,
      0
    );
  };

  const calculateGrandTotal = () => {
    return calculateRoomTotal() + calculateTotalTaxes();
  };

  const handleGuestInfoChange = (updatedInfo) => {
    setGuestInfo(updatedInfo);
  };

  if (!bookingData) {
    return <LoadingSpinner />;
  }

  const calculations = {
    nights: calculateNights(),
    roomTotal: calculateRoomTotal(),
    totalTaxes: calculateTotalTaxes(),
    grandTotal: calculateGrandTotal(),
  };

  return (
    <div className="min-h-screen w-[90%] bg-gray-50 py-16 mx-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <BookingHeader user={user} />
          
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <BookingForm
              guestInfo={guestInfo}
              user={user}
              onGuestInfoChange={handleGuestInfoChange}
              bookingData={bookingData}
              calculations={calculations}
            />
            
            <BookingSummary
              bookingData={bookingData}
              user={user}
              calculations={calculations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}