"use client";

import Link from "next/link";
import { getPaymentBadge, getStatusBadge } from "../Hotel/badges";
import EmptyState from "../Hotel/EmptyState";

const ActivitiesOrderComponent = ({ data }) => {

  // Formatters
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatBDT = (amount) => {
    return `৳${Number(amount || 0).toLocaleString()}`;
  };
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <EmptyState activeTab="Activities"/>
      </div>
    );
  }


  return (
    <div>
     

      {/* Cards */}
      <div className="mt-6 space-y-6">
        {data?.map((order) => {

          const subtotal = Number(order.basePrice || 0) * Number(order.guests || 0);

          return (
            <div
              key={order.id}
              className="bg-blue-50 rounded-xl border border-gray-300 p-6 hover:shadow-md transition-all"
            >

              {/* Header */}
              <div className="flex items-center flex-col lg:flex-row justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-blue-950">
                    {order.packageName}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Booking Date: {formatDate(order.bookingDate)}
                  </p>
                </div>

                <div className="flex gap-3">
                  {getStatusBadge(order.status)}
                  {getPaymentBadge(order.paymentStatus)}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-xs text-gray-500 mb-1">Activity Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(order.activityDate)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-xs text-gray-500 mb-1">Time</p>
                  <p className="font-semibold text-gray-900">
                    {formatTime(order.activityTime)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-xs text-gray-500 mb-1">Guests</p>
                  <p className="font-semibold text-gray-900">
                    {order.guests} guest{order.guests > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-xs text-gray-500 mb-1">Pickup</p>
                  <p className="font-semibold text-gray-900">
                    {order.pickupLocation || "N/A"}
                  </p>
                </div>
              </div>

              {/* 💰 Price Breakdown */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border mb-4 space-y-2">

                {/* Base Price */}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Base Price:</span>
                  <span>{formatBDT(order.basePrice)}</span>
                </div>

                {/* Guests */}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Guests:</span>
                  <span>{order.guests}</span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatBDT(subtotal)}</span>
                </div>

                {/* ✅ Discount (Condition) */}


                {/* Divider */}
                <div className="border-t my-2"></div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Payable:</span>
                  <span>{formatBDT(order.totalPayable)}</span>
                </div>
              </div>

              {/* Special Requests */}
              {order.specialRequests && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">
                    Special Requests
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm">
                    {order.specialRequests}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-3 border-t">

                <Link
                  href='#'
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  View Details
                </Link>

                {order.status === "pending" && order.paymentStatus === "unpaid" && (
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                    Pay Now
                  </button>
                )}

                {order.status === "pending" && (
                  <button className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm hover:bg-red-100">
                    Cancel
                  </button>
                )}

                {order.status === "completed" && (
                  <button className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                    Review
                  </button>
                )}

                <div className="flex gap-1 order-2 sm:order-1">
                  <Link href='#'
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-lg transition-colors text-sm font-medium"
                    title="Download invoice"
                  >
                    <i className="fa-solid fa-download text-sm"></i>
                    <span className="hidden sm:inline">Invoice</span>
                  </Link>

                  <Link href='/contact'
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 hover:bg-green-50 py-2 px-3 rounded-lg transition-colors text-sm font-medium"
                    title="Contact support"
                  >
                    <i className="fa-solid fa-headset text-sm"></i>
                    <span className="hidden sm:inline">Support</span>
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitiesOrderComponent;