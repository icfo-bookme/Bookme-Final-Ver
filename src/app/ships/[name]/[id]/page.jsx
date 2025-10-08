import { Roboto } from "next/font/google";
import PropertyList from "@/app/components/tour/Property/Property";
import propertySummary from "@/services/tour/propertySummary";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export async function generateMetadata({ params }) {
  const { name } = params; 

  const title = `${name} Ships | BookMe`;

  const description = `Explore exciting ship tours to ${name} with BookMe. Choose from a variety of cruise options, sightseeing trips, and water adventures. Whether you're planning a family outing, a romantic getaway, or a solo journey, our flexible and personalized ship tours ensure a memorable experience. Book your ${name} ship tour now and enjoy a hassle-free and unforgettable voyage.`;

  const keywords = [
    `${name} ship tours`,
    `${name} cruise booking`,
    `book ${name} ship tickets`,
    `ferry to ${name}`,
    `luxury cruises in ${name}`,
    `family cruises to ${name}`,
    `adventure cruises in ${name}`,
    `houseboats in ${name}`,
  ];

  return {
    title,
    description,
    keywords,
  };
}



export default async  function Home({ params }) {
  const result = await propertySummary(params.id);
  return (
    <main className={`${roboto.className}`}>
      <div className=" mb-12">
        <div className=" ">
          <div className=" overflow-hidden">
            <PropertyList initialData={result} id={params.id} />
          </div>
        </div>
      </div>
    </main>
  );
}