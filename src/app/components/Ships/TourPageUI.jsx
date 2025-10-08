"use client";
import { useRef, useState, useEffect } from "react";
import ContactForm from "@/app/components/tour/ContactForm/ContactForm";
import ImageCarousel from "@/services/tour/ImageCarousel";
import { IoLocation } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccordionBookMe from "@/app/components/Ships/Accordion";
import PackageCarousel from "@/app/components/tour/packageCarousel/packageCarousel";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function TourPageUI({
  propertyImages,
  propertyDetails,
  propertyFacilities,
  propertyPackages,
  contactNumber,
}) {
  const [isFixed, setIsFixed] = useState(false);
  const accordionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerHeight = 80;
      setIsFixed(scrollY > headerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${roboto.className} pt-[80px] bg-[#EBF0F4] pb-[20px] md:pb-[200px]`}>
      <div className="lg:container w-[98%] md:w-[85%] mx-auto">
        <div className="grid-cols-1 rounded gap-8 lg:grid pr-1 pt-1">
          {/* Property Details */}
          <div className="col-span-1 p-2">
            {propertyDetails?.map((property, index) => (
              <div key={index}>
                <h2 className="font-heading text-xl text-blue-900 font-bold">
                  {property?.property_name}
                </h2>
                <p className="flex text-black items-center">
                  <strong><IoLocation /></strong> {property.address}
                </p>
              </div>
            ))}
          </div>

          {/* Image Carousel */}
          <div>
            {propertyImages?.length > 0 ? (
              <ImageCarousel propertyImages={propertyImages} />
            ) : (
              <div className="flex bg-gray-200 h-96 justify-center w-full items-center">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
          </div>
        </div>

        {/* Packages Section */}
        <div className="my-[30px]">
          <h1 className="font-heading text-blue-700 text-[32px] font-bold my-[32px]">
            Packages:
          </h1>
          <PackageCarousel
            propertyPackages={propertyPackages}
            contactNumber={contactNumber}
          />
        </div>

        {/* Accordion & Contact */}
        <div className="bg-white p-[15px] rounded-lg top-[80px]" ref={accordionRef}>
          <div className="grid-cols-3 rounded gap-10 lg:grid">
            <div className="col-span-2">
              <AccordionBookMe facilities={propertyFacilities} />
            </div>

            <div className="col-span-1 p-[10px] rounded-lg shadow-lg">
              <h1 className="font-heading text-base shadow-2xl bg-white font-bold text-blue-900 md:mt-0 mt-[15px]">
                Get consultancy/Get a call
              </h1>
              <ContactForm
                category={"tour"}
                propertyDetails={propertyDetails[0]?.property_name}
                headline={""}
              />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
