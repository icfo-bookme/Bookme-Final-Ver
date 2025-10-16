
import { useState, useRef, useEffect } from 'react';

const GuestSelector = ({ guests, onChange, onClose }) => {
  const modalRef = useRef(null);

  const updateGuestCount = (type, operation) => {
    const newCount = operation === 'increase' ? guests[type] + 1 : Math.max(0, guests[type] - 1);
    
    if (type === 'adults' && newCount === 0 && guests.children > 0) {
      onChange({ ...guests, adults: 1 });
      return;
    }

    onChange({ ...guests, [type]: newCount });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-[#00026E]">Number of Guests</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <GuestCounter
            label="Adults"
            description="Age 13+"
            count={guests.adults}
            onIncrease={() => updateGuestCount('adults', 'increase')}
            onDecrease={() => updateGuestCount('adults', 'decrease')}
            minCount={1}
          />
          
          <GuestCounter
            label="Children"
            description="Ages 2-12"
            count={guests.children}
            onIncrease={() => updateGuestCount('children', 'increase')}
            onDecrease={() => updateGuestCount('children', 'decrease')}
            minCount={0}
          />
        </div>

        <div className="p-6 border-t">
          <button
            onClick={onClose}
            style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
            className="w-full py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Confirm Guests
          </button>
        </div>
      </div>
    </div>
  );
};

const GuestCounter = ({ label, description, count, onIncrease, onDecrease, minCount }) => (
  <div className="flex justify-between items-center">
    <div>
      <h4 className="font-medium text-gray-700">{label}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <div className="flex items-center gap-4">
      <button
        onClick={onDecrease}
        disabled={count <= minCount}
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="text-xl font-bold w-8 text-center">{count}</span>
      <button
        onClick={onIncrease}
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  </div>
);

export default GuestSelector;