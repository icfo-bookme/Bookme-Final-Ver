
import HotelHashRoute from "@/components/hotel/hotelHashRote";
import HotelDetailsTracker from "@/components/Tracking/HotelDetailsTracker";
import getHotelDetails from "@/services/hotel/gethoteldetails";
import getRooms from "@/services/room/getroom";


export async function generateMetadata({ params }) {
  try {
    const hotelDetails = await getHotelDetails(params.id);
    const hotelName = hotelDetails?.name || "Hotel";
    const location = hotelDetails?.city || ""; 

    const title = `${hotelName} | BookMe`;

    const description = hotelDetails?.description
      ? hotelDetails.description.slice(0, 600)
      : `Discover ${hotelName}, a top-rated hotel with excellent amenities, luxurious rooms, and outstanding services. Book now to enjoy a memorable stay.`;

    const keywords = [
      hotelName,
      `${hotelName} reviews`,
      `${hotelName} rates`,
      `${hotelName} booking`,
      `stay at ${hotelName}`,
      `${hotelName} amenities`,
      `${hotelName} contact info`,
      `${hotelName} in ${location}`,
      `room availability at ${hotelName}`,
      `book ${hotelName} online`,
    ].filter(Boolean);

    return {
      title,
      description,
      keywords,
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Hotel | BookMe",
      description:
        "Find the best hotels with affordable prices and exclusive deals. Book your stay easily with BookMe.",
      keywords: [
        "book hotel online",
        "hotel details",
        "hotel availability",
        "hotel booking platform",
      ],
    };
  }
}

export default async function HotelDetailsPage({ params, searchParams }) {

  const hotelDetails = await getHotelDetails(params.id);
  const  allRooms = await getRooms(params.id);
  const { checkin, checkout, rooms, adult } = searchParams;

  return (
    <div className=" pt-16 min-h-screen bg-gray-200">
      <HotelDetailsTracker hotel={hotelDetails} rooms={allRooms} />
      <div className=" ">
        <HotelHashRoute hotelId={params.id} initialHotelDetails={hotelDetails} checkin={checkin}
          checkout={checkout} />
      </div>

    </div>
  );
}