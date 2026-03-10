'use client';

import { useEffect } from "react";

export default function VisaDetailTracking({ visa }) {
  useEffect(() => {
    if (!visa) return;

    // Map units/packages for GTM
    const packages = (visa.property_uinit || []).map(unit => {
      const priceObj = unit.price?.[0] || { price: 0, discount: 0 };
      return {
        package_name: unit.unit_name,
        package_type: unit.unit_type,
        package_price: priceObj.price,
        discount: priceObj.discount,
        validity: unit.Validity,
        max_stay: unit.Max_Stay,
        main_image: unit.mainimg,
      };
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({    
      event: "view_package",
      country: visa.country?.name,
      property_id: visa.property_id,
      property_name: visa.property_name,
      location: visa.district_city || visa.country?.name || "",
      category: "Visa",
      main_image: visa.main_img,
      price_currency: visa.property_summaries?.[0]?.value || "BDT",
      popularity: visa.popularity,
      packages: packages,
      facilities: visa.facilities?.map(f => ({
        name: f.facilty_name,
        value: f.value,
        image: f.img,
      })),
    });

  }, [visa]);

  return null;
}