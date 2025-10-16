const SubmitButton = ({ onSubmit, totalPrice, disabled, noPickupLocations }) => (
  <div className="mt-8 pt-5 border-t">
    <button
      onClick={onSubmit}
      disabled={disabled}
      style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
      className="w-full py-3 px-4 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
    >
      Confirm Booking -
      <span className="ml-1 font-semibold">{totalPrice.toLocaleString()} TK</span>
    </button>

    {noPickupLocations && (
      <p className="text-red-600 text-sm mt-2 text-center">
        Please contact support to arrange pickup location before booking
      </p>
    )}
  </div>
);
export default SubmitButton