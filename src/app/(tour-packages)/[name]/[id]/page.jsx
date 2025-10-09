import PropertyDetails from "@/app/components/tourPackages/details/PropertyDetails";
import getPropertyDetails from "@/services/packages/getPropertyDetails";

export async function generateMetadata({ params }) {
  const { id } = params;

  const activity = await getPropertyDetails({ id });

  if (!activity) {
    return {
      title: "Activity | BookMe",
      description: "Explore exciting activities and experiences with BookMe."
    };
  }

  const duration = activity.summaries?.find(s => s.name === "Duration")?.value || "various lengths";
  const packagesList = activity.packages?.map(p => p.package_name).join(", ") || "various packages";
  const highlights = activity.facilities?.Highlights?.[0]?.value.replace(/<[^>]+>/g, '') || "";

  const description = `${activity.property_name} in ${activity.address} offers a memorable and exciting experience for all travelers. Enjoy thrilling adventures with durations ranging from ${duration}. Available packages include: ${packagesList}. Highlights include: ${highlights}. Book now with BookMe to enjoy safe, fun, and unforgettable experiences. Whether traveling solo, with friends, or family, this activity provides opportunities for sightseeing, relaxation, and adventure. Plan your perfect day with flexible booking options and create lasting memories in ${activity.address}.`;

  return {
    title: `${activity.property_name} | BookMe`,
    description
  };
}

export default async function Page({ params }) {
  const { id } = params;

  if (!id) {
    throw new Error("No ID provided");
  }

  const data = await getPropertyDetails({ id });

  const isEmpty =
    !data ||
    (Array.isArray(data) ? data.length === 0 : typeof data === "object" && Object.keys(data).length === 0);

  return (
    <div className="bg-blue-100 min-h-screen pt-10 md:pt-20 flex items-center justify-center">
      {isEmpty ? (
        <p className="text-center text-red-500 text-xl">No Data Found</p>
      ) : (
        <PropertyDetails data={data} />
      )}
    </div>
  );
}
