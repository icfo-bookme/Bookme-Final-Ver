
const GuestSelectorField = ({ guests, onTrigger }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
    <div
      onClick={onTrigger}
      className="guest-selector-trigger w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex justify-between items-center hover:border-blue-400 transition-colors"
    >
      <span>
        {guests.adults} Adult{guests.adults !== 1 ? 's' : ''}, {guests.children} Child{guests.children !== 1 ? 'ren' : ''}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
);
export default GuestSelectorField;