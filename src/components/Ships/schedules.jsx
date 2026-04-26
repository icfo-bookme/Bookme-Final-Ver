'use client';

import { useEffect, useState } from 'react';
import { Roboto } from 'next/font/google';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';



const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] });

export default function Schedules({ schedules, contactNumber, property_name }) {
    
    const [activeMonth, setActiveMonth] = useState('');
    useEffect(() => {
        if (schedules && Object.keys(schedules).length > 0) {
            setActiveMonth(Object.keys(schedules)[0]);
        }
    }, [schedules]);

    if (!schedules || Object.keys(schedules).length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Schedules</h2>
                <p className="text-gray-500">No upcoming schedules available.</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.substring(0, 5).split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHours = h % 12 || 12;
        return `${formattedHours}:${minutes} ${ampm}`;
    };

    const calculateDuration = (departDate, departTime, returnDate, returnTime) => {
        const depart = new Date(`${departDate}T${departTime}`);
        const returnDt = new Date(`${returnDate}T${returnTime}`);
        const diffMs = returnDt - depart;

        if (diffMs < 0) return 'Invalid schedule';

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    return (
        <div>
            {/* Header */}
            <div className="px-4 sm:px-6 py-8 border-b border-gray-200 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-950">
                    Upcoming Schedule Of <span className="text-red-600">{property_name}</span>
                </h2>
                <h3 className="text-lg sm:text-2xl mt-2 font-semibold text-gray-700">Khulna - Sundarbans - Khulna</h3>
                <p className="text-sm sm:text-base font-semibold text-red-700 mt-1">“Schedule may change with tidal state’’</p>
            </div>

            {/* Schedule Section */}
            <div style={{
                boxShadow: 'inset 0 4px 8px rgba(67, 56, 202, 0.4)'
            }} className={`bg-gray-100 ${roboto.className} rounded-lg shadow-md max-w-5xl mx-auto my-6 w-full`}>
                {/* Month Tabs */}
                <div className="border-b border-gray-200 overflow-x-auto">
                    <nav className="flex items-center justify-start sm:justify-center px-2 gap-3">
                        {Object.keys(schedules).map((month) => (
                            <button
                                key={month}
                                className={`py-3 px-4 text-sm whitespace-nowrap border-b-2 transition-colors ${activeMonth === month
                                    ? 'border-blue-500 text-blue-950 font-bold'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                onClick={() => setActiveMonth(month)}
                            >
                                {month}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Schedule Table */}
                <div className="p-4  sm:p-6 w-full">
                    {Object.entries(schedules).map(([month, monthSchedules]) => (
                        <div key={month} className={`${activeMonth === month ? 'block' : 'hidden'}`}>
                            <table className="w-full table-auto divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        {['Trip ','Departure', 'Time', 'Return', 'Time'].map((heading, index) => (
                                            <th
                                                key={`${heading}-${index}`}
                                                className="px-2 py-3 text-sm sm:text-base text-white bg-gradient-to-r from-[#2E3B83] to-[#37789e] uppercase text-center"
                                            >
                                                {heading}
                                            </th>
                                        ))}

                                    </tr>
                                </thead>
                                <tbody>
                                    {monthSchedules.map((schedule, index) => (
                                        <tr key={schedule.id} className="hover:bg-gray-50 border border-gray-300 text-center text-sm text-black">
                                            <td className="px-2 py-3 text-blue-950 font-bold text-base">Trip -{index+1}</td>
                                            <td className="px-2 py-3">{formatDate(schedule.depart_date)}</td>
                                            <td className="px-2 py-3">{formatTime(schedule.depart_time)}</td>
                                            <td className="px-2 py-3">{formatDate(schedule.return_date)}</td>
                                            <td className="px-2 py-3">{formatTime(schedule.return_time)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-row items-center justify-center gap-4 mt-6 mb-10 ">
                <a href={`tel:${contactNumber}`}
                    style={{
                        background: 'linear-gradient(90deg, #313881, #0678B4)',
                    }}
                    
                    className="flex items-center text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                    <FaPhoneAlt className="mr-2" />
                    Call Now
                </a>
                <a href={`https://wa.me/${contactNumber}`}
                    style={{
                        background: 'linear-gradient(90deg, #313881, #0678B4)',
                    }}
                    
                    className="flex items-center text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                    <FaWhatsapp className="mr-2" />
                    WhatsApp
                </a>
            </div>
        </div>
    );
}
