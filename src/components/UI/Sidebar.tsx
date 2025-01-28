"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useTicketSummary } from '@/hooks/useTicketSummary';
import { usePathname } from "next/navigation"; // Use usePathname for App Router

const Sidebar = () => {
    const tabs = [
        { name: "All Tickets", path: "/tickets/all", roles: ["Admin", "Agent"], countKey: "totalCount" },
        { name: "Closed Tickets", path: "/tickets/closed", roles: ["Admin", "Agent"], countKey: "Closed" },
        { name: "Open Tickets", path: "/tickets/open", roles: ["Admin", "Agent"], countKey: "In-Progress" },
        { name: "Hold Tickets", path: "/tickets/hold", roles: ["Admin", "Agent"], countKey: "Hold" },
        { name: "Low Priority Tickets", path: "/tickets/low-priority", roles: ["Admin", "Agent"], countKey: "Low" },
        { name: "Medium Priority Tickets", path: "/tickets/medium-priority", roles: ["Admin", "Agent"], countKey: "Medium" },
        { name: "High Priority Tickets", path: "/tickets/high-priority", roles: ["Admin", "Agent"], countKey: "High" },
        { name: "Media Gallery", path: "/media-gallery", roles: ["Admin", "Agent"] },
        { name: "DashBoard", path: "/dashboard", roles: ["Admin"] },
        { name: "Userlist", path: "/userlist", roles: ["Admin"] },
    ];
    const { user } = useUser()
    const userRole = user?.role || ""; // This will later be fetched dynamically based on authentication.
    const { TicketSummary, isLoading, isError } = useTicketSummary();
    const [ticketCounts, setTicketCounts] = useState<Record<string, number> | null>(null);
    const pathname = usePathname(); // Use usePathname to get the current route



    // useEffect(() => {
    //     const fetchTicketCounts = async () => {
    //         try {
    //             const response = await ticketSummaryAction(); // Call the API action
    //             console.log("res", response)
    //             setTicketCounts(response); // Store the response in state
    //         } catch (err: any) {
    //             console.error("Error fetching ticket summary:", err.message);
    //             setError(err.message); // Handle errors
    //         }
    //     };
    //     fetchTicketCounts(); // Invoke the async function
    // }, []); // Empty dependency array to run this effect only once


    useEffect(() => {
        // When `users` is available, update `assignees`
        if (TicketSummary) {
            setTicketCounts(TicketSummary);
        }
    }, [TicketSummary]);

    const getColor = (count: number | undefined) => {
        if (count === undefined) return "bg-gray-300 text-gray-700"; // Default
        if (count === 0) return "bg-gray-100 text-gray-500";
        if (count > 0 && count <= 5) return "bg-green-100 text-green-700";
        if (count > 5 && count <= 10) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching ticket summary.</div>;
    return (
        <div className="flex h-screen fixed">
            {/* Sidebar */}
            <div className="w-full border-r border-gray-300 p-4 bg-[#fdfefd] py-20">
                <h2 className="text-lg font-semibold mb-4">Tickets</h2>
                <ul className="space-y-2">
                    {tabs
                        .filter(tab => tab.roles.includes(userRole))
                        .map((tab) => {
                            const isActive = pathname === tab.path; // Check if the current tab is active
                            return (

                                <li key={tab.path}>
                                    <Link href={tab.path}>
                                        <div
                                            className={`flex justify-between items-center p-3 rounded-md font-semibold ${isActive
                                                ? "bg-[#0caf60] text-white" // Active styles
                                                : "text-[#4e4e4e] hover:bg-[#0caf60] hover:text-white"
                                                }`}
                                        >                                            <p>{tab.name}</p>
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
                            );
                        })}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
