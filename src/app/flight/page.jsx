import FlightRoute from "../components/Home/Flight/FlightRoute";

export const metadata = {
  title: "Flights | BookMe",
  description: "Find and book flights to top destinations around the world. Compare prices, view schedules, and choose the best options for your trip. Enjoy a seamless booking experience with BookMe and travel with ease.",
     alternates: {
    canonical: 'https://bookme.com.bd/flight',
  },
};

export default function Page() {
    return <div className="py-10">
        <section>
            <FlightRoute  homepage="false" />
        </section>
    </div>
}
