import Image from "next/image";
import Link from "next/link";
import getCarModel from "@/services/Car/getCarModel";
import getContactNumber from "@/services/tour/getContactNumber";
import CarHeroSection from "../../components/car/car/CarHeroSection";
import Faq from "../../components/car/car/Faq";
import { FaPhone, FaWhatsapp } from "react-icons/fa";

export const metadata = {
  title: "Car Rentals | BookMe",
  description: "Find and book reliable car rentals for your trips. Compare prices, vehicle types, and rental options to suit your needs. Enjoy a convenient and hassle-free car rental experience with BookMe and travel with ease.",
    alternates: {
    canonical: "https://bookme.com.bd/car-rental",
  },
};

export default async function Page() {
    const carModels = await getCarModel();
    const contactNumber = await getContactNumber();

    return (
        <div className="pt-10">
            <CarHeroSection />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <h2 className="text-2xl text-center font-bold text-gray-800 mb-1">Our Popular Car Models</h2>
                <div className="w-20 h-1 mb-4 bg-[#0678B4] mx-auto"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {carModels.map((model) => (
                        <div
                            key={model.id}
                            className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col items-center text-center"
                        >
                            <div className="relative w-full h-40 sm:h-48 mb-4">
                                {model.image ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${model.image}`}
                                        alt={`Image of ${model.model_name} car model, BookMe Car Rental Service, New Car Models Available for Rent, Affordable Prices.`}
                                        fill
                                        className="object-cover rounded-md"
                                        sizes="(max-width: 768px) 100vw,
                                               (max-width: 1200px) 50vw,
                                               25vw"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <h3 className="text-lg font-medium text-gray-900">
                                {model.model_name}
                            </h3>

                            <div className="flex gap-2 mt-3">
                                <Link
                                    href={`tel:${contactNumber?.Phone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-gradient-to-r from-[#313881] to-[#0678B4] hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition"
                                >
                                    <FaPhone className="w-3.5 h-3.5" />
                                    Call
                                </Link>
                                <Link
                                    href={`https://wa.me/${contactNumber?.Phone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition"
                                >
                                    <FaWhatsapp className="w-3.5 h-3.5" />
                                    WhatsApp
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-w-4xl md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-20">
                <Faq />
            </div>
        </div>
    );
}

