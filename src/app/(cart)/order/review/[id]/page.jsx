import BookingClient from '@/components/cart/BookingClient';
import getcartsession from '@/services/cart/getcartsession';

export default async function BookingReviewPage({ params }) {
  const id = await params.id;
  const BookingData = await getcartsession(id);
  return (
    <>
      <BookingClient bookingData={BookingData} />;
    </>
  )
}
