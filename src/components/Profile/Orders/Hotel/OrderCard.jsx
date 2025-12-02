"use client";

const OrderCard = ({
  order,
  formatDate,
  formatDateTime,
  formatBDTCurrency,
  getStatusBadge,
  getPaymentBadge
}) => {
  console.log(order);
  return (
    <div className="bg-blue-50 rounded-xl border border-gray-300 p-6 hover:shadow-md transition-all duration-300 hover:border-gray-200">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-blue-950 mb-2">
                {order.hotelName}
              </h3>
              <div className="flex items-center text-gray-600 text-sm">
                <i className="fa-solid fa-location-dot text-gray-400 mr-2"></i>
                {order.location}
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-right">
                <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Order Status</div>
                {getStatusBadge(order.status)}
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Payment</div>
                {getPaymentBadge(order.paymentStatus)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="space-y-1 bg-slate-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <i className="fa-solid fa-calendar-check text-blue-500 mr-2 w-4"></i>
            Check-in
          </div>
          <div className="font-semibold text-gray-900">{formatDate(order.checkIn)}</div>
        </div>
        
        <div className="space-y-1 bg-slate-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <i className="fa-solid fa-calendar-xmark text-blue-500 mr-2 w-4"></i>
            Check-out
          </div>
          <div className="font-semibold text-gray-900">{formatDate(order.checkOut)}</div>
        </div>
        
        <div className="space-y-1 bg-slate-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <i className="fa-solid fa-users text-green-500 mr-2 w-4"></i>
            Guests & Rooms
          </div>
          <div className="font-semibold text-gray-900">
            {order.guests} guest{order.guests > 1 ? 's' : ''} • {order.rooms} room{order.rooms > 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="space-y-1 bg-slate-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <i className="fa-solid fa-bed text-purple-500 mr-2 w-4"></i>
            Room Type
          </div>
          <div className="font-semibold text-gray-900">{order.roomType}</div>
        </div>
      </div>

      {/* Price & Info Section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 mb-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-500">Total Amount</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatBDTCurrency(order.totalAmount)}
            </div>
            <div className="text-sm text-gray-500">
              {order.nights} night{order.nights > 1 ? "s" : ""} • {formatBDTCurrency(order.pricePerNight)}/night
            </div>
          </div>
          
          <div className="h-8 border-r border-gray-200 hidden lg:block"></div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-500">Booking Reference</div>
            <div className="font-mono font-semibold text-gray-900 text-lg">REF-{order.id}</div>
            <div className="text-xs text-gray-500">
              Booked on {formatDateTime(order.bookingDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      {order.specialRequests && (
        <div className="mb-6">
          <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
            <i className="fa-solid fa-star text-amber-500 mr-2"></i>
            Special Requests
          </div>
          <div className="text-sm text-gray-700 bg-amber-50 border border-amber-100 p-3 rounded-lg">
            {order.specialRequests}
          </div>
        </div>
      )}

      {/* Actions Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
        {/* Utility Buttons */}
        <div className="flex gap-1 order-2 sm:order-1">
          <button 
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-lg transition-colors text-sm font-medium"
            title="Download invoice"
          >
            <i className="fa-solid fa-download text-sm"></i>
            <span className="hidden sm:inline">Invoice</span>
          </button>
          
          <button 
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 hover:bg-green-50 py-2 px-3 rounded-lg transition-colors text-sm font-medium"
            title="Contact support"
          >
            <i className="fa-solid fa-headset text-sm"></i>
            <span className="hidden sm:inline">Support</span>
          </button>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
          <button className="bg-gradient-to-r from-[#313881] to-[#0678B4] text-white py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2">
            <i className="fa-solid fa-eye text-xs"></i>
            View Details
          </button>

          {order.status === "pending" && order.paymentStatus === "unpaid" && (
            <button className="bg-gradient-to-r from-[#313881] to-[#0678B4] text-white py-2.5 px-5 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2">
              <i className="fa-solid fa-credit-card text-xs"></i>
              Pay Now
            </button>
          )}

          {order.status === "pending" && (
            <button className="border border-red-200 text-red-700 bg-red-50 py-2.5 px-5 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm flex items-center justify-center gap-2">
              <i className="fa-solid fa-xmark text-xs"></i>
              Cancel
            </button>
          )}

          {order.status === "confirmed" && (
            <button className="border border-gray-300 text-gray-700 py-2.5 px-5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2">
              <i className="fa-solid fa-pen text-xs"></i>
              Modify
            </button>
          )}

          {order.status === "completed" && (
            <button className="border border-gray-300 text-gray-700 py-2.5 px-5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2">
              <i className="fa-solid fa-star text-xs"></i>
              Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;