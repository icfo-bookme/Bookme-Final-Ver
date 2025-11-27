"use client";
import HotelLoadingSkeleton from "@/components/hotel/Hotel/HotelLoadingSkeleton";
import Aside from "@/components/Profile/Aside";
import EditForm from "@/components/Profile/EditForm";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/customer-details/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);
  if (isLoading) {
    return (
      <div className="w-full">
        <HotelLoadingSkeleton />
      </div>
    );
  }
  
  return (
    <div className="flex pt-12 bg-gray-50 min-h-screen">

      <EditForm data={data} user={user} />
    </div>
  );
}
