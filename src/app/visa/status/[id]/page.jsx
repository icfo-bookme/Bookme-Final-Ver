"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import GlobalLoader from "@/utils/GlobalLoader";

const VisaTimelinePro = () => {
  const params = useParams();
  const id = params.id;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/visa-applications/${id}`)
      .then((res) => setData(res.data.data))
      .catch(console.error);
  }, [id]);

  if (!data) {
    return (
      <div className="p-10 text-center text-gray-500">
        <GlobalLoader />
      </div>
    );
  }

  // Define all possible steps
  const allSteps = [
    "Intake",
    "Documents Verified",
    "Applied",
    "Embassy Processing",
    "Under Review",
    "Approved/Rejected",
    "Visa Issued",
  ];

  const getStepsOrder = () => {
    if (data.current_status === "Approved") {
      return allSteps; // Show all steps including Visa Issued
    } else if (data.current_status === "Rejected") {
      return allSteps.filter(step => step !== "Visa Issued"); 
    } else {
      return allSteps.filter(step => step !== "Visa Issued"); 
    }
  };

  const stepsOrder = getStepsOrder();
  const logs = data.status_logs;

  const getLog = (step) => {
    // For Approved/Rejected step, check both statuses
    if (step === "Approved/Rejected") {
      return logs.find((l) => l.status === "Approved" || l.status === "Rejected");
    }
    return logs.find((l) => l.status === step);
  };

  const currentIndex = stepsOrder.findIndex((s) => {
    if (s === "Approved/Rejected") {
      return data.current_status === "Approved" || data.current_status === "Rejected";
    }
    return s === data.current_status;
  });

  const statusStyles = {
    completed: "bg-green-500 text-white",
    active: "bg-blue-600 text-white ring-4 ring-blue-100",
    pending: "bg-gray-200 text-gray-400",
    rejected: "bg-red-500 text-white",
    approved: "bg-green-500 text-white",
  };

  // Determine display text for the decision step
  const getDecisionStepDisplay = () => {
    if (data.current_status === "Approved") return "Approved";
    if (data.current_status === "Rejected") return "Rejected";
    return "Approved/Rejected";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-12">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {data.applicant_name}
            </h2>
            <p className="text-sm text-gray-500">
              Application ID: {data.application_id}
            </p>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>Passport: {data.passport_number}</p>
            <p>Embassy: {data.embassy_name}</p>
            <p>Visa: {data.visa_name}</p>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-5 top-0 w-0.5 h-full bg-gray-200"></div>

        {stepsOrder.map((step, index) => {
          const log = getLog(step);
          const isActive = step === "Approved/Rejected"
            ? (data.current_status === "Approved" || data.current_status === "Rejected")
            : step === data.current_status;

          const isCompleted = index < currentIndex;

          let style = statusStyles.pending;
          let displayStepName = step;
          let bgColor = "bg-white border-gray-200";

          // Handle Approved/Rejected step styling
          if (step === "Approved/Rejected") {
            displayStepName = getDecisionStepDisplay();

            if (isCompleted) {
              style = statusStyles.completed;
              bgColor = "bg-green-50 border-green-300";
            } else if (isActive) {
              if (data.current_status === "Approved") {
                style = statusStyles.approved;
                bgColor = "bg-green-50 border-green-300";
              } else if (data.current_status === "Rejected") {
                style = statusStyles.rejected;
                bgColor = "bg-red-50 border-red-300";
              }
            }
          } else {
            if (isCompleted) {
              style = statusStyles.completed;
              bgColor = "bg-white border-gray-200";
            } else if (isActive) {
              style = statusStyles.active;
              bgColor = "bg-blue-50 border-blue-300 shadow-sm";
            }
          }

          return (
            <div key={index} className="relative flex items-start mb-10">
              {/* ICON */}
              <div
                className={`z-10 w-10 h-10 flex items-center justify-center rounded-full font-bold ${style}`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>

              {/* CONTENT */}
              <div className="ml-6 flex-1">
                <div className={`p-5 rounded-xl border transition ${bgColor}`}>
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-800">
                      {displayStepName}
                    </h4>

                    {log && (
                      <span className="text-xs text-gray-400">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    {log ? log.message : "Waiting for this step..."}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FINAL STATUS CARD */}
      <div className="mt-10">
        {data.current_status === "Approved" && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-5 rounded-xl text-center font-medium">
            ✅ Your visa has been approved successfully.
          </div>
        )}

        {data.current_status === "Rejected" && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl text-center font-medium">
            ❌ Your visa application was rejected.
          </div>
        )}

        {data.current_status === "Visa Issued" && (
          <div className="bg-green-100 border border-green-300 text-green-800 p-5 rounded-xl text-center font-semibold">
            🎉 Visa Issued — Ready for travel!
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaTimelinePro;