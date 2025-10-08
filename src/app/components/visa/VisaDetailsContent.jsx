'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPhone } from "react-icons/fa6";
import { ToastContainer } from "react-toastify";
import ContactForm from "@/app/components/tour/ContactForm/ContactForm";

export default function VisaDetails({ visaDetails, contactNumber }) {
  const [showForm, setShowForm] = useState(false);

  if (!visaDetails) {
    return <div className="text-center py-10 text-red-500">Visa details not found</div>;
  }

  return (
    <div className="bg-[#FAFAFA] text-[#333]">
      {/* Hero Image */}
      <div className="h-[250px] lg:h-[550px] relative">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${visaDetails?.main_img}`}
          alt={visaDetails?.property_name}
          fill
          className="object-fill"
        />
      </div>

      <div className="max-w-[100%] lg:max-w-[85%] mx-auto px-4 py-[1.5rem] lg:py-[4.5rem] grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-7 xl:col-span-8">
          <h3 className="p-2 font-semibold w-full rounded-lg">{visaDetails?.country?.name}</h3>
          <h1 className="lg:text-4xl text-3xl font-normal mt-1">{visaDetails?.property_name}</h1>

          {/* Property Summaries */}
          <div className="flex items-center lg:gap-4 mt-4">
            {visaDetails?.property_summaries?.slice().reverse().map((details, index) => (
              <div
                key={details?.id || index}
                className="lg:flex items-center bg-gray-50 px-3 py-2 rounded-lg"
              >
                <div className="flex">
                  <span className="text-gray-700 text-sm">
                    {index === 1 ? "Local_time: " : index === 2 ? "Currency: " : null}
                  </span>
                  <div className="font-semibold text-gray-900">{details?.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-lg p-4 mt-6 shadow-md">
            {visaDetails?.facilities?.map((facility, index) => (
              <div key={facility?.id || index} className="mb-6">
                <h3 className="text-3xl font-semibold mb-3">{facility?.facilty_name}</h3>
                <div
                  className="max-w-none"
                  dangerouslySetInnerHTML={{ __html: facility?.value }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-6">
          {/* Contact Card */}
          <div className="bg-[#ffeedb] border p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-2">Looking for Expert Visa Guidance?</h3>
            <p className="text-base text-black mb-4">Don&apos;t know where to begin? Share your details, and our consultants will assist you.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                className="text-white px-[12px] py-2 rounded hover:bg-[#D46B08]"
              >
                <Link
                  href={`https://wa.me/${contactNumber?.Phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-bold"
                >
                  REQUEST NOW
                </Link>
              </button>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`tel:${contactNumber?.Phone}`}
                className="text-[#f59d3f] font-medium flex items-center"
              >
                <FaPhone className="mr-2 w-4 h-4" />
                {contactNumber?.Phone?.slice(3)}
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="hidden md:block shadow-md">
            <ContactForm category={"visa"} propertyDetails={visaDetails?.property_name} headline={"Request Visa Assistance"} />
          </div>

          {/* Mobile Form Button */}
          <div className="fixed md:hidden bottom-6 right-6 z-50">
            <button
              onClick={() => setShowForm(true)}
              className="visa-assistance-btn visa-animate-btn-shake visa-assistance-pulse"
            >
              Request Visa Assistance
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Visa Application Form</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                      ✕
                    </button>
                  </div>
                  <ContactForm category={"visa"} propertyDetails={visaDetails?.property_name} headline={"Request Visa Assistance"} />
                </div>
              </div>
            </div>
          )}

          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
