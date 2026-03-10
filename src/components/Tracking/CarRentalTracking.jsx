"use client";

export default function CarRentalToDataLayer(carData) {
    if (!carData) return;

    if (typeof window !== "undefined") {

        window.dataLayer = window.dataLayer || [];

        const models = carData.data.models?.map((model) => ({
            model_id: model.id,
            model_name: model.model_name,
            brand_id: model.brand_id
        }));

        const pricing = {
            base_duration_hours: 4,
            base_distance_km: 40,
            extra_hour_price: 250,
            extra_km_price: 20,
            currency: "BDT"
        };

        window.dataLayer.push({
            event: "view_car_rental",
            property_id: carData.data.id,
            property_name: carData.data.property_name,
            destination_id: carData.data.destination_id,
            models: models,
            pricing: pricing
        });

        console.log("Car rental pushed:", { models, pricing });
    }
}