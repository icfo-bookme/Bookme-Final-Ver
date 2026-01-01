import Faq from "../../components/Faq/Faq";

export const metadata = {
  title: "FAQ - BookMe",
  description: "Find answers to frequently asked questions about BookMe's services, bookings, payments, cancellations, and more.",
  alternates: {
    canonical: "https://bookme.com.bd/faq",
  },
};

export default function Page() {
  return (
    <div className="py-10">
        <Faq />
    </div>
  )
}