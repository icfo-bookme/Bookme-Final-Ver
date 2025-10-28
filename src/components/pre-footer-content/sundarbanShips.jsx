import Image from "next/image";
import Link from "next/link";

const sundarbanShipsCards = [
    {
        id: 1,
        title: "Luxury Cruise Ships in Sundarbans",
        image: "/assets/sundarban/1.jpg",
        description: (
            <>
                Your <strong>Sundarbans adventure</strong> begins at <strong>Khulna or Mongla Port</strong>, where you&apos;ll board a luxury cruise ship and sail into the world&apos;s largest mangrove forest. This UNESCO World Heritage Site offers an unforgettable <strong>Bangladesh cruise experience</strong> perfect for wildlife enthusiasts and nature lovers. For those seeking the <strong>best cruise ships in Sundarbans</strong>, premium options like the{" "}
                <Link
                    href="https://mvthecrown.com/"
                    className="text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    MV The Crown
                </Link>{" "} || {" "}
                 <Link
                    href="https://mvwave.com/"
                    className="text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    MV The Wave
                </Link> {" "} || {" "}
                <Link
                    href="https://mvrezab.com/"
                    className="text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    MV The Rezab
                </Link>{" "} || {" "}
                <Link
                    href="https://mvaralsea.com/"
                    className="text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    MV Aral Sea
                </Link>,{" "} and {" "}
                 <Link
                    href="http://mvexplorercruise.com/"
                    className="text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    MV Explorer
                </Link>{" "} || {" "}
                <Link href="/Property/MV-Bano-sampan/501" className="text-blue-700 underline">
                    M.V. Bano sampan
                </Link> provide exceptional comfort and service. The <strong>Sundarbans cruise ship rental</strong> experience includes all meals—enjoy delicious local Bangladeshi cuisine with breakfast, lunch, and dinner freshly prepared and served onboard. Easy <Link href="http://sundarbanships.com/" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                    Sundarbans cruise booking
                </Link> options make planning your trip simple. Complete <Link href="/ships/Sundarban/2" className="text-blue-700 underline">
                    Sundarbans tour packages
                </Link> 
            </>
        ),
    },
    {
        id: 2,
        title: "Explore Wildlife & Scenic Locations",
        image: "/assets/sundarban/2.jpg",
        description: (
            <>
                Discover the most spectacular wildlife spots in Sundarbans with convenient <strong>cruise tours Khulna</strong>. Visit <strong>Katka Wildlife Sanctuary</strong> for breathtaking views and potential Royal Bengal Tiger sightings. Your journey includes stops at <strong>Hiron Point</strong> for birdwatching and <strong>Dublar Char Island</strong> for experiencing local fishing culture. Explore the mysterious creeks of <strong>Kochikhali</strong>, known for tiger movements, and witness the diverse ecosystem at <strong>Karamjal Wildlife Center</strong>. Cruise through the narrow channels of <strong>Supati Khal</strong> and visit the beautiful <strong>Jamtola Beach</strong>. Each destination showcases a different aspect of Sundarbans&apos; incredible biodiversity. Affordable <strong>Sundarbans cruise rental</strong> options range from budget-friendly <Link href="/ships/standard" className="text-blue-700 underline">
                    standard ships
                </Link> for day trips to luxury vessels like the{" "}
                <Link href="https://mvtheglory.com/" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                    MV Glory
                </Link> and{" "}
                <Link href="https://symphonywave.com" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                    Symphony Of The Wave
                </Link>. Flexible <Link href="/refund-policy" className="text-blue-700 underline">
                    cancelation policies for Sundarbans cruise rentals
                </Link> ensure peace of mind when booking your adventure.
            </>
        ),
    },
    {
        id: 3,
        title: "Comfortable Wildlife Experience",
        image: "/assets/sundarban/3.jpg",
        description: (
            <>
                Experience the ultimate <strong>private cruise Sundarbans</strong> stay with comfortable overnight accommodation on spacious, well-equipped ships. Your floating hotel provides everything needed for a safe and immersive wildlife retreat, anchored at strategic locations for optimal animal sightings. This <strong>Sundarbans floating resort</strong> experience combines adventure with relaxation in the world&apos;s largest mangrove ecosystem. The journey covers all key attractions including <strong>Katka Beach</strong>, <strong>Harbaria Eco Park</strong>, <strong>Kochikhali Forest Station</strong>, <strong>Mandarbaria Beach</strong>, and <strong>Dimer Char Island</strong>. Perfect for <strong>Sundarbans wildlife tours</strong> and birdwatching, the experience focuses on Royal Bengal Tiger tracking, dolphin spotting, and creating wonderful memories. It&apos;s the ideal escape from everyday city life, offering authentic <strong>Bangladesh cruise experience</strong> with <strong>eco-friendly cruise ships in Sundarbans</strong>. <Link href="/ships/Sundarban/2" className="text-blue-700 underline">
                    Sundarbans tour packages
                </Link> today for an unforgettable mangrove adventure.
            </>
        ),
    },
];

export default function SundarbanCruiseShips() {
    return (
        <section className="py-12 bg-gray-50">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
                Luxury Cruise Ships in Sundarbans – Your Ultimate Mangrove Forest Adventure
            </h2>
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {sundarbanShipsCards.map(({ id, title, image, description }) => (
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
                                <Link href="/ships/Sundarban/2" className="inline-block mt-6 text-blue-700 font-semibold underline">
                                    View All Sundarbans Tour Packages
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}