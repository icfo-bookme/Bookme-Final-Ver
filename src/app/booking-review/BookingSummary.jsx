export default function BookingSummary({ bookingData, user, calculations }) {

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

  // ✅ Calculate nights from bookingData directly (safe fallback)
  const getNights = () => {
    const cin = bookingData?.checkin || calculations?.checkin;
    const cout = bookingData?.checkout || calculations?.checkout;
    if (!cin || !cout) return calculations?.nights || 1;
    const a = new Date(cin); a.setHours(0, 0, 0, 0);
    const b = new Date(cout); b.setHours(0, 0, 0, 0);
    return Math.max(1, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));
  };

  // ✅ Group consecutive same-price nights into single rows
  const getItemPriceBreakdown = (item) => {
    const cin = bookingData?.checkin || calculations?.checkin;
    const cout = bookingData?.checkout || calculations?.checkout;
    if (!cin || !cout) return [];

    const checkinDate = new Date(cin);
    checkinDate.setHours(0, 0, 0, 0);
    const nights = getNights();

    // No segments: flat single row
    if (!item.price_segments || item.price_segments.length === 0) {
      const pricePerNight = item.price || 0;
      const taxesPerNight = Number(item.taxes) || 0;
      return [{
        pricePerNight,
        discountedPrice: pricePerNight,
        discount: 0,
        nights,
        roomTotal: pricePerNight * nights,
        taxesTotal: taxesPerNight * nights,
        originalRoomTotal: pricePerNight * nights,
        grandTotal: (pricePerNight + taxesPerNight) * nights
      }];
    }

    // Build per-night segment keys
    const perNight = [];
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(checkinDate);
      currentDate.setDate(checkinDate.getDate() + i);
      const segment = findMatchingPriceSegment(item, currentDate);
      if (segment) {
        perNight.push({
          segmentKey: `${segment.price_per_night}-${segment.discount || 0}-${segment.effective_from}-${segment.effective_till}`,
          pricePerNight: Number(segment.price_per_night) || 0,
          discount: Number(segment.discount || 0),
        });
      }
    }

    // ✅ Merge consecutive nights with same segmentKey
    const grouped = [];
    for (const night of perNight) {
      const last = grouped[grouped.length - 1];
      if (last && last.segmentKey === night.segmentKey) {
        last.nights += 1;
      } else {
        grouped.push({ ...night, nights: 1 });
      }
    }

    // Build final breakdown rows
    const taxesPerNight = Number(item.taxes) || 0;
    return grouped.map(group => {
      const discountedPrice = Math.round(
        group.pricePerNight - (group.pricePerNight * group.discount / 100)
      );
      return {
        pricePerNight: group.pricePerNight,
        discountedPrice,
        discount: group.discount,
        nights: group.nights,
        roomTotal: discountedPrice * group.nights,
        taxesTotal: taxesPerNight * group.nights,
        originalRoomTotal: group.pricePerNight * group.nights,
        grandTotal: (discountedPrice + taxesPerNight) * group.nights
      };
    });
  };

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
        nights={getNights()}
      />
      <RoomDetailsSection
        cart={bookingData?.cart}
        nights={getNights()}
        getItemPriceBreakdown={getItemPriceBreakdown}
        formatDate={formatDate}
      />
      <PriceSummarySection
        nights={getNights()}
        cart={bookingData?.cart}
        getItemPriceBreakdown={getItemPriceBreakdown}
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
              {checkin ? new Date(checkin).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
              }) : '—'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Check-out</div>
            <div className="font-semibold text-black">
              {checkout ? new Date(checkout).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
              }) : '—'}
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

function RoomDetailsSection({ cart, nights, getItemPriceBreakdown, formatDate }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-700 mb-3">Room Details</h3>
      <div className="space-y-4">
        {cart?.map((item, index) => {
          const breakdown = getItemPriceBreakdown(item);
          const itemTotal = breakdown.reduce((sum, s) => sum + s.grandTotal, 0);

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

              {/* ✅ Price Breakdown Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-700">Price Breakdown</p>
                </div>
                <div className="px-3 py-2 space-y-2">
                  {breakdown.map((segment, segIdx) => (
                    <div key={segIdx} className="text-xs">

                      {/* Price × Nights = Total */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 flex-wrap text-gray-700">
                          {segment.discount > 0 && (
                            <span className="line-through text-gray-400">
                              BDT {segment.pricePerNight.toLocaleString()}
                            </span>
                          )}
                          <span className="font-semibold text-blue-800">
                            BDT {segment.discountedPrice.toLocaleString()}
                          </span>
                          <span className="text-gray-400">×</span>
                          <span className="font-medium text-gray-600">
                            {segment.nights} night{segment.nights > 1 ? 's' : ''}
                          </span>
                        </div>
                        <span className="font-bold text-blue-900 ml-2">
                          BDT {segment.roomTotal.toLocaleString()}
                        </span>
                      </div>

                      {/* Taxes */}
                      {item.taxes > 0 && (
                        <div className="flex items-center justify-between mt-1 text-gray-500">
                          <span>Govt. Taxes & Fees × {segment.nights} night{segment.nights > 1 ? 's' : ''}</span>
                          <span>BDT {segment.taxesTotal.toLocaleString()}</span>
                        </div>
                      )}

                      {/* Discount badge */}
                      {segment.discount > 0 && (
                        <div className="mt-1 inline-flex items-center gap-1 bg-green-50 border border-green-200 rounded px-1.5 py-0.5">
                          <span className="text-green-600 font-medium">{segment.discount}% OFF</span>
                          <span className="text-green-500">
                            · Save BDT {(segment.originalRoomTotal - segment.roomTotal).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {segIdx < breakdown.length - 1 && (
                        <div className="border-t border-dashed border-gray-200 mt-2" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Room Total Footer */}
                <div className="flex justify-between items-center px-3 py-2 bg-blue-50 border-t border-gray-200">
                  <span className="text-xs font-semibold text-gray-700">
                    Room Total ({nights} night{nights > 1 ? 's' : ''})
                  </span>
                  <span className="text-sm font-bold text-blue-900">
                    BDT {itemTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PriceSummarySection({ nights, cart, getItemPriceBreakdown }) {
  if (!cart) return null;

  let roomTotal = 0;
  let totalTaxes = 0;
  let totalSavings = 0;
  let grandTotal = 0;

  cart.forEach(item => {
    const breakdown = getItemPriceBreakdown(item);
    breakdown.forEach(segment => {
      roomTotal += segment.roomTotal;
      totalTaxes += segment.taxesTotal;
      totalSavings += segment.originalRoomTotal - segment.roomTotal;
      grandTotal += segment.grandTotal;
    });
  });

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <h3 className="font-semibold text-gray-700 mb-3">Price Summary</h3>
      <div className="space-y-2 text-gray-700">

        <div className="flex justify-between text-sm">
          <span>Room Total ({nights} night{nights > 1 ? 's' : ''})</span>
          <span>BDT {roomTotal.toLocaleString()}</span>
        </div>

        {totalTaxes > 0 && (
          <div className="flex justify-between text-sm">
            <span>Govt. Taxes & Fees</span>
            <span>BDT {totalTaxes.toLocaleString()}</span>
          </div>
        )}

        {totalSavings > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Total Savings</span>
            <span>- BDT {totalSavings.toLocaleString()}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between font-semibold text-lg text-blue-900">
            <span>Total Amount</span>
            <span>BDT {grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}