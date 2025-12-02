"use client";
import HotelLoadingSkeleton from "@/components/hotel/Hotel/HotelLoadingSkeleton";
import HotelOrderComponent from "@/components/Profile/Orders/Hotel/HotelOrderComponent"
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";

export default function HotelOrdersPage() {

  const { user } = useUser();
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hotel/orders/${user.id}`)
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
  console.log(data);
  return (
    <div className="  bg-gray-50 min-h-screen">
      
      <div className="">
        <HotelOrderComponent data={data} />
      </div>

    </div>
  )
}