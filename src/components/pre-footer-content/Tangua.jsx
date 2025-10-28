import Image from "next/image";
import Link from "next/link";

const houseboatCards = [
  {
    id: 1,
    title: "Luxury Houseboats in Tanguar Haor",
    image: "/assets/tangua/4.jpg",
    description: (
      <>
        Your <strong>Tanguar Haor journey</strong> begins at <strong>Sunamganj Boat Ghat</strong>, where you&apos;ll board a private luxury houseboat and glide into the calm, beautiful waters of Tanguar Haor. This UNESCO Ramsar site offers an unforgettable <strong>Bangladesh houseboat experience</strong> perfect for nature lovers and adventure seekers. For those seeking the <strong>best houseboats in Tanguar Haor</strong>, premium options like the{" "}
        <Link href="http://bojraboat.com/" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
          Bojra Houseboat
        </Link>{" "},

        <Link href="/Property/ফ্যালকন-Falcon-The-Iconic-houseboat/206" className="text-blue-700 underline">
          Falcon Houseboat
        </Link>, and{" "}
        <Link href="/Property/হাওরের-সুলতান-০২-Haorer-Sultan-2-A-Luxurious-Water-Cruise-at-TanguaAC/199" className="text-blue-700 underline">
          Sultan Houseboat
        </Link> provide exceptional comfort and service. The <strong>Tanguar Haor houseboat rental</strong> experience includes all meals—enjoy delicious local Bangladeshi cuisine with breakfast, lunch, and dinner freshly prepared and served onboard. Easy <Link href="https://traveltangua.com/" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
          houseboat booking Tanguar Haor
        </Link> options make planning your trip simple. Complete <Link href="/tour-packages" className="text-blue-700 underline">
          Tanguar Haor tour packages
        </Link> include guided tours, ensuring you don&apos;t miss any of the haor&apos;s natural wonders.
      </>
    ),
  },
  {
    id: 2,
    title: "Explore Scenic Spots & Overnight Stay",
    image: "/assets/tangua/5.jpg",
    description: (
      <>
        Discover the most beautiful spots in Tanguar Haor with convenient <strong>houseboat tours Sunamganj</strong>. Climb the <strong>Watch Tower</strong> for breathtaking panoramic views of the entire haor landscape. Your overnight stay at <strong>Tekherghat</strong> offers perfect tranquility on the water. Nearby, visit the famous <strong>Niladri Lake</strong> with its stunning blue waters and even catch a view of the Indian border from this unique location. Explore the vibrant <strong>Shimul Bagan</strong> with its magnificent red silk cotton trees, cruise along the pristine <strong>Jadukata River</strong> with its clean flowing waters, and visit the peaceful green hills of <strong>Barikka Tila</strong>. Each destination showcases a different aspect of Tanguar Haor&apos;s incredible natural beauty. Affordable <strong>Tanguar Haor houseboat rental</strong> options range from budget-friendly <Link href="/boats/nouka" className="text-blue-700 underline">
          nouka boats
        </Link> for day trips to luxury vessels like the{" "}
        <Link href="/Property/ফ্যালকন-Falcon-The-Iconic-houseboat/206" className="text-blue-700 underline">
          Falcon Houseboat
        </Link> and{" "}
        <Link href="/Property/হাওরের-সুলতান-০২-Haorer-Sultan-2-A-Luxurious-Water-Cruise-at-TanguaAC/199t" className="text-blue-700 underline">
          Sultan Houseboat
        </Link>. Flexible <Link href="/refund-policy" className="text-blue-700 underline">
          cancelation policies for Tanguar Haor houseboat rentals
        </Link> ensure peace of mind when booking your adventure.
      </>
    ),
  },
  {
    id: 3,
    title: "Comfortable Stay & Memorable Experience",
    image: "/assets/tangua/2.jpg",
    description: (
      <>
        Experience the ultimate <strong>private houseboat Tanguar Haor</strong> stay with comfortable overnight accommodation on spacious, well-equipped boats. Your floating home provides everything needed for a safe and peaceful retreat in nature, docked at serene locations like Tekherghat. This <strong>Tanguar Haor floating hotel</strong> experience combines adventure with relaxation in Bangladesh&apos;s largest freshwater wetland. The journey covers all key attractions including <strong>Sunamganj Boat Ghat</strong>, <strong>Watch Tower</strong>, <strong>Tekherghat</strong>, <strong>Niladri Lake</strong>, <strong>Shimul Bagan</strong>, <strong>Jadukata River</strong>, and <strong>Barikka Tila</strong>. Perfect for <strong>Tanguar Haor wildlife tours</strong> and birdwatching, the experience focuses on pure nature, peace, and creating wonderful memories. It&apos;s the ideal escape from everyday city noise, offering authentic <strong>Bangladesh houseboat experience</strong> with <strong>eco-friendly houseboats in Sunamganj</strong>. As your journey concludes, the boat returns you to Sunamganj, leaving you with beautiful, calm memories of one of Bangladesh&apos;s most spectacular natural wonders. Book your <Link href="https://traveltangua.com/" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
          Tanguar Haor tour packages
        </Link> today for an unforgettable floating adventure.
      </>
    ),
  },
];

export default function TanguarHaorHouseboats() {
  return (
    <section className="py-12 bg-gray-50">
      <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
        Luxury Houseboats in Tanguar Haor – Your Ultimate Floating Experience
      </h2>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {houseboatCards.map(({ id, title, image, description }) => (
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
                <Link href="/ships/Tanguar-Haor/1" className="inline-block mt-6 text-blue-700 font-semibold underline">
                  View All Tanguar Haor Tour Packages
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}