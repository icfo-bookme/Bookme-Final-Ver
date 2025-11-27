"use client";

import { useState } from "react";
import Header from "./Header";
import Tabs from "./Tab";
import OrderCard from "./OrderCard";
import EmptyState from "./EmptyState";

import {
    formatDate,
    formatDateTime,
    formatBDTCurrency,
} from "./formatters";

import {
    getStatusBadge,
    getPaymentBadge,
} from "./badges";

const HotelOrderComponent = ({ data }) => {
    const [activeTab, setActiveTab] = useState("upcoming");

    const ordersData = data || {
        upcoming: [],
        completed: [],
        cancelled: [],
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 ">

                {/* Header */}
                <Header
                    title="Hotel Bookings"
                    subtitle="Manage your hotel reservations and bookings"
                />

                {/* Tabs */}
                <Tabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    ordersData={ordersData}
                />

                {/* Content */}
                <div className="space-y-6">
                    {ordersData[activeTab]?.length > 0 ? (
                        ordersData[activeTab].map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                formatDate={formatDate}
                                formatDateTime={formatDateTime}
                                formatBDTCurrency={formatBDTCurrency}
                                getStatusBadge={getStatusBadge}
                                getPaymentBadge={getPaymentBadge}
                            />
                        ))
                    ) : (
                        <div className="mx-auto">
                            <EmptyState activeTab={activeTab} />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default HotelOrderComponent;
