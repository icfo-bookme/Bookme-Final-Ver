'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/UserContext';
import LoadingSpinner from '@/utils/LoadingSpinner';
import BookingHeader from '@/app/booking-review/BookingHeader';
import BookingForm from './BookingForm';
import BookingSummary from './BookingSummary'; // Import the new component

export default function BookingClient({ bookingData }) {
    const [guestInfo, setGuestInfo] = useState({
        name: '',
        phone: '',
        email: '',
        specialRequests: '',
    });

    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setGuestInfo(prev => ({
                ...prev,
                name: user.name || prev.name,
                phone: user.phone || prev.phone,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    const handleGuestInfoChange = (updatedInfo) => {
        setGuestInfo(updatedInfo);
    };

    if (!bookingData) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen w-[90%] bg-gray-50 py-16 mx-auto">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <BookingHeader user={user} />

                    <div className="grid md:grid-cols-2 gap-8 p-6">
                        <BookingForm
                            guestInfo={guestInfo}
                            user={user}
                            onGuestInfoChange={handleGuestInfoChange}
                            bookingData={bookingData}
                        />

                        <div>
                            <BookingSummary bookingData={bookingData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}