export default function BookingSummary({ bookingData, user, calculations }) {
  const calculateRoomTotalWithTaxes = (item) => {
    const roomTotal = item.price * calculations.nights;
    const roomTaxes = (item.taxes || 0) * calculations.nights;
    return roomTotal + roomTaxes;
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Booking Summary
      </h2>

      {user && <UserInfoSection user={user} />}
      
      <StayDurationSection 
        checkin={bookingData.checkin} 
        checkout={bookingData.checkout} 
        nights={calculations.nights} 
      />
      
      <RoomDetailsSection 
        cart={bookingData.cart} 
        calculations={calculations} 
        calculateRoomTotalWithTaxes={calculateRoomTotalWithTaxes} 
      />
      
      <PriceSummarySection calculations={calculations} />
    </div>
  );
}

// Sub-components for BookingSummary
function UserInfoSection({ user }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-700 mb-3">Account Information</h3>
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center mb-2">
          <i className="fa-solid fa-user text-green-600 mr-2"></i>
          <span className="font-semibold">{user.name}</span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Email: {user.email}</div>
          {user.phone && <div>Phone: {user.phone}</div>}
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
            <div className="font-semibold">
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
            <div className="font-semibold">
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

function RoomDetailsSection({ cart, calculations, calculateRoomTotalWithTaxes }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-700 mb-3">Room Details</h3>
      <div className="space-y-4">
        {cart?.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-800">{item.name}</h4>
              <span className="font-bold text-blue-900">
                BDT {calculateRoomTotalWithTaxes(item)}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Type: {item.type}</div>
              <div>Guests: {item.adults} Adults, {item.children} Children</div>
              <div>Breakfast: {item.breakfast}</div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>BDT {item.price} × {calculations.nights} nights</div>
                <div className="flex justify-between">
                  <span>Room Total:</span>
                  <span>BDT {item.price * calculations.nights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees:</span>
                  <span>BDT {(item.taxes || 0) * calculations.nights}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceSummarySection({ calculations }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-3">Price Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Room Total ({calculations.nights} nights)</span>
          <span>BDT {calculations.roomTotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Taxes & Fees</span>
          <span>BDT {calculations.totalTaxes}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span className="text-blue-900">BDT {calculations.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}