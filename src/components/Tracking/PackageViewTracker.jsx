"use client";

import { useEffect } from "react";

export default function PackageViewTracker({ property, packages }) {
  useEffect(() => {
    if (!property || !packages) return;

    window.dataLayer = window.dataLayer || [];

    // Determine property category
    let category = "";
    if (property?.category_id === 1) category = "Tanguar Haor Tour Package";
    else if (property?.category_id === 2) category = "Sundarban Tour Package";
    else category = "Saint Martin Tour Package";

    // Prepare packages array
    const packagesData = packages.flatMap((pkg) =>
      (pkg.price || []).map((p) => ({
        name: pkg.unit_name,
        price: Number(p.price),
        category: pkg.unit_category || "room",
        discount: p.discount_percent ? Number(p.discount_percent) : 0,
      }))
    );

    // Push to dataLayer
    window.dataLayer.push({
      event: "view_package",
      property_name: property.property_name,
      property_id: property.property_id,
      location: property.district_city,
      category,
      packages: packagesData,
    });

  }, [property, packages]);

  return null;
}