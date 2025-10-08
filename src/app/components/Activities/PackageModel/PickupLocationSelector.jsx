// components/PickupLocationSelector.jsx
import { TailSpin } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PickupLocationSelector = ({ 
  property_id, 
  value, 
  onChange, 
  className = "" 
}) => {
  const router = useRouter();
  const [pickupLocations, setPickupLocations] = useState([]);
  const [fetchingPickup, setFetchingPickup] = useState(false);
  const [noPickupLocations, setNoPickupLocations] = useState(false);

  useEffect(() => {
    const fetchPickupDestinations = async () => {
      if (!property_id) {
        setNoPickupLocations(true);
        return;
      }

      setFetchingPickup(true);
      setNoPickupLocations(false);
      
      try {
        const response = await fetch(
          `https://bookme.com.bd/admin/api/pickup/destinations/${property_id}`
        );

        if (response.ok) {
          const data = await response.json();
          
          if (!data || data.length === 0) {
            setNoPickupLocations(true);
            setPickupLocations([]);
          } else {
            const destinations = data.map(item => item.destination);
            setPickupLocations(destinations);
            setNoPickupLocations(false);
            
            // Set default pickup location
            if (destinations.length > 0 && !value) {
              onChange(destinations[0]);
            }
          }
        } else {
          setNoPickupLocations(true);
          setPickupLocations([]);
        }
      } catch (error) {
        console.error("Error fetching pickup destinations:", error);
        setNoPickupLocations(true);
        setPickupLocations([]);
      } finally {
        setFetchingPickup(false);
      }
    };

    fetchPickupDestinations();
  }, [property_id, value, onChange]);

  const handleContactSupport = () => {
    router.push('/contact');
  };

  if (fetchingPickup) {
    return (
      <div className={`p-3 border border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
        <TailSpin height="20" width="20" color="#0678B4" />
      </div>
    );
  }

  if (noPickupLocations) {
    return (
      <div className={`p-4 border border-yellow-300 rounded-lg bg-yellow-50 ${className}`}>
        <p className="text-yellow-700 text-sm font-medium">No pickup locations found</p>
        <p className="text-yellow-600 text-xs mt-1">Please contact our support team for assistance</p>
        <button
          onClick={handleContactSupport}
          className="mt-2 px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
        >
          Contact Support
        </button>
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      required
    >
      <option value="">Select pickup location</option>
      {pickupLocations.map((location, index) => (
        <option key={index} value={location}>{location}</option>
      ))}
    </select>
  );
};

export default PickupLocationSelector;