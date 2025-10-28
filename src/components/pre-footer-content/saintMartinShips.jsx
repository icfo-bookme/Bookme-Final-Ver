import Image from "next/image";
import Link from "next/link";

const saintMartinShipsCards = [
    {
        id: 1,
        title: "Luxury Ships to Saint Martin's Island",
        image: "/assets/saint-martin/1.jpg",
        description: (
            <>
                Your <strong>Saint Martin&apos;s Island adventure</strong> begins at <strong>Cox&apos;s Bazar or Teknaf</strong>, where you&apos;ll board comfortable ships for a scenic journey to Bangladesh&apos;s only coral island. This tropical paradise offers an unforgettable <strong>Bangladesh island experience</strong> perfect for beach lovers and nature enthusiasts. For those seeking the <strong>best ships to Saint Martin</strong>, popular options include the reliable{" "}
                <Link
                    href="/Property/MV-Karnafuly-Express/290"
                    className="text-blue-700 underline"
                >
                    MV Karnafuly Express
                </Link>{" "} || {" "}
                <Link
                    href="/Property/MV-Baro-Awlia-Ship/289"
                    className="text-blue-700 underline"
                >
                    MV Baro Awlia Ship
                </Link> {" "} || {" "}
                <Link
                    href="/Property/Keari-Sindbad/294"
                    className="text-blue-700 underline"
                >
                    Keari Sindbad
                </Link>{" "} || {" "}
                <Link
                    href="/Property/Atlantic-Cruise/296"
                    className="text-blue-700 underline"
                >
                    Atlantic Cruise
                </Link>,{" "} and {" "}
                <Link
                    href="/Property/Keari-Cruise-Dine/297"
                    className="text-blue-700 underline"
                >
                    Keari Cruise & Dine
                </Link>{" "} || {" "}
                <Link href="/Property/এমভি-পারিজাত-MV-Parijat/300" className="text-blue-700 underline">
                    MV Parijat
                </Link> providing comfortable and safe sea journeys. The <strong>Saint Martin ship booking</strong> experience includes various seating classes to suit your preferences and budget. Easy <Link href="/ships/Saint-Martin/3" className="text-blue-700 underline">
                    Saint Martin ship booking
                </Link> options make planning your island getaway simple. Complete <Link href="/ships/Saint-Martin/3" className="text-blue-700 underline">
                    Saint Martin tour packages
                </Link> include island exploration and accommodation options.Whether you are planning a <strong>luxury cruise to Saint Martin</strong> or a family-friendly island tour in Bangladesh, this journey promises relaxation, adventure, and unforgettable seaside memories.
            </>
        ),
    },
    {
        id: 2,
        title: "Island Exploration & Marine Adventures",
        image: "/assets/saint-martin/2.jpg",
        description: (
            <>
                Discover the breathtaking beauty of Saint Martin&apos;s Island with convenient <strong>ship tours from Cox&apos;s Bazar</strong>. Visit the stunning <strong>North Beach</strong> for pristine white sands and crystal-clear waters perfect for swimming and sunbathing. Your journey includes exploring the unique <strong>Chera Dwip</strong> during low tide, where you can walk to this temporary island and witness amazing marine life. Experience the vibrant local culture at the <strong>main market area</strong> and enjoy fresh seafood at beachside restaurants. Snorkel in the <strong>coral reefs</strong> to discover colorful fish and marine biodiversity, or take a glass-bottom boat tour to see underwater wonders without getting wet. Each experience showcases a different aspect of Saint Martin&apos;s incredible natural beauty. Affordable <strong>Saint Martin ship rental</strong> options range from economy class on larger vessels like{" "}
                <Link href="/Property/MV-BAY-ONE/291" className="text-blue-700 underline">
                    MV BAY ONE
                </Link> to premium services on{" "}
                <Link href="/Property/Bay-Cruiser-1/293" className="text-blue-700 underline">
                    Bay Cruiser 1
                </Link> and{" "}
                <Link href="/Property/MV-Farhan/295" className="text-blue-700 underline">
                    MV Farhan
                </Link>. Flexible <Link href="/refund-policy" className="text-blue-700 underline">
                    cancellation policies for Saint Martin ship bookings
                </Link> ensure peace of mind when planning your tropical escape.
            </>
        ),
    },
    {
        id: 3,
        title: "Comfortable Sea Journey & Island Stay",
        image: "/assets/saint-martin/3.jpg",
        description: (
            <>
                Experience the ultimate <strong>island getaway to Saint Martin</strong> with comfortable sea journeys on well-equipped ships designed for passenger comfort and safety. Your maritime adventure provides everything needed for a relaxing trip across the Bay of Bengal, with modern amenities and professional crew ensuring a pleasant experience. This exceptional <strong>Saint Martin sea voyage</strong> combines ocean travel with island exploration in Bangladesh&apos;s most popular marine destination. The comprehensive island experience covers all key attractions including the spectacular <strong>Sunset Point</strong> for breathtaking evening views, the rocky <strong>Western Beach</strong> with its unique geological formations, and the vibrant <strong>local fishing villages</strong> where you can witness traditional fishing methods. Perfect for <strong>beach vacations</strong> and marine adventures, the experience focuses on coral reef exploration, beach relaxation, and creating wonderful coastal memories. Book your comprehensive <Link href="/ships/Saint-Martin/3" className="text-blue-700 underline">
                    Saint Martin tour packages
                </Link> today for an unforgettable island adventure in the Bay of Bengal.
            </>
        ),
    },
];

export default function SaintMartinShips() {
    return (
        <section className="py-12 bg-gray-50">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
                Luxury Ships to Saint Martin&apos;s Island – Your Ultimate Tropical Island Adventure
            </h2>
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {saintMartinShipsCards.map(({ id, title, image, description }) => (
                        <article
                            key={id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                        >
                            <div className="relative w-full h-64">
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    quality={80}
                                    priority={id === 1}
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
                                <div className="text-gray-700 text-base leading-relaxed flex-grow">
                                    {description}
                                </div>
                                <Link href="/ships/Saint-Martin/3" className="inline-block mt-6 text-blue-700 font-semibold underline">
                                    View All Saint Martin Tour Packages
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}