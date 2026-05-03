"use client";

import GlobalLoader from "@/utils/GlobalLoader";
import { useEffect, useState } from "react";

import { useUser } from "@/context/UserContext";

import Header from "@/components/Profile/Orders/Header";
import VisaOrderComponent from "@/components/Profile/Orders/visa/VisaOrderComponent";

const Page = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    console.log(user);
    useEffect(() => {

        if (!user?.phone) {
            setLoading(false);
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getVisaApplicationsByNumber/${user.phone}`)
            .then((res) => res.json())
            .then((res) => {
                setData(res.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user?.phone]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <GlobalLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen  py-6 px-4 ">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className=" text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Header
                        title="Application Portal"
                        subtitle="Real-time tracking for your visa processing status."
                    />
                    <div className="text-sm font-semibold text-[#313881] bg-white shadow-lg border border-blue-100 px-5 py-2.5 rounded-full backdrop-blur-sm">
                        📋 {data.length} Applications Found
                    </div>
                </div>

              <VisaOrderComponent data={data} />
            </div>
        </div>
    );
};

export default Page;