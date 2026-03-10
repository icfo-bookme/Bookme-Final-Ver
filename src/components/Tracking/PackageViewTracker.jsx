"use client";

import { useEffect } from "react";

export default function PackageViewTracker({ property }) {
  useEffect(() => {
    if (!property) return;

    window.dataLayer = window.dataLayer || [];

    // declare category properly
    let category = "Tour Package"; // default
    if (property.category_id === 1) {
      category = "Tanguar Haor Tour Package";
    } else if (property.category_id === 2) {
      category = "Sundarban Tour Package";
    } else if (property.category_id === 3) {
      category = "Saint Martin Tour Package";
    }

    console.log("Tracking package view for:", property);

    window.dataLayer.push({
      event: "package_view",
      package_name: property.property_name,
      package_id: property.property_id,
      location: property.district_city,
      category: category,
    });
  }, [property]);

  return null;
}