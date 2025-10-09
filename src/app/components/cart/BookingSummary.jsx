export default function BookingSummary({ bookingData }) {
    if (!bookingData) return null;

    const { cart_session, property, package: packageData } = bookingData;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Summary</h2>
            
            {/* Property Info */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Activity</h3>
                <p className="text-gray-600">{property?.name}</p>
            </div>

            {/* Package Details */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Package Details</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Package:</span>
                        <span className="font-medium">{packageData.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Base Price:</span>
                        <span className="font-medium">৳{packageData.base_price}</span>
                    </div>
                    {packageData.discount_amount !== "0.00" && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>-৳{packageData.discount_amount}</span>
                        </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="text-gray-800 font-semibold">Final Price:</span>
                        <span className="text-lg font-bold text-blue-600">
                            ৳{packageData.final_price}
                        </span>
                    </div>
                </div>
            </div>

            {/* Booking Details */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Booking Details</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(cart_session.date)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{formatTime(cart_session.time)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">{cart_session.total_guest}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Pickup Location:</span>
                        <span className="font-medium text-right">{cart_session.pickup_location}</span>
                    </div>
                </div>
            </div>

            {/* Total Amount */}
            <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">
                        ৳{packageData.final_price}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">*Taxes and fees included</p>
            </div>
        </div>
    );
}