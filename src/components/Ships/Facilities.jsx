"use client";
import { useEffect, useState, useRef } from "react";
import * as IoIcons from "react-icons/io5";
import * as FaIcons from "react-icons/fa";
import * as PiIcons from "react-icons/pi";
import * as GoIcons from "react-icons/go";
import * as TbIcons from "react-icons/tb";
import ContactForm from "../tour/ContactForm/ContactForm";
import { ToastContainer } from "react-toastify";

const getIconComponent = (iconName) => {
    if (!iconName) return null;
    const prefix = iconName.substring(0, 2).toLowerCase();

    const pkg =
        prefix === "fa" ? FaIcons :
            prefix === "io" ? IoIcons :
                prefix === "pi" ? PiIcons :
                    prefix === "go" ? GoIcons :
                        prefix === "tb" ? TbIcons : null;

    return pkg?.[iconName] || null;
};

export default function FacilitiesNew({ data }) {
    const [activeCategory, setActiveCategory] = useState(null);
    const sectionRefs = useRef({});
    const navRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(false);

    // Detect mobile
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Scroll Spy
    useEffect(() => {
        const handleScroll = () => {
            let current = null;

            Object.entries(sectionRefs.current).forEach(([id, el]) => {
                if (!el) return;
                const rect = el.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) current = id;
            });

            if (current && current !== activeCategory) {
                setActiveCategory(current);
                window.history.replaceState(null, null, `#${current}`);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [activeCategory]);

    // Horizontal scroll arrow buttons
    useEffect(() => {
        const check = () => {
            if (!navRef.current) return;
            const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
            setShowPrev(scrollLeft > 0);
            setShowNext(scrollLeft < scrollWidth - clientWidth);
        };

        check();
        navRef.current?.addEventListener("scroll", check);
        return () => navRef.current?.removeEventListener("scroll", check);
    }, [data, isMobile]);

    if (!data?.facilities) return <p>No facilities found</p>;

    const categories = data.facilities.map((item) => item.facility_type);

    const scrollNav = (dir) => {
        navRef.current?.scrollBy({
            left: dir === "next" ? 150 : -150,
            behavior: "smooth",
        });
    };

    const handleCategoryClick = (category) => {
        document.getElementById(category)?.scrollIntoView({ behavior: "smooth" });
        setActiveCategory(category);
    };

    return (
        <div className="py-5">
            {/* Sticky nav */}
            <div className="sticky top-14 bg-white z-10 py-3 border-b border-gray-200 mb-8">
                <div className="relative px-2">
                    {isMobile && showPrev && (
                        <button
                            onClick={() => scrollNav("prev")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
                        >
                            ◀
                        </button>
                    )}

                    <div ref={navRef} className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-4 py-2 whitespace-nowrap rounded-md ${activeCategory === cat
                                    ? "bg-blue-700 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {isMobile && showNext && (
                        <button
                            onClick={() => scrollNav("next")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
                        >
                            ▶
                        </button>
                    )}
                </div>
            </div>

            {/* Sections */}
            <div className="grid-cols-3 rounded gap-10 lg:grid">
                <div className="space-y-10 col-span-2">
                    {data.facilities.map((group) => {
                        // Facility Type Icon = first facility item's icon
                        const firstIcon = group.facilities?.[0]?.icon;
                        const TypeIcon = getIconComponent(firstIcon);

                        return (
                            <section
                                key={group.facility_type}
                                id={group.facility_type}
                                ref={(el) => (sectionRefs.current[group.facility_type] = el)}
                                className="scroll-mt-28"
                            >
                                {/* Type name + icon */}
                                <h2 className="text-xl font-bold text-blue-950 mb-4 flex items-center gap-3">
                                    {TypeIcon && (
                                        <div className="bg-blue-100 p-2 rounded-full text-blue-950">
                                            <TypeIcon size={22} />
                                        </div>
                                    )}
                                    {group.facility_type}
                                </h2>

                                <div className="space-y-4">
                                    {group.facilities.map((item, idx) => {
                                        const IconComponent = getIconComponent(item.icon);

                                        return (
                                            <div key={idx} className="bg-white p-5 shadow-sm border rounded-lg">
                                                <div className="flex items-start gap-3">


                                                    {/* Content */}
                                                    <div
                                                        className="text-gray-700 [&>ul]:list-disc [&>ol]:list-decimal [&>li]:ml-5"
                                                        dangerouslySetInnerHTML={{ __html: item.value }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* Contact Form Section */}
                <div className="col-span-1 p-[10px] rounded-lg shadow-lg">
                    <div className="sticky top-28 h-[750px] overflow-x-auto">
                        <div className="overflow-y-auto">
                            <ContactForm
                                category={"ship"}
                                propertyDetails={data?.property_name}
                                headline={"Request For Custom Package"}
                            /></div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}
