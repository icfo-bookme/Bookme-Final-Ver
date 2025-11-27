"use client";

const Tabs = ({ activeTab, setActiveTab, ordersData }) => {
  const tabs = [
    { key: "upcoming", name: "Upcoming", count: ordersData.upcoming?.length || 0 },
    { key: "completed", name: "Completed", count: ordersData.completed?.length || 0 },
    { key: "cancelled", name: "Cancelled", count: ordersData.cancelled?.length || 0 }
  ];

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-950"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span
                  className={`ml-2 py-0.5 px-2 text-xs rounded-full ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-950"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;
