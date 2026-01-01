import BookingClient from '@/components/cart/BookingClient';
import getcartsession from '@/services/cart/getcartsession';

export const metadata = {
  title: "Booking Review - BookMe",
  description: "Review your booking details before finalizing your order on BookMe.",
};

export default async function BookingReviewPage({ params }) {
  const id = await params.id;
  const BookingData = await getcartsession(id);
  return (
    <>
      <BookingClient bookingData={BookingData} />;
    </>
  )
}
