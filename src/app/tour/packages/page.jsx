import HeroSection from "@/components/tourPackages/tourpackages/HeroSection";
import HotelCTA from "@/components/hotel/Hotel/HotelCTA";
import TourPackageCard from "@/components/tourPackages/tourpackages/PackageCard";
import Pagination from "@/utils/Pagination";
import getProperty from "@/services/getProperty";

export default async function TourPackagesHome({ searchParams }) {
const page = searchParams?.page || 1;
  const data = await getProperty(5, page);
  const packages = data.data || [];
  const pagination = data.pagination;

  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="" id="list-start"></div>
      <main className="container mx-auto">
        <section className="mt-12">
          <h2 className="text-xl font-bold text-center mb-2 text-blue-950">
            Best Tour Packages for Your Next Trip
          </h2>

          <TourPackageCard packageData={packages} />

          {packages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No packages found. Please try a different search.
            </div>
          )}
        </section>
      <Pagination pagination={pagination} page={page} route="/tour/packages" />
        <HotelCTA />
         
      </main>
    </div>
  );
}