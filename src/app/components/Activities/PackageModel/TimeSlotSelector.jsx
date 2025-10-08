// components/TimeSlotSelector.jsx
const TimeSlotSelector = ({ value, onChange, className = "" }) => {
  const timeSlots = generateTimeSlots();

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {timeSlots.map((slot) => (
          <button
            key={slot.value}
            type="button"
            onClick={() => onChange(slot.value)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              value === slot.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {slot.display}
          </button>
        ))}
      </div>
      {value && (
        <p className="text-sm text-blue-600 mt-2">
          Selected: {timeSlots.find(slot => slot.value === value)?.display}
        </p>
      )}
    </div>
  );
};

// Helper function to generate time slots
const generateTimeSlots = () => {
  const times = [];
  for (let hour = 8; hour <= 16; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 16 && minute > 0) break;

      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      const displayMinute = minute === 0 ? '00' : minute;

      times.push({
        value: `${hour}:${minute.toString().padStart(2, '0')}`,
        display: `${displayHour}:${displayMinute} ${period}`
      });
    }
  }
  return times;
};

export default TimeSlotSelector;