"use client"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ticketSummaryAction } from '@/api/action/ticketAction';

const Sidebar = () => {
    const tabs = [
        { name: "All Tickets", path: "/tickets/all", roles: ["admin", "user"], countKey: "totalCount" },
        { name: "Closed Tickets", path: "/tickets/closed", roles: ["admin"], countKey: "Closed" },
        { name: "Open Tickets", path: "/tickets/open", roles: ["admin", "user"], countKey: "In-Progress" },
        { name: "Hold Tickets", path: "/tickets/hold", roles: ["admin", "user"], countKey: "Hold" },
        { name: "Low Priority Tickets", path: "/tickets/low-priority", roles: ["admin"], countKey: "Low" },
        { name: "Medium Priority Tickets", path: "/tickets/medium-priority", roles: ["admin"], countKey: "Medium" },
        { name: "High Priority Tickets", path: "/tickets/high-priority", roles: ["admin"], countKey: "High" },
        { name: "Media Gallery", path: "/media-gallery", roles: ["admin"] },
    ];

    const userRole = "admin"; // This will later be fetched dynamically based on authentication.
    const [ticketCounts, setTicketCounts] = useState<Record<string, number> | null>(null);
    console.log("ticketCounts", ticketCounts)

    const [error, setError] = useState<string | null>(null);



    console.log("ticketCounts", ticketCounts)
    useEffect(() => {
        const fetchTicketCounts = async () => {
            try {
                const response = await ticketSummaryAction(); // Call the API action
                console.log("res", response)
                setTicketCounts(response); // Store the response in state
            } catch (err: any) {
                console.error("Error fetching ticket summary:", err.message);
                setError(err.message); // Handle errors
            }
        };

        fetchTicketCounts(); // Invoke the async function
    }, []); // Empty dependency array to run this effect only once

    const getColor = (count: number | undefined) => {
        if (count === undefined) return "bg-gray-300 text-gray-700"; // Default
        if (count === 0) return "bg-gray-100 text-gray-500";
        if (count > 0 && count <= 5) return "bg-green-100 text-green-700";
        if (count > 5 && count <= 10) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-full border-r border-gray-300 p-4 bg-gray-100 py-20">
                <h2 className="text-lg font-semibold mb-4">Tickets</h2>
                <ul className="space-y-3">
                    {tabs
                        .filter(tab => tab.roles.includes(userRole))
                        .map((tab) => (
                            <li key={tab.path}>
                                <Link href={tab.path}>
                                    <div className="flex justify-between items-center p-3 rounded-md text-gray-700 hover:bg-gray-200">
                                        <p>{tab.name}</p>
                                        {tab.countKey && ticketCounts ? (
                                            <span
                                                className={`px-2 py-1 rounded-full text-sm font-semibold ${getColor(
                                                    ticketCounts[tab.countKey]
                                                )}`}
                                            >
                                                {ticketCounts[tab.countKey] || 0}
                                            </span>
                                        ) : null}
                                    </div>
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
