'use client';

import HotelLoadingSkeleton from "@/components/hotel/Hotel/HotelLoadingSkeleton";
import EditForm from "@/components/Profile/EditForm";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setLoading(true);
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/customer-details/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="w-full">
        <HotelLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <EditForm data={data} user={user} />
    </div>
  );
}
