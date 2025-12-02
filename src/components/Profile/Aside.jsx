"use client";
import Link from "next/link";
import { useState } from "react";

const Aside = () => {
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    { name: "Personal Info", active: false, icon: "👤", link: "/my-profile" },
    { 
      name: "My Orders", 
      active: false, 
      icon: "🛒", 
      link: null,
      subItems: [
        { name: "Hotel Bookings", link: "/my-profile/orders/hotel" },
        // { name: "Travel Packages", link: "/my-profile/orders/packages" }
      ]
    },
    { name: "Refer & Earn", active: false, icon: "🎁", link: "/my-profile/refer" },
    // { name: "Change Password", active: false, icon: "🔐", link: "/my-profile/change-password" },
  ];

  const toggleSubMenu = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  return (
    <aside className="w-64  bg-white border-r border-gray-200 shadow-sm hidden md:block sticky top-14 h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.link ? (
              // Regular menu item with link
              <Link href={item.link}>
                <button
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3 text-left group ${
                    item.active
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                  }`}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              </Link>
            ) : (
              // Expandable menu item
              <div>
                <button
                  onClick={() => toggleSubMenu(item.name)}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between text-left group ${
                    expandedMenu === item.name
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className={`transform transition-transform duration-200 text-gray-400 ${
                    expandedMenu === item.name ? "rotate-180" : ""
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {/* Submenu items */}
                {expandedMenu === item.name && item.subItems && (
                  <div className="ml-4 mt-2 flex flex-col gap-1 border-l border-gray-200 pl-4">
                    {item.subItems.map((subItem) => (
                      <Link href={subItem.link} key={subItem.name}>
                        <button
                          className="w-full px-4 py-2.5 rounded-lg font-mediu  flex items-center gap-3 text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-sm group"
                        >
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-blue-500 transition-colors "></span>
                          <span className="font-normal">{subItem.name}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500">Need help?</p>
          <Link href="/support">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1">
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Aside;