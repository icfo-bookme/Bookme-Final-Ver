import getFacilities from "@/services/tour/getFacilities";
import getPropertyDetails from "@/services/tour/getPropertyDetails";
import { getPropertyImages } from "@/services/tour/getPropertyImages";
import getPropertyPackages from "@/services/tour/getPropertyPackages";
import getContactNumber from "@/services/tour/getContactNumber";
import TourPageUI from "@/app/components/Ships/TourPageUI";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const propertyDetails = await getPropertyDetails(id);
  const property = propertyDetails?.[0] || {};

  const propertyName = property.property_name || "Tour Property";
  const location = property.district_city || "Bangladesh"; 

  const title = propertyName;

  const description =
    property.meta_description ||
    `${propertyName} located at ${location}. Enjoy an unforgettable experience with our exclusive packages, top-notch facilities, and beautiful views. Perfect for family, friends, and group tours.`;

  const keywords = [
    `${propertyName} tour package`,
    `book ${propertyName}`,
    `${propertyName} in ${location}`,
    `${location} tour destinations`,
    `${propertyName} booking`,
    `group tours to ${propertyName}`,
    `family tours at ${propertyName}`,
    `holiday trips to ${propertyName}`,
    `${propertyName} travel guide`,
    `${location} tourism`,
  ];

  return {
    title,
    description,
    keywords,
  };
}


export default async function TourPage({ params }) {
  const { id } = await params;

  const [
    propertyImages,
    propertyDetails,
    propertyFacilities,
    propertyPackages,
    contactNumber,
  ] = await Promise.all([
    getPropertyImages(id),
    getPropertyDetails(id),
    getFacilities(id),
    getPropertyPackages(id),
    getContactNumber(),
  ]);

  return (
    <TourPageUI
      propertyImages={propertyImages}
      propertyDetails={propertyDetails}
      propertyFacilities={propertyFacilities}
      propertyPackages={propertyPackages}
      contactNumber={contactNumber}
    />
  );
}
