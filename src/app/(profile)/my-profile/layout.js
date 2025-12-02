import Aside from "@/components/Profile/Aside";

export default function DashboardLayout({ children }) {
    return (
        <div className="lg:grid grid-cols-12 gap-10 pt-12 bg-gray-50 min-h-screen">
            <div className="col-span-2">
                <Aside />
            </div>
            <main className="col-span-10 md:ml-10">{children}</main>
        </div>
    )
}