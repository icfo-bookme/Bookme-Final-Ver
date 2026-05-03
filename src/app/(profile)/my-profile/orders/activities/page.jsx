"use client";

import ActivitiesOrderComponent from "@/components/Profile/Orders/Activities/ActivitiesOrderComponent";
import Header from "@/components/Profile/Orders/Header";
import { useUser } from "@/context/UserContext";
import GlobalLoader from "@/utils/GlobalLoader";
import { useEffect, useState } from "react";

const Page = () => {
  const { user } = useUser();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user?.id) return; 

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/activity/orders/${user.id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (e) {
        console.error("An error occurred while fetching the data: ", e);
        setData([]); // fallback to empty
      }
    };

    fetchData();
  }, [user?.id]);

  // ✅ Loading
  if (data === null) {
    return (
      <div>
        <GlobalLoader />
      </div>
    );
  }

  // ✅ Empty State
  

  return (
    <div className="min-h-screen py-6 px-4">
       <Header
        title="Activity Bookings"
        subtitle="Manage your activity reservations and bookings"
      />
      <ActivitiesOrderComponent data={data} />
    </div>
  );
};

export default Page;