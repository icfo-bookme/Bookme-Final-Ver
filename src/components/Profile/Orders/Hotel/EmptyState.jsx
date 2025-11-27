"use client";

const EmptyState = ({ activeTab }) => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No {activeTab} bookings
      </h3>

      <p className="text-gray-500 mb-6">
        {activeTab === "upcoming"
          ? "You don't have any upcoming hotel bookings."
          : activeTab === "completed"
          ? "You haven't completed any hotel stays yet."
          : "You haven't cancelled any hotel bookings."}
      </p>

      {activeTab === "upcoming" && (
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Find Hotels
        </button>
      )}
    </div>
  );
};

export default EmptyState;
