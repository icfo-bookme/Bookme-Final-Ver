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
      hotel_id: hotel_id,
      hotelDetails: hotelDetails,
      checkin: checkin.toISOString(),
      checkout: checkout.toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'bookingData',
        bookingData: bookingData,
      });
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const calculateNights = () => {
    if (!checkin || !checkout) return 1;
    const diffTime = checkout - checkin;
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Function to find matching price segment for a date
  const findMatchingPriceSegment = (item, date) => {
    if (!item.price_segments || item.price_segments.length === 0) {
      // Fallback to single price
      return {
        price_per_night: item.price,
        discount: item.discount || 0,
        final_segment_price: item.price * calculateNights()
      };
    }

    const checkDate = new Date(date);
    
    // Find segment that contains this date
    const matchingSegment = item.price_segments.find(segment => {
      const fromDate = new Date(segment.effective_from);
      const toDate = new Date(segment.effective_till);
      return checkDate >= fromDate && checkDate <= toDate;
    });

    return matchingSegment || item.price_segments[0]; // Fallback to first segment if no match
  };

  // Calculate total for entire stay considering multiple price segments
  const calculateItemTotal = (item) => {
    const nights = calculateNights();
    
    if (!item.price_segments || item.price_segments.length === 0) {
      // Single price fallback
      const pricePerNight = item.price || 0;
      const taxesPerNight = item.taxes || 0;
      return (pricePerNight + taxesPerNight) * nights;
    }

    let total = 0;
    
    // Calculate total for each night based on applicable price segment
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(checkin);
      currentDate.setDate(checkin.getDate() + i);
      
      const segment = findMatchingPriceSegment(item, currentDate);
      
      if (segment) {
        const pricePerNight = Number(segment.price_per_night);
        const discount = Number(segment.discount || 0);
        const discountedPrice = Math.round(pricePerNight - (pricePerNight * discount / 100));
        const taxesPerNight = item.taxes || 0;
        
        total += discountedPrice + taxesPerNight;
      }
    }
    
    return total;
  };

  // Get price breakdown by segment
  const getPriceBreakdown = (item) => {
    const nights = calculateNights();
    const breakdown = [];
    
    if (!item.price_segments || item.price_segments.length === 0) {
      return [{
        fromDate: checkin,
        toDate: checkout,
        pricePerNight: item.price,
        discountedPrice: item.price,
        nights: nights,
        total: (item.price + (item.taxes || 0)) * nights
      }];
    }

    let remainingNights = nights;
    let currentDate = new Date(checkin);
    
    while (remainingNights > 0) {
      const segment = findMatchingPriceSegment(item, currentDate);
      
      if (segment) {
        const segmentEnd = new Date(segment.effective_till);
        const nightsInSegment = Math.min(
          remainingNights,
          Math.ceil((segmentEnd - currentDate) / (1000 * 60 * 60 * 24)) + 1
        );
        
        const pricePerNight = Number(segment.price_per_night);
        const discount = Number(segment.discount || 0);
        const discountedPrice = Math.round(pricePerNight - (pricePerNight * discount / 100));
        const taxesPerNight = item.taxes || 0;
        
        breakdown.push({
          fromDate: new Date(currentDate),
          toDate: new Date(currentDate.getTime() + (nightsInSegment - 1) * 24 * 60 * 60 * 1000),
          pricePerNight: pricePerNight,
          discountedPrice: discountedPrice,
          discount: discount,
          nights: nightsInSegment,
          total: (discountedPrice + taxesPerNight) * nightsInSegment,
          originalTotal: (pricePerNight + taxesPerNight) * nightsInSegment
        });
        
        remainingNights -= nightsInSegment;
        currentDate.setDate(currentDate.getDate() + nightsInSegment);
      } else {
        break;
      }
    }
    
    return breakdown;
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const handleOpenDateModal = () => {
    setTempCheckin(checkin);
    setTempCheckout(checkout);
    setShowDatePickerModal(true);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setTempCheckin(start);
    setTempCheckout(end);
  };

  const applyDateChanges = () => {
    if (!tempCheckin || !tempCheckout) return;

    const BDT_OFFSET = 6 * 60;

    const toBangladeshTime = (date) => {
      const utc = date.getTime() + date.getTimezoneOffset() * 60000;
      return new Date(utc + BDT_OFFSET * 60000);
    };

    const formatBDT = (date) => {
      const d = toBangladeshTime(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const seconds = String(d.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const checkinBDT = toBangladeshTime(tempCheckin);
    const checkoutBDT = toBangladeshTime(tempCheckout);

    setCheckin(checkinBDT);
    setCheckout(checkoutBDT);
    onDatesChange(checkinBDT, checkoutBDT);

    const bookingData = {
      cart,
      hotel_id: hotel_id,
      checkin: formatBDT(tempCheckin),   
      checkout: formatBDT(tempCheckout), 
      lastUpdated: formatBDT(new Date()),
    };

    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    setShowDatePickerModal(false);
  };

  const formatDate = (date) => {
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
      
      {/* Date Picker Modal */}
      {showDatePickerModal && (
        <DatePickerModal
          dateRange={[tempCheckin, tempCheckout]}
          handleDateChange={handleDateChange}
          setShowDatePicker={setShowDatePickerModal}
          onApply={applyDateChanges}
        />
      )}

      {/* Cart Container */}
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
                  {checkin.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <div className="text-xs text-blue-600 font-medium mb-1">CHECK-OUT</div>
                <div className="font-semibold cursor-pointer" onClick={handleOpenDateModal}>
                  {checkout.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
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
                {/* Room Summary */}
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

                {/* Price Breakdown by Segment */}
                {breakdown.length > 0 && (
                  <div className="mt-2 bg-gray-50 p-2 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Price Breakdown:</p>
                    {breakdown.map((segment, segIdx) => (
                      <div key={segIdx} className="text-xs border-b border-gray-200 last:border-0 py-2">
                        <div className="flex justify-between items-center text-gray-600">
                          <span>
                            {formatDate(segment.fromDate)} - {formatDate(segment.toDate)}
                          </span>
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
                    
                    {/* Segment Total */}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-300 font-semibold">
                      <span className="text-sm">Room Total:</span>
                      <span className="text-sm text-blue-900">BDT {calculateItemTotal(item).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Simple view if no segments */}
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
          {/* Grand Total Summary */}
          <div className="mb-3">
            {cart.map((item, index) => {
              const breakdown = getPriceBreakdown(item);
              return breakdown.map((segment, segIdx) => (
                <div key={`${index}-${segIdx}`} className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{item.name} - {formatDate(segment.fromDate)} to {formatDate(segment.toDate)}</span>
                  <span>BDT {segment.total.toLocaleString()}</span>
                </div>
              ));
            })}
          </div>
          
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