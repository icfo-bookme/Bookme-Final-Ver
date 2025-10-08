export default function BookingHeader({ user }) {
  return (
    <div className="bg-blue-900 text-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Review Your Booking</h1>
          <p className="text-blue-200">
            Please review your details and complete the booking
          </p>
          {user && (
            <div className="mt-2 flex items-center text-green-300">
              <i className="fa-solid fa-user-check mr-2"></i>
              <span>Logged in as {user.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}