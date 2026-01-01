
import getVisaDetails from "@/services/visa/getVisaDeatails";
import getContactNumber from "@/services/tour/getContactNumber";
import VisaDetails from "@/components/visa/VisaDetailsContent";
import slugify from "@/utils/slugify";

export async function generateMetadata({ params }) {
  const { name, id } = await params; 
  const nameSlugify = slugify(name);
  

  const title = `${name} Visa | BookMe`;

  const description = `Get complete information about ${name} visa with BookMe. Explore visa types, requirements, processing times, fees, and travel guidance. Whether you're planning a short trip, a family visit, or a long stay, BookMe provides up-to-date and accurate visa information to make your journey smooth and hassle-free. Apply for your ${name} visa now and travel with confidence.`;

  const keywords = [
    `${name} visa application`,
    `apply for ${name} visa`,
    `${name} tourist visa`,
    `${name} visa requirements`,
    `${name} travel visa`,
    `${name} visa process`,
    `how to get a ${name} visa`,
    `${name} visa fees`,
    `${name} embassy visa info`,
    `${name} visa from Bangladesh`, 
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://bookme.com.bd/visa/${nameSlugify}/${id}`,
    },
  };
}

export default async function VisaDetailsSSR({ params }) {
  const { id } = params;

  let visaDetails = null;
  let contactNumber = null;

  try {
    const [details, contact] = await Promise.all([
      getVisaDetails(id),
      getContactNumber(),
    ]);

    visaDetails = details;
    contactNumber = contact;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return <VisaDetails visaDetails={visaDetails} contactNumber={contactNumber} />;
}
