"use client";
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
console.log(data);
  if (isLoading) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center ">
      <p className="text-xl font-semibold text-blue-700 animate-pulse">
        Loading your profile...
      </p>
    </div>
  );
}


  return (
    <div className="flex pt-12 bg-gray-50 min-h-screen">
      <Aside />
      <EditForm data={data} user={user} />
    </div>
  );
}
