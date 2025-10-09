'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { LuMapPin } from "react-icons/lu";
import SearchButton from "@/utils/SearchButton";
import useScrollOnClick from "@/hooks/useScrollOnFocus";

const AnimatedSearch = ({
  data = [],
  searchType = "default", 
  placeholderConfig = {
    prefix: "Search for",
    showPrefix: true
  },
  buttonText = "Search",
  icon: Icon = LuMapPin,
  showSuggestionsOnFocus = true,
  enableAnimation = true,
  onSearch,
  onItemSelect,
  onSuggestionRender,
  calculateMatchScore,
  formatResultText,
  formatDisplayText,
  router,
  resultUrlTemplate = "/{type}/{slug}/{id}"
}) => {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isFirstInputInteraction, setIsFirstInputInteraction] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const searchRef = useRef(null);
  const [inputRef, handleClick] = useScrollOnClick(150);
  const animationIntervalRef = useRef(null);


  const defaultFormatResultText = (item) => {
    switch (searchType) {
      case "tour":
      case "activities":
      case "ships":
        return `${item.name}, ${item.country}`;
      case "hotel":
        return `${item.hotel_name || item.name}, ${item.street_address || item.country}`;
      case "visa":
        return item.name
      default:
        return item.name;
    }
  };

  const defaultFormatDisplayText = (item) => {
    switch (searchType) {
      case "tour":
        return "TOUR DESTINATION";
      case "activities":
        return "ACTIVITIES/DESTINATION";
      case "ships":
        return "LOCATION/TOUR";
      case "visa":
        return "DESTINATION COUNTRY";
      case "hotel":
        return "CITY/HOTEL/RESORT/AREA";
      default:
        return "SEARCH";
    }
  };

  const finalFormatResultText = formatResultText || defaultFormatResultText;
  const finalFormatDisplayText = formatDisplayText || defaultFormatDisplayText;

  // Default scoring function
  const defaultCalculateMatchScore = (item, query) => {
    if (!query) return 0;

    const itemText = finalFormatResultText(item).toLowerCase();
    const queryText = query.toLowerCase().trim();

    if (itemText === queryText) return 1000;

    if (itemText.startsWith(queryText)) return 850;

    if (itemText.includes(queryText)) {
      const matchPos = itemText.indexOf(queryText);
      return 800 + (50 - Math.min(matchPos, 50));
    }

    const queryWords = queryText.split(/\s+/);
    const allWordsMatch = queryWords.every(word =>
      itemText.includes(word)
    );
    if (allWordsMatch) {
      const matchedWordsCount = queryWords.filter(word =>
        itemText.includes(word)
      ).length;
      return 700 + (matchedWordsCount * 50);
    }

    let partialMatchScore = 0;
    for (let i = 0; i <= queryText.length - 3; i++) {
      const substring = queryText.substring(i, i + 3);
      if (itemText.includes(substring)) {
        const pos = itemText.indexOf(substring);
        partialMatchScore += 100 +
          (substring.length * 20) +
          (pos === 0 ? 50 : (pos < 3 ? 30 : 0));
      }
    }

    if (partialMatchScore > 0) return Math.min(partialMatchScore, 699);

    let charMatchScore = 0;
    let queryIndex = 0;
    for (let i = 0; i < itemText.length && queryIndex < queryText.length; i++) {
      if (itemText[i] === queryText[queryIndex]) {
        charMatchScore += 10;
        queryIndex++;
      }
    }

    return Math.min((charMatchScore / queryText.length) * 100, 600);
  };

  const finalCalculateMatchScore = calculateMatchScore || defaultCalculateMatchScore;

  useEffect(() => {
    if (data?.length) {
      setTimeout(() => {
        setShowPlaceholder(true);
      }, 600);
    }
  }, [data]);

  const startAnimation = useCallback(() => {
    if (!data?.length || !showPlaceholder || isInputFocused || !enableAnimation) return;

    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    animationIntervalRef.current = setInterval(() => {
      setAnimationClass('animate-slideOutUp');
      
      setTimeout(() => {
        setCurrentItemIndex((prevIndex) => 
          (prevIndex + 1) % data.length
        );
        setAnimationClass('animate-slideInDown');
        
        setTimeout(() => {
          setAnimationClass('');
        }, 600);
      }, 600);
    }, 2300); 
  }, [data, showPlaceholder, isInputFocused, enableAnimation]);

  const stopAnimation = useCallback(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isInputFocused) {
      stopAnimation();
    } else {
      startAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [isInputFocused, startAnimation, stopAnimation]);

  const getCurrentItem = () => {
    if (!data?.length) return "";
    const currentItem = data[currentItemIndex];
    return finalFormatResultText(currentItem);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateSuggestions = (query) => {
    if (!query) {
      setFilteredData(data || []);
      return;
    }

    const scoredItems = (data || []).map(item => ({
      ...item,
      score: finalCalculateMatchScore(item, query),
    }));

    const sorted = scoredItems
      .filter(item => item.score > 50)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aNameMatch = finalFormatResultText(a).toLowerCase().includes(query.toLowerCase());
        const bNameMatch = finalFormatResultText(b).toLowerCase().includes(query.toLowerCase());

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;

        const aTextLength = finalFormatResultText(a).length;
        const bTextLength = finalFormatResultText(b).length;
        if (aTextLength !== bTextLength) return aTextLength - bTextLength;

        return finalFormatResultText(a).localeCompare(finalFormatResultText(b));
      });

    setFilteredData(sorted);
  };

  // Event handlers
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateSuggestions(query);
    if (!query) {
      setSelectedItem(null);
    }
  };

  const handleSearchFocus = () => {
    setIsInputFocused(true);
    
    if (isFirstInputInteraction) {
      setIsFirstInputInteraction(false);
      setSearchQuery("");
      setSelectedItem(null);
      setFilteredData(data || []);
    } else {
      updateSuggestions(searchQuery);
    }
    
    if (showSuggestionsOnFocus) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    setIsInputFocused(false);
  };

  const selectItem = (item) => {
    setSearchQuery(finalFormatResultText(item));
    setSelectedItem(item);
    setShowSuggestions(false);
    
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!selectedItem) {
      alert(`Please select a valid ${searchType} from the list`);
      return;
    }

    if (onSearch) {
      onSearch(selectedItem);
    } else if (router && resultUrlTemplate) {
      const slug = finalFormatResultText(selectedItem)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');
      
      const url = resultUrlTemplate
        .replace('{type}', searchType)
        .replace('{slug}', slug)
        .replace('{id}', selectedItem.id || selectedItem.hotel_id);
      
      router.push(url);
    }
  };

  // Highlight matches in text
  const highlightMatches = (text, query) => {
    if (!query) return text;

    const queryChars = new Set(query.toLowerCase());
    return (
      <>
        {text.split("").map((char, idx) => (
          queryChars.has(char.toLowerCase()) ? (
            <span key={idx} className="font-bold text-blue-600">{char}</span>
          ) : (
            <span key={idx}>{char}</span>
          )
        ))}
      </>
    );
  };

  const renderSuggestion = (item, index) => {
    if (onSuggestionRender) {
      return onSuggestionRender(item, index, searchQuery, highlightMatches);
    }

    const displayText = finalFormatResultText(item);
    return (
      <div className="p-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base flex justify-between items-center">
        <div>{highlightMatches(displayText, searchQuery)}</div>
        {index === 0 && item.score > 50 && (
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
            Best match
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white max-w-5xl mx-auto pb-6 text-blue-950 relative" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 gap-4 relative">
          <div className="space-y-1 relative">
            <label className="block text-sm text-blue-950 font-medium">
              {finalFormatDisplayText(selectedItem || data[0])}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <input
                type="text"
                ref={inputRef}
                value={searchQuery}
                onClick={handleClick}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder=""
                className="p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-900 focus:border-blue-900 focus:ring-0 transition-colors w-full font-bold text-blue-950 text-lg pl-10"
                aria-autocomplete="list"
                aria-controls={`${searchType}-suggestions`}
              />
              
              {/* Animated placeholder text */}
              {!searchQuery && (
                <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden h-6 flex items-center">
                  <div className="flex pl-10  items-center space-x-2">
                    {placeholderConfig.showPrefix && (
                      <span className="text-gray-400 hidden  lg:block font-bold">
                        {placeholderConfig.prefix}
                      </span>
                    )}
                    {showPlaceholder && data?.length > 0 && (
                      <span className={`text-gray-400  font-bold transition-all duration-500 ${animationClass}`}>
                        &quot;{getCurrentItem()}&quot;
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {showSuggestions && filteredData.length > 0 && (
              <div 
                id={`${searchType}-suggestions`}
                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
              >
                {filteredData.map((item, index) => (
                  <div
                    key={item.id || item.hotel_id}
                    onClick={() => selectItem(item)}
                  >
                    {renderSuggestion(item, index)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2 flex justify-end">
          <SearchButton type="submit">{buttonText}</SearchButton>
        </div>
      </form>

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

export default AnimatedSearch;