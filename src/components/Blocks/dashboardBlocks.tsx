import React from "react";

interface RefundReportBlock {
    icon: React.ReactNode;
    count: string | null;
    percentage: number;
    text: string;
    label: string | null;
    bgColor: string;
}
const DashboardBlock = ({ icon, count, label, text, bgColor }: RefundReportBlock) => {
    return (
        <div style={{ backgroundColor: bgColor }} className="w-64 h-36 bg-slate-200 p-4 rounded-md shadow-md">
            <div className="h-1/2 flex items-center justify-between">
                <div className="text-gray-700 text-sm ">{text}</div>{" "}
                <div className="text-4xl">{icon}</div>
            </div>
            <div className="flex w-full h-1/2 justify-between items-center mt-2">
                <div className="text-black text-lg font-semibold">{label}</div>

                <div className="text-black text-lg font-semibold">{count}</div>
            </div>
        </div>
    );
};

export default DashboardBlock;
