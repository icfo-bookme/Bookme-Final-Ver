
const DateSelector = ({ value, onChange, formatDate }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={new Date().toISOString().split('T')[0]}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      required
    />
    {value && (
      <p className="text-sm text-blue-600 mt-1">{formatDate(value)}</p>
    )}
  </div>
);

export default DateSelector;