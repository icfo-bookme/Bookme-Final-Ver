"use client";

export default function TourPackageToDataLayer(packageData) {
     
    if (!packageData) return;

    const dataLayerObj = {
        event: "view_tour_package",
        package_name: packageData.data.property_name,
        package_price: packageData.data.price,
        currency: "BDT",
        destination_id: packageData.data.destination_id,
        package_id: packageData.data.id
    };

    if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(dataLayerObj);
    }
}