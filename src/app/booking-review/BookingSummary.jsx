export default function BookingSummary({ bookingData, user, calculations }) {
  
  // Function to find matching price segment for a date
  const findMatchingPriceSegment = (item, date) => {
    if (!item.price_segments || item.price_segments.length === 0) {
      return {
        price_per_night: item.price,
        discount: item.discount || 0,
        final_segment_price: item.price
      };
    }

    const checkDate = new Date(date);
    
    const matchingSegment = item.price_segments.find(segment => {
      const fromDate = new Date(segment.effective_from);
      const toDate = new Date(segment.effective_till);
      return checkDate >= fromDate && checkDate <= toDate;
    });

    return matchingSegment || item.price_segments[0];
  };

  // Get price breakdown by segment for an item
  const getItemPriceBreakdown = (item, checkin, checkout) => {
    const nights = calculations.nights;
    const breakdown = [];
    
    if (!item.price_segments || item.price_segments.length === 0) {
      // Single price fallback
      return [{
        fromDate: new Date(checkin),
        toDate: new Date(checkout),
        pricePerNight: item.price,
        discountedPrice: item.price,
        originalPrice: item.price,
        discount: item.discount || 0,
        nights: nights,
        roomTotal: item.price * nights,
        taxesTotal: (item.taxes || 0) * nights,
        grandTotal: (item.price + (item.taxes || 0)) * nights
      }];
    }

    let remainingNights = nights;
    let currentDate = new Date(checkin);
    
    while (remainingNights > 0 && currentDate < new Date(checkout)) {
      const segment = findMatchingPriceSegment(item, currentDate);
      
      if (segment) {
        const segmentEnd = new Date(segment.effective_till);
        const checkoutDate = new Date(checkout);
        const maxNightsInSegment = Math.min(
          remainingNights,
          Math.ceil((Math.min(segmentEnd, checkoutDate) - currentDate) / (1000 * 60 * 60 * 24)) + 1
        );
        
        const pricePerNight = Number(segment.price_per_night);
        const discount = Number(segment.discount || 0);
        const discountedPrice = Math.round(pricePerNight - (pricePerNight * discount / 100));
        const taxesPerNight = item.taxes || 0;
        
        const segmentEndDate = new Date(currentDate);
        segmentEndDate.setDate(currentDate.getDate() + maxNightsInSegment - 1);
        
        breakdown.push({
          fromDate: new Date(currentDate),
          toDate: segmentEndDate,
          pricePerNight: pricePerNight,
          discountedPrice: discountedPrice,
          originalPrice: pricePerNight,
          discount: discount,
          nights: maxNightsInSegment,
          roomTotal: discountedPrice * maxNightsInSegment,
          taxesTotal: taxesPerNight * maxNightsInSegment,
          originalRoomTotal: pricePerNight * maxNightsInSegment,
          grandTotal: (discountedPrice + taxesPerNight) * maxNightsInSegment
        });
        
        remainingNights -= maxNightsInSegment;
        currentDate.setDate(currentDate.getDate() + maxNightsInSegment);
      } else {
        break;
      }
    }
    
    return breakdown;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  console.log(bookingData);
  
  return (
    <div className="bg-gray-50 px-6 rounded-lg">
      <div className="mb-3">
        <p className="text-lg font-semibold text-blue-800 text-center bg-blue-50 py-3 px-4 rounded-lg border border-blue-100">
          {bookingData?.hotelDetails?.name}
        </p>
      </div>
      <h2 className="text-lg text-center font-bold text-gray-700 border-b border-gray-100">
        Booking Summary
      </h2>
      
      {user && <UserInfoSection user={user} />} 
      <StayDurationSection 
        checkin={bookingData?.checkin} 
        checkout={bookingData?.checkout} 
        nights={calculations?.nights} 
      />
      <RoomDetailsSection 
        cart={bookingData?.cart} 
        calculations={calculations}
        getItemPriceBreakdown={getItemPriceBreakdown}
        formatDate={formatDate}
      />
      <PriceSummarySection 
        calculations={calculations}
        cart={bookingData?.cart}
        getItemPriceBreakdown={getItemPriceBreakdown}
        formatDate={formatDate}
      />
    </div>
  );
}

function UserInfoSection({ user }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-700 mb-3">Account Information</h3>
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center mb-2">
          <i className="fa-solid fa-user text-green-600 mr-2"></i>
          <span className="font-semibold">{user?.name}</span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Email: {user?.email}</div>
          {user?.phone && <div>Phone: {user?.phone}</div>}
          <div className="text-xs text-green-600 mt-2">
            ✓ Your account information is pre-filled in the form, but you can modify it if needed.
          </div>
        </div>
      </div>
    </div>
  );
}

function StayDurationSection({ checkin, checkout, nights }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-700 mb-3">Stay Duration</h3>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="text-sm text-gray-600">Check-in</div>
            <div className="font-semibold text-black">
              {new Date(checkin).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Check-out</div>
            <div className="font-semibold text-black">
              {new Date(checkout).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Total Nights:</span>
          <span className="font-semibold">{nights}</span>
        </div>
      </div>
    </div>
  );
}

function RoomDetailsSection({ cart, calculations, getItemPriceBreakdown, formatDate }) {
  const calculateRoomTotalWithTaxes = (item) => {
    const breakdown = getItemPriceBreakdown(item, calculations.checkin, calculations.checkout);
    return breakdown.reduce((sum, segment) => sum + segment.grandTotal, 0);
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-700 mb-3">Room Details</h3>
      <div className="space-y-4">
        {cart?.map((item, index) => {
          const breakdown = getItemPriceBreakdown(item, calculations.checkin, calculations.checkout);
          const itemTotal = calculateRoomTotalWithTaxes(item);
          
          return (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              {/* Room Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.type}</p>
                </div>
                <span className="font-bold text-lg text-blue-900">
                  BDT {itemTotal.toLocaleString()}
                </span>
              </div>
              
              {/* Guest Info */}
              <div className="text-sm text-gray-600 mb-3">
                <div>Guests: {item.adults} Adults, {item.children} Children</div>
                <div>Breakfast: {item.breakfast}</div>
              </div>

              {/* Price Breakdown by Segment */}
              {breakdown.length > 0 && (
                <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Price Breakdown:</p>
                  {breakdown.map((segment, segIdx) => (
                    <div key={segIdx} className="text-xs border-b border-gray-200 last:border-0 py-2">
                      {/* Date Range */}
                      <div className="flex justify-between items-center text-gray-600 mb-1">
                        <span className="font-medium">
                          {formatDate(segment.fromDate)} - {formatDate(segment.toDate)}
                        </span>
                        <span>{segment.nights} night{segment.nights > 1 ? 's' : ''}</span>
                      </div>
                      
                      {/* Price per Night */}
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
                        <span className="font-semibold">
                          BDT {segment.roomTotal.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Taxes */}
                      <div className="flex justify-between items-center mt-1 text-gray-500">
                        <span>Govt. Taxes & Fees</span>
                        <span>BDT {segment.taxesTotal.toLocaleString()}</span>
                      </div>
                      
                      {/* Segment Total */}
                      <div className="flex justify-between items-center mt-1 font-medium">
                        <span>Segment Total</span>
                        <span className="text-blue-800">BDT {segment.grandTotal.toLocaleString()}</span>
                      </div>
                      
                      {/* Discount Info */}
                      {segment.discount > 0 && (
                        <p className="text-green-600 mt-1">
                          {segment.discount}% OFF • Save BDT {(segment.originalRoomTotal - segment.roomTotal).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {/* Item Total */}
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-300 font-semibold">
                    <span className="text-sm">Room Total (incl. taxes)</span>
                    <span className="text-sm text-blue-900">BDT {itemTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Simple view if no segments */}
              {breakdown.length === 0 && (
                <div className="text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>BDT {item.price} × {calculations.nights} nights</span>
                    <span>BDT {item.price * calculations.nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Govt. Taxes & Fees:</span>
                    <span>BDT {(item.taxes || 0) * calculations.nights}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PriceSummarySection({ calculations, cart, getItemPriceBreakdown, formatDate }) {
  // Calculate detailed totals by segment
  const getDetailedTotals = () => {
    if (!cart || !calculations) return null;

    let roomTotal = 0;
    let totalTaxes = 0;
    let grandTotal = 0;
    const segmentDetails = [];

    cart.forEach(item => {
      const breakdown = getItemPriceBreakdown(item, calculations.checkin, calculations.checkout);
      
      breakdown.forEach(segment => {
        roomTotal += segment.roomTotal;
        totalTaxes += segment.taxesTotal;
        grandTotal += segment.grandTotal;
        
        segmentDetails.push({
          ...segment,
          roomName: item.name
        });
      });
    });

    return { roomTotal, totalTaxes, grandTotal, segmentDetails };
  };

  const totals = getDetailedTotals();

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <h3 className="font-semibold text-gray-700 mb-3">Price Summary</h3>
      
      {/* Segment-wise breakdown */}
      {totals?.segmentDetails.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-semibold text-gray-600">Detailed Breakdown:</p>
          {totals.segmentDetails.map((segment, idx) => (
            <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
              <div className="font-medium text-gray-700 mb-1">
                {segment.roomName}
              </div>
              <div className="text-gray-600">
                {formatDate(segment.fromDate)} - {formatDate(segment.toDate)}
              </div>
              <div className="flex justify-between mt-1">
                <span>{segment.nights} nights @ BDT {segment.discountedPrice.toLocaleString()}/night</span>
                <span className="font-medium">BDT {segment.roomTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Taxes & Fees</span>
                <span>BDT {segment.taxesTotal.toLocaleString()}</span>
              </div>
              {segment.discount > 0 && (
                <div className="text-green-600 mt-1">
                  Saved BDT {(segment.originalRoomTotal - segment.roomTotal).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Summary Totals */}
      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between text-sm">
          <span>Room Total ({calculations?.nights} nights)</span>
          <span>BDT {totals?.roomTotal?.toLocaleString() || calculations?.roomTotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Govt. Taxes & Fees</span>
          <span>BDT {totals?.totalTaxes?.toLocaleString() || calculations?.totalTaxes}</span>
        </div>
        
        {/* Total Savings */}
        {totals?.segmentDetails.some(s => s.discount > 0) && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Total Savings</span>
            <span>
              BDT {totals.segmentDetails
                .reduce((sum, s) => sum + (s.originalRoomTotal - s.roomTotal), 0)
                .toLocaleString()}
            </span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between font-semibold text-lg text-blue-900">
            <span>Total Amount</span>
            <span>BDT {totals?.grandTotal?.toLocaleString() || calculations?.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}