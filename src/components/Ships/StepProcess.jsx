import Image from "next/image";
import { Roboto } from 'next/font/google';
import { Playfair_Display } from 'next/font/google';
import termsIcon from "../../../public/icons/payment-process.png";
import { FaPhoneAlt } from "react-icons/fa";

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] });
const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-playfair',
    display: 'swap',
});

const steps = [
    {
        title: "Step: 1",
        description: "Choose your plan",
        icon: "/icons/icons-choose.png",
    },
    {
        title: "Step: 2",
        description: "Call/Chat with agent",
        icon: "/icons/icon-call-center.png",
    },
    {
        title: "Step: 3",
        description: "Make your payment",
        icon: "/icons/payment-process.png",
    },
    {
        title: "Step: 4",
        description: "Collect your ticket",
        icon: "/icons/icon-ticket-receive.png",
    },
];

export default function StepProcess() {
    return (
        <div className={`${roboto.className} p-8`}>

            {/* Title */}
            <h4 className="text-2xl text-center text-blue-950 lg:text-3xl font-bold mb-5">
                Ticket Booking <span className="text-red-700">Process</span>
            </h4>

            {/* Steps */}
            <div className={`${roboto.className} flex items-center flex-row md:justify-center md:gap-24`}>
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center relative">
                        <div
                            className="bg-gray-100 shadow-inner p-4 rounded-full mb-4 w-14 h-14 md:w-24 md:h-24 flex items-center justify-center"
                            style={{
                                boxShadow: 'inset 0 4px 8px rgba(67, 56, 202, 0.4)'
                            }}
                        >
                            <Image
                                src={step.icon}
                                alt={step.description}
                                width={70}
                                height={70}
                                className="object-contain"
                            />
                        </div>
                        <p className="text-base font-medium text-gray-700">{step.title}</p>
                        <p className="text-base font-semibold text-gray-800">{step.description}</p>

                        {/* Dotted line between steps for medium+ screens */}
                        {index < steps.length - 1 && (
                            <div className="absolute right-[-18px] md:right-[-105px] top-7 md:top-12 w-8 md:w-28 h-px border-t border-dashed border-gray-400"></div>
                        )}
                    </div>
                ))}
            </div>

            
        </div>
    );
}