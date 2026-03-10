"use client";

export default function TourActivityToDataLayer(activityData) {
    if (!activityData) return;

    if (typeof window !== "undefined") {

        window.dataLayer = window.dataLayer || [];

        const packages = activityData.data.packages?.map((pkg) => ({
            package_id: pkg.id,
            package_name: pkg.package_name,
            duration: pkg.duration,
            person_allowed: pkg.person_allowed,
            price: pkg.discounted_price || pkg.regular_price
        }));

        window.dataLayer.push({
            event: "view_activity",
            activity_id: activityData.data.id,
            activity_name: activityData.data.property_name,
            destination_id: activityData.data.destination_id,
            location: activityData.data.address,
            currency: "BDT",
            packages: packages
        });

    }
}