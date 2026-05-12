"use client";

import slugify from "@/utils/slugify";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function PropertySearch({
  searchTerm,
  setSearchTerm,
  id,
  setPropertyId,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const router = useRouter();

  // FETCH FUNCTION
  const fetchSuggestions = async (query = "") => {
    let url = "";

    if (!query) {
      url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/property-suggestions/${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/property-suggestions/${id}?q=${query}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    setSuggestions(data);
  };

  // SEARCH
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, 200);

    return () => clearTimeout(delay);
  }, [searchTerm, id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // SELECT
  const handleSelect = (item) => {
    setSearchTerm(item.property_name);

    if (setPropertyId) {
      setPropertyId(item.property_id);
    }

    setOpen(false);
    setSuggestions([]);

    router.push(
      `/Property/${slugify(item.property_name)}/${item.property_id}`
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="block mb-2 font-medium text-gray-900">
        Search property by name
      </label>
    
      <input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setOpen(true);
        }}
        onFocus={async () => {
          setOpen(true);

          const isMobile = window.innerWidth < 768;

          if (isMobile) {
            setTimeout(() => {
              const element = wrapperRef.current;

              if (element) {
                const yOffset = 70;

                const y =
                  element.getBoundingClientRect().top +
                  window.pageYOffset -
                  yOffset;

                window.scrollTo({
                  top: y,
                  behavior: "smooth",
                });
              }
            }, 80);
          }
          if (!searchTerm) {
            await fetchSuggestions();
          }
        }}
        placeholder="Search property by name..."
        className="w-full border p-3 rounded mb-2 text-gray-800"
      />

      {/* DROPDOWN */}
      {open && suggestions.length > 0 && (
        <div className="absolute bg-white text-gray-800 border w-full z-50 max-h-60 overflow-y-auto shadow-lg rounded">
          {suggestions.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSelect(item)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.property_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}