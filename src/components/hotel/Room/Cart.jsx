'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from 'flowbite-react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePickerModal from '@/utils/DatePickerModal';

const Cart = ({ 
  cart = [], 
  isLargeScreen, 
  onClose, 
  onRemoveItem, 
  hotel_id,
  hotelDetails,
  checkin: initialCheckin, 
  checkout: initialCheckout, 
  onDatesChange = () => {},
  onProceedToCheckout 
}) => {

  const getDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return {
      checkin: initialCheckin ? new Date(initialCheckin) : today,
      checkout: initialCheckout ? new Date(initialCheckout) : tomorrow
    };
  };

  const [checkin, setCheckin] = useState(getDefaultDates().checkin);
  const [checkout, setCheckout] = useState(getDefaultDates().checkout);
  const [tempCheckin, setTempCheckin] = useState(getDefaultDates().checkin);
  const [tempCheckout, setTempCheckout] = useState(getDefaultDates().checkout);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  const datePickerRef = useRef(null);

  useEffect(() => {
    if (initialCheckin && initialCheckout) {
      const newCheckin = new Date(initialCheckin);
      const newCheckout = new Date(initialCheckout);
      setCheckin(newCheckin);
      setCheckout(newCheckout);
      setTempCheckin(newCheckin);
      setTempCheckout(newCheckout);
    }
  }, [initialCheckin, initialCheckout]);

  useEffect(() => {
    if (!checkin || !checkout) return;

    const bookingData = {
      cart,
      hotel_id,
      hotelDetails,
      checkin: checkin.toISOString(),
      checkout: checkout.toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'bookingData', bookingData });
    }

    localStorage.setItem('bookingData', JSON.stringify(bookingData));
  }, [cart, checkin, checkout, hotel_id, hotelDetails]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePickerModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ FIX: Accept checkin/checkout as parameters to avoid stale state
  const calculateNights = (cin = checkin, cout = checkout) => {
    if (!cin || !cout) return 1;
    const diffTime = new Date(cout) - new Date(cin);
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // ✅ FIX: Accept cin as parameter to avoid stale closure
  const findMatchingPriceSegment = (item, date) => {
    if (!item.price_segments || item.price_segments.length === 0) {
      return null;
    }

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    const matchingSegment = item.price_segments.find(segment => {
      const fromDate = new Date(segment.effective_from);
      const toDate = new Date(segment.effective_till);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      return checkDate >= fromDate && checkDate <= toDate;
    });

    return matchingSegment || item.price_segments[0];
  };

  // ✅ FIX: Accept cin/cout params, fix date mutation bug
  const calculateItemTotal = (item, cin = checkin, cout = checkout) => {
    if (!cin || !cout) return 0;

    const checkinDate = new Date(cin);
    checkinDate.setHours(0, 0, 0, 0);
    const nights = calculateNights(cin, cout);

    if (!item.price_segments || item.price_segments.length === 0) {
      const pricePerNight = item.price || 0;
      const taxesPerNight = item.taxes || 0;
      return (pricePerNight + taxesPerNight) * nights;
    }

    let total = 0;

    for (let i = 0; i < nights; i++) {
      // ✅ FIX: Create a fresh Date each iteration instead of mutating
      const currentDate = new Date(checkinDate);
      currentDate.setDate(checkinDate.getDate() + i);

      const segment = findMatchingPriceSegment(item, currentDate);

      if (segment) {
        const pricePerNight = Number(segment.price_per_night) || 0;
        const discount = Number(segment.discount || 0);
        const discountedPrice = Math.round(pricePerNight - (pricePerNight * discount / 100));
        const taxesPerNight = Number(item.taxes) || 0;
        total += discountedPrice + taxesPerNight;
      }
    }

    return total;
  };

  // ✅ FIX: Accept cin/cout params, fix date mutation bug
  const getPriceBreakdown = (item, cin = checkin, cout = checkout) => {
    if (!cin || !cout) return [];

    const checkinDate = new Date(cin);
    checkinDate.setHours(0, 0, 0, 0);
    const nights = calculateNights(cin, cout);

    if (!item.price_segments || item.price_segments.length === 0) {
      const pricePerNight = item.price || 0;
      const taxesPerNight = Number(item.taxes) || 0;
      return [{
        fromDate: new Date(cin),
        toDate: new Date(cout),
        pricePerNight,
        discountedPrice: pricePerNight,
        discount: 0,
        nights,
        total: (pricePerNight + taxesPerNight) * nights,
        originalTotal: (pricePerNight + taxesPerNight) * nights
      }];
    }

    const breakdown = [];
    let remainingNights = nights;
    let currentDate = new Date(checkinDate);

    // ✅ FIX: Add safety counter to prevent infinite loop
    let safetyCounter = 0;
    const MAX_ITERATIONS = 365;

    while (remainingNights > 0 && safetyCounter < MAX_ITERATIONS) {
      safetyCounter++;
      const segment = findMatchingPriceSegment(item, currentDate);

      if (!segment) break;

      const segmentEnd = new Date(segment.effective_till);
      segmentEnd.setHours(0, 0, 0, 0);

      // ✅ FIX: Correct night count within segment
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysUntilSegmentEnd = Math.ceil((segmentEnd - currentDate) / msPerDay);
      const nightsInSegment = Math.min(remainingNights, Math.max(1, daysUntilSegmentEnd));

      const pricePerNight = Number(segment.price_per_night) || 0;
      const discount = Number(segment.discount || 0);
      const discountedPrice = Math.round(pricePerNight - (pricePerNight * discount / 100));
      const taxesPerNight = Number(item.taxes) || 0;

      const segmentToDate = new Date(currentDate);
      segmentToDate.setDate(currentDate.getDate() + nightsInSegment - 1);

      breakdown.push({
        fromDate: new Date(currentDate),
        toDate: segmentToDate,
        pricePerNight,
        discountedPrice,
        discount,
        nights: nightsInSegment,
        total: (discountedPrice + taxesPerNight) * nightsInSegment,
        originalTotal: (pricePerNight + taxesPerNight) * nightsInSegment
      });

      remainingNights -= nightsInSegment;
      // ✅ FIX: Advance currentDate correctly
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + nightsInSegment);
    }

    return breakdown;
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const handleOpenDateModal = () => {
    setTempCheckin(new Date(checkin));
    setTempCheckout(new Date(checkout));
    setShowDatePickerModal(true);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setTempCheckin(start ? new Date(start) : null);
    setTempCheckout(end ? new Date(end) : null);
  };

  const formatBDT = (date) => {
    const BDT_OFFSET = 6 * 60;
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const bdtDate = new Date(utc + BDT_OFFSET * 60000);
    const year = bdtDate.getFullYear();
    const month = String(bdtDate.getMonth() + 1).padStart(2, '0');
    const day = String(bdtDate.getDate()).padStart(2, '0');
    const hours = String(bdtDate.getHours()).padStart(2, '0');
    const minutes = String(bdtDate.getMinutes()).padStart(2, '0');
    const seconds = String(bdtDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const applyDateChanges = () => {
    // ✅ FIX: Guard against null dates
    if (!tempCheckin || !tempCheckout) return;

    const BDT_OFFSET = 6 * 60;
    const toBangladeshTime = (date) => {
      const utc = date.getTime() + date.getTimezoneOffset() * 60000;
      return new Date(utc + BDT_OFFSET * 60000);
    };

    const checkinBDT = toBangladeshTime(tempCheckin);
    const checkoutBDT = toBangladeshTime(tempCheckout);

    // ✅ FIX: Normalize hours to avoid partial-day calculation issues
    checkinBDT.setHours(0, 0, 0, 0);
    checkoutBDT.setHours(0, 0, 0, 0);

    setCheckin(checkinBDT);
    setCheckout(checkoutBDT);
    onDatesChange(checkinBDT, checkoutBDT);

    const bookingData = {
      cart,
      hotel_id,
      checkin: formatBDT(tempCheckin),
      checkout: formatBDT(tempCheckout),
      lastUpdated: formatBDT(new Date()),
    };

    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    setShowDatePickerModal(false);
  };

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleProceedToCheckout = () => {
    if (onProceedToCheckout) onProceedToCheckout();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex ${isLargeScreen ? 'items-center justify-end' : 'items-end'}`}>
      
      {showDatePickerModal && (
        <DatePickerModal
          dateRange={[tempCheckin, tempCheckout]}
          handleDateChange={handleDateChange}
          setShowDatePicker={setShowDatePickerModal}
          onApply={applyDateChanges}
        />
      )}

      <div className={`bg-white ${isLargeScreen ? 'w-96 rounded-l-lg h-[80vh] mr-0' : 'w-full rounded-t-lg max-h-[70vh]'} shadow-lg overflow-y-auto`}>
        
        {/* Header */}
        <div className="bg-blue-900 text-white p-3 sticky top-0 flex justify-between items-center">
          <h3 className="font-bold">Your Cart ({cart.length})</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className={`overflow-y-auto ${isLargeScreen ? 'h-[calc(80vh-120px)]' : 'max-h-[60vh]'} p-3`}>
          
          {/* Stay Dates Section */}
          <div className="bg-blue-50 p-3 mb-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-blue-800">Stay Dates</h4>
              <button
                onClick={handleOpenDateModal}
                style={{ background: 'linear-gradient(90deg, #313881, #0678B4)' }}
                className="text-white rounded-md px-2 py-1 hover:text-blue-100 text-sm flex items-center"
              >
                <i className="fa-solid fa-pen mr-1 text-xs"></i> Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-2 rounded border border-blue-100">
                <div className="text-xs text-blue-600 font-medium mb-1">CHECK-IN</div>
                <div className="font-semibold cursor-pointer" onClick={handleOpenDateModal}>
                  {checkin instanceof Date && !isNaN(checkin)
                    ? checkin.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'}
                </div>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <div className="text-xs text-blue-600 font-medium mb-1">CHECK-OUT</div>
                <div className="font-semibold cursor-pointer" onClick={handleOpenDateModal}>
                  {checkout instanceof Date && !isNaN(checkout)
                    ? checkout.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 pt-2 border-t border-blue-100">
              <span className="text-sm font-medium text-blue-800">Total Nights:</span>
              <span className="font-semibold">{calculateNights()}</span>
            </div>
          </div>

          {/* Cart Items */}
          {cart.map((item, index) => {
            const breakdown = getPriceBreakdown(item);
            
            return (
              <div key={index} className="border-b border-gray-200 py-3">
                <div className="flex items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">{item.type}</p>
                    <p className="text-xs text-gray-600">{item.adults} Adults, {item.children} Children</p>
                    <p className="text-xs text-gray-600">Breakfast: {item.breakfast}</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="text-red-500 text-xs hover:text-red-700"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>

                {breakdown.length > 0 && (
                  <div className="mt-2 bg-gray-50 p-2 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Price Breakdown:</p>
                    {breakdown.map((segment, segIdx) => (
                      <div key={segIdx} className="text-xs border-b border-gray-200 last:border-0 py-2">
                        <div className="flex justify-between items-center text-gray-600">
                          <span>{formatDate(segment.fromDate)} - {formatDate(segment.toDate)}</span>
                          <span className="font-medium">{segment.nights} night{segment.nights > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div>
                            {segment.discount > 0 && (
                              <span className="text-red-500 line-through mr-2">
                                BDT {segment.pricePerNight.toLocaleString()}
                              </span>
                            )}
                            <span className="font-semibold text-blue-800">
                              BDT {segment.discountedPrice.toLocaleString()}
                            </span>
                            <span className="text-gray-500">/night</span>
                          </div>
                          <span className="font-bold text-blue-900">
                            BDT {segment.total.toLocaleString()}
                          </span>
                        </div>
                        {segment.discount > 0 && (
                          <p className="text-green-600 mt-1">
                            {segment.discount}% OFF • Save BDT {(segment.originalTotal - segment.total).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-300 font-semibold">
                      <span className="text-sm">Room Total:</span>
                      <span className="text-sm text-blue-900">BDT {calculateItemTotal(item).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {breakdown.length === 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs">
                      <span className="font-medium">Room: BDT {item.price}</span> × {calculateNights()} nights
                    </p>
                    <p className="font-bold text-sm">BDT {calculateItemTotal(item).toLocaleString()}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 sticky bottom-0">
          
          
          <div className="flex justify-between items-center mb-3 pt-2 border-t border-gray-300">
            <span className="font-bold text-base">Grand Total:</span>
            <span className="font-bold text-xl text-blue-900">BDT {calculateTotal().toLocaleString()}</span>
          </div>
          
          <Button
            onClick={handleProceedToCheckout}
            style={{ background: 'linear-gradient(90deg, #313881, #0678B4)' }}
            className="w-full py-2 text-white rounded hover:opacity-90 transition-colors"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;