'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import LoadingSpinner from '@/utils/LoadingSpinner';
import BookingForm from './BookingForm';
import BookingSummary from './BookingSummary';
import BookingHeader from './BookingHeader';
import PurchaserForm from './purchaserForm';

export default function BookingReviewPage() {
  const [bookingData, setBookingData] = useState(null);
  const [orderFor, setOrderFor] = useState("me");
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
    if (user && orderFor === "me") {
      setGuestInfo(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
      }));
    }
    else if (user && orderFor === "other") {
      setGuestInfo({
        purchaser_name: user.name || prev.name,
        name: '',
        phone: '',
        email: '',
        specialRequests: '',
      });
    }
    else {
      setGuestInfo({
        purchaser_name: '',
        name: '',
        phone: '',
        email: '',
        specialRequests: '',
      });
    }
  }, [user, orderFor]);

  // Calculations
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

  if (!bookingData) return <LoadingSpinner />;

  const calculations = {
    nights: calculateNights(),
    roomTotal: calculateRoomTotal(),
    totalTaxes: calculateTotalTaxes(),
    grandTotal: calculateGrandTotal(),
  };

  return (
    <div className="min-h-screen  bg-gray-50 py-8">
      <div className="max-w-7xl pt-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl  shadow-lg overflow-hidden">
          <BookingHeader user={user} />

          <div className="p-3 md:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div className="">
                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 w-full max-w-md">
                  <button
                    onClick={() => setOrderFor("me")}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${orderFor === "me"
                      ? "bg-gradient-to-r from-[#313881] to-[#0678B4] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                      }`}
                  >
                    Order For Me
                  </button>
                  <button
                    onClick={() => setOrderFor("other")}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${orderFor === "other"
                      ? "bg-gradient-to-r from-[#313881] to-[#0678B4] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                      }`}
                  >
                    Order For Other
                  </button>
                </div>
                {orderFor === "me" ? (
                  <BookingForm
                    guestInfo={guestInfo}
                    user={user}
                    onGuestInfoChange={handleGuestInfoChange}
                    bookingData={bookingData}
                    calculations={calculations}
                  />
                ) : (
                  <PurchaserForm
                    guestInfo={guestInfo}
                    user={user}
                    onGuestInfoChange={handleGuestInfoChange}
                    bookingData={bookingData}
                    calculations={calculations}
                  />
                )}
              </div>

              {/* Right Column - Summary */}
              <div className="lg:sticky lg:h-fit">
                <BookingSummary
                  bookingData={bookingData}
                  user={user}
                  calculations={calculations}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}