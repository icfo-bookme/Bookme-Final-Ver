const { default: PickupLocationSelector } = require("./PickupLocationSelector");

const PickupLocationField = ({ property_id, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Starting Point/Pickup Location
    </label>
    <PickupLocationSelector
      property_id={property_id}
      value={value}
      onChange={onChange}
    />
  </div>
);
export default PickupLocationField;