import { MapPin, Phone, FileText, Calendar, ChevronRight } from "lucide-react";
import PrimaryButton from "@/utils/PrimaryButton";
import Link from "next/link";

const VisaOrderComponent = ({ data }) => {
    return (
        <div>
            {data.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm p-16 rounded-3xl border-2  border-gray-600 text-center shadow-lg">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-400 text-xl font-medium">No records found for this phone number.</p>
                    <p className="text-gray-300 text-sm mt-2">Please check your number or contact support</p>
                </div>
            ) : (
                <div className="grid gap-8">
                    {data.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-blue-50 border border-gray-200 rounded-3xl "
                        >
                            <div className="p-6 sm:p-8">
                                {/* Status Header */}
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2 p-4 sm:p-0 bg-gradient-to-r from-blue-50/50 to-transparent rounded-2xl">
                                    <div className="space-y-2">

                                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                                            {item.applicant_name}
                                        </h2>

                                        <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#0678B4]">
                                            Passport Number: -
                                        </span>
                                        <span className="font-mono text-gray-700 text-sm font-semibold">
                                            {item.passport_number}
                                        </span>

                                    </div>

                                    <div className="bg-gradient-to-r from-[#EEF2FF] to-blue-100 text-red-600 px-5 py-2.5 rounded-2xl border border-blue-200 flex items-center gap-2 shadow-sm">
                                        <div className="h-3 w-3 rounded-full bg-red-800 animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            {item.current_status}
                                        </span>
                                    </div>
                                </div>

                                {/* Core Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 mb-2 border border-gray-100">
                                    <div className="flex flex-col gap-2 p-3 rounded-xl hover:bg-blue-50/30 transition-colors">
                                        <div className="flex items-center gap-2 text-[#0678B4]">
                                            <MapPin size={16} strokeWidth={1.5} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Embassy</span>
                                        </div>
                                        <span className="text-gray-800 font-semibold text-sm ml-6">{item.embassy_name}</span>
                                    </div>

                                    <div className="flex flex-col gap-2 p-3 rounded-xl hover:bg-blue-50/30 transition-colors">
                                        <div className="flex items-center gap-2 text-[#0678B4]">
                                            <FileText size={16} strokeWidth={1.5} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Visa Type</span>
                                        </div>
                                        <span className="text-gray-800 font-semibold text-sm ml-6">{item.visa_name}</span>
                                    </div>

                                    <div className="flex flex-col gap-2 p-3 rounded-xl hover:bg-blue-50/30 transition-colors">
                                        <div className="flex items-center gap-2 text-[#0678B4]">
                                            <Phone size={16} strokeWidth={1.5} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Contact</span>
                                        </div>
                                        <span className="text-gray-800 font-semibold text-sm ml-6">{item.applicant_phone}</span>
                                    </div>
                                </div>

                                {/* Highlighted Update Box */}
                                {item.latest_status && (
                                    <div className="relative pl-6 py-4 border-l-4 border-[#0678B4] bg-gradient-to-r from-blue-50/50 to-transparent rounded-r-2xl">
                                        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            <span className="text-[#0678B4]">✨</span> Latest Update: {item.latest_status.status}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-2 italic pl-6">{item.latest_status.message}</p>
                                        <p className="text-[11px] text-[#0678B4] font-bold mt-3 uppercase tracking-wider flex items-center gap-2 pl-6">
                                            → Expected Next: {item.latest_status.next_status}
                                        </p>
                                    </div>
                                )}

                                {/* Action Footer */}
                                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-6 gap-4">
                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                                            <Calendar size={14} />
                                            <span>{new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                                        </div>
                                        <div className="hidden sm:block bg-gray-50 px-3 py-1.5 rounded-full font-mono">
                                            ID: {item.application_id}
                                        </div>
                                    </div>
                                    <Link href={`/visa/status/${item.application_id}`} className="text-[#0678B4] hover:underline">

                                        <PrimaryButton
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-xl transition-all duration-300"
                                        >
                                            Track Status
                                            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                                        </PrimaryButton></Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default VisaOrderComponent
