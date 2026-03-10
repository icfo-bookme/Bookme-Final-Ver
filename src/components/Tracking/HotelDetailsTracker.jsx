"use client";

import { useEffect } from "react";

export default function HotelDetailsTracker({ hotel, rooms }) {
  useEffect(() => {
    if (!hotel || !rooms) return;

    window.dataLayer = window.dataLayer || [];

    // Push hotel and rooms directly without formatting
    window.dataLayer.push({
      event: "view_hotel",
      hotel,
      rooms,
    });

  }, [hotel, rooms]);

  return null;
}