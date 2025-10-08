'use client';

import React, { useState, useRef, useEffect, useCallback } from "react";
import { LuMapPin } from "react-icons/lu";
import SearchSuggestions from "./SearchSuggestions";
import useScrollOnClick from "@/hooks/useScrollOnFocus";

const LocationSearch = ({
  destinations,
  hotels,
  searchQuery,
  setSearchQuery,
  selectedLocationId,
  setSelectedLocationId,
  selectedHotelId,
  setSelectedHotelId
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFirstInputInteraction, setIsFirstInputInteraction] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchRef = useRef(null);
  const [inputRef, handleClick] = useScrollOnClick(150);
  const animationIntervalRef = useRef(null);

  // Combine destinations and hotels for animation
  const allItems = [
    ...destinations.map(dest => `${dest.name}, ${dest.country}`),
    ...hotels.map(hotel => `${hotel.hotel_name}, ${hotel.street_address}`)
  ];

  // Initialize show placeholder after mount
  useEffect(() => {
    if (allItems.length > 0) {
      setTimeout(() => {
        setShowPlaceholder(true);
      }, 500);
    }
  }, [allItems.length]);

  // Start animation when component mounts and items are loaded
  const startAnimation = useCallback(() => {
    if (!allItems.length || !showPlaceholder || isInputFocused) return;

    // Clear any existing interval
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    animationIntervalRef.current = setInterval(() => {
      // Start exit animation (move up and out)
      setAnimationClass('animate-slideOutUp');
      
      // After exit animation, change item and start enter animation
      setTimeout(() => {
        setCurrentItemIndex((prevIndex) => 
          (prevIndex + 1) % allItems.length
        );
        setAnimationClass('animate-slideInDown');
        
        // Reset animation class after enter animation completes
        setTimeout(() => {
          setAnimationClass('');
        }, 500);
      }, 500);
    }, 2100); 
  }, [allItems, showPlaceholder, isInputFocused]);

  // Stop animation
  const stopAnimation = useCallback(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
  }, []);

  // Handle animation based on focus state
  useEffect(() => {
    if (isInputFocused) {
      stopAnimation();
    } else {
      startAnimation();
    }

    // Cleanup on unmount
    return () => {
      stopAnimation();
    };
  }, [isInputFocused, startAnimation, stopAnimation]);

  // Get current item for display
  const getCurrentItem = () => {
    if (!allItems.length) return "";
    return allItems[currentItemIndex];
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculateMatchScore = (item, query, isHotel = false) => {
    if (!query) return 0;

    const itemName = isHotel ? item?.hotel_name?.toLowerCase() : item?.name?.toLowerCase();
    const itemLocation = isHotel ? item?.street_address?.toLowerCase() : item?.country?.toLowerCase();
    const itemFullText = isHotel
      ? `${itemName}, ${itemLocation}`.toLowerCase()
      : `${itemName}, ${item.country}`.toLowerCase();
    const queryText = query.toLowerCase().trim();

    if (itemName === queryText) return 1000;
    if (itemFullText === queryText) return 950;

    if (itemFullText.includes(queryText)) {
      const matchPos = itemFullText.indexOf(queryText);
      return 900 + (matchPos === 0 ? 50 : 0);
    }

    if (itemName.startsWith(queryText)) return 850;

    if (itemName.includes(queryText)) {
      const matchPos = itemName.indexOf(queryText);
      return 800 + (50 - Math.min(matchPos, 50));
    }

    const queryWords = queryText.split(/\s+/);
    const allWordsMatch = queryWords.every(word =>
      (itemName || '').includes(word) || (itemLocation || '').includes(word)
    );
    if (allWordsMatch) {
      const matchedWordsCount = queryWords.filter(word =>
        itemName.includes(word)
      ).length;
      return 700 + (matchedWordsCount * 50);
    }

    let partialMatchScore = 0;
    for (let i = 0; i <= queryText.length - 3; i++) {
      const substring = queryText.substring(i, i + 3);
      if (itemName.includes(substring)) {
        const pos = itemName.indexOf(substring);
        partialMatchScore += 100 +
          (substring.length * 20) +
          (pos === 0 ? 50 : (pos < 3 ? 30 : 0));
      }
    }

    if (partialMatchScore > 0) return Math.min(partialMatchScore, 699);

    let charMatchScore = 0;
    let queryIndex = 0;
    for (let i = 0; i < itemName.length && queryIndex < queryText.length; i++) {
      if (itemName[i] === queryText[queryIndex]) {
        charMatchScore += 10;
        queryIndex++;
      }
    }
    return Math.min((charMatchScore / queryText.length) * 100, 600);
  };

  const updateSuggestions = (query) => {
    if (!query) {
      const defaultSuggestions = [
        ...destinations.map(dest => ({
          ...dest,
          type: 'destination',
          score: 0,
          displayName: `${dest.name}, ${dest.country}`
        })),
        ...hotels.map(hotel => ({
          ...hotel,
          type: 'hotel',
          score: 0,
          displayName: `${hotel.hotel_name}, ${hotel.street_address}`
        }))
      ];
      setSuggestions(defaultSuggestions);
      return;
    }

    const scoredItems = [
      ...destinations.map(dest => ({
        ...dest,
        type: 'destination',
        score: calculateMatchScore(dest, query),
        displayName: `${dest.name}, ${dest.country}`
      })),
      ...hotels.map(hotel => ({
        ...hotel,
        type: 'hotel',
        score: calculateMatchScore(hotel, query, true),
        displayName: `${hotel.hotel_name}, ${hotel.street_address}`
      }))
    ];

    const sorted = scoredItems
      .filter(item => item.score > 50)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aNameMatch = a.type === 'hotel'
          ? a.hotel_name.toLowerCase().includes(query.toLowerCase())
          : a.name.toLowerCase().includes(query.toLowerCase());
        const bNameMatch = b.type === 'hotel'
          ? b.hotel_name.toLowerCase().includes(query.toLowerCase())
          : b.name.toLowerCase().includes(query.toLowerCase());

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;

        const aNameLength = a.type === 'hotel' ? a.hotel_name.length : a.name.length;
        const bNameLength = b.type === 'hotel' ? b.hotel_name.length : b.name.length;
        if (aNameLength !== bNameLength) return aNameLength - bNameLength;

        return a.displayName.localeCompare(b.displayName);
      });

    setSuggestions(sorted);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateSuggestions(query);

    if (!query) {
      setSelectedLocationId("");
      setSelectedHotelId("");
    }
  };

  const handleSearchFocus = () => {
    setIsInputFocused(true);
    
    if (isFirstInputInteraction) {
      setIsFirstInputInteraction(false);
      setSearchQuery("");
      setSelectedLocationId("");
      setSelectedHotelId("");
      setSuggestions([
        ...destinations.map(d => ({ ...d, type: 'destination' })),
        ...hotels.map(h => ({ ...h, type: 'hotel' }))
      ]);
    } else {
      updateSuggestions(searchQuery);
    }
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    setIsInputFocused(false);
  };

  const selectItem = (item) => {
    if (item.type === 'destination') {
      setSearchQuery(`${item.name}, ${item.country}`);
      setSelectedLocationId(item.id);
      setSelectedHotelId("");
    } else {
      setSearchQuery(`${item.hotel_name}`);
      setSelectedHotelId(item.hotel_id);
      setSelectedLocationId("");
    }
    setShowSuggestions(false);
  };

  return (
    <div className="col-span-2 sm:col-span-1 space-y-1 relative" ref={searchRef}>
      <label className="block text-sm font-medium text-blue-950">CITY/HOTEL/RESORT/AREA</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LuMapPin className="h-5 w-5 text-blue-600" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onClick={handleClick}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          placeholder=""
          className="pl-9 p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors w-full font-medium text-blue-950 text-base"
          aria-autocomplete="list"
          aria-controls="location-suggestions"
        />
        
        {/* Animated placeholder text */}
        {!searchQuery && (
          <div className="absolute left-9 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden h-6 flex items-center">
            <div className="flex items-center space-x-2">
              
              {showPlaceholder && allItems.length > 0 && (
                <span className={`text-gray-400 font-medium transition-all duration-500 ${animationClass}`}>
                  {getCurrentItem()}
                </span>
              )}
            </div>
          </div>
        )}
        
        <SearchSuggestions
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          searchQuery={searchQuery}
          onSelectItem={selectItem}
          onClose={() => setShowSuggestions(false)}
        />
      </div>

      <style jsx>{`
        @keyframes slideInDown {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutUp {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        
        .animate-slideInDown {
          animation: slideInDown 0.9s ease-in-out;
        }
        
        .animate-slideOutUp {
          animation: slideOutUp 0.9s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LocationSearch;