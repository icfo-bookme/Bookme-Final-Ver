import { Roboto } from "next/font/google";
import PropertyList from "@/components/tour/Property/Property";
import propertySummary from "@/services/tour/propertySummary";
import TanguarHaorHouseboatListing from "@/components/pre-footer-content/Tangua";
import SundarbanCruiseShips from "@/components/pre-footer-content/sundarbanShips";
import SaintMartinShips from "@/components/pre-footer-content/saintMartinShips";
import slugify from "@/utils/slugify";
import getContactNumber from "@/services/tour/getContactNumber";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export async function generateMetadata({ params }) {
  const { name, id } = await params;
  const nameSlugify = slugify(name);

  const title = `${name} Ship Tours & Cruises | BookMe`;

  const description = `Discover amazing ship tours and cruises in ${name} with BookMe. Whether you're traveling solo, with family, or as a couple, explore various cruise options, sightseeing trips, and water adventures. Enjoy comfortable, hassle-free bookings and create unforgettable memories on your journey. Choose the best tours to match your preferences and budget. Book your ${name} ship tour today for an exciting and seamless travel experience.`;

  const keywords = [
    `${name} ship tours`,
    `${name} cruise booking`,
    `book ${name} ship tickets`,
    `ferry to ${name}`,
    `luxury cruises in ${name}`,
    `family cruises to ${name}`,
    `adventure cruises in ${name}`,
    `houseboats in ${name}`,
    `couple cruises in ${name}`,
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://bookme.com.bd/ships/${nameSlugify}/${id}`,
    },
  };
}

export default async function Home({ params }) {
  const { id } = await params;
  const result = await propertySummary(id);
  const contact = await getContactNumber();
  
  return (
    <main className={`${roboto.className}`}>
      <div className=" mb-12">
        <div className=" ">
          <div className=" overflow-hidden">
            <PropertyList initialData={result} id={id} contact = {contact} />
          </div>
        </div>
      </div>
      {
        id==1 && <TanguarHaorHouseboatListing />
      }
      {
        id==2 && <SundarbanCruiseShips />
      }
       {
        id==3 && <SaintMartinShips />
      }
    
    </main>
  );
}