"use client";

import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar"; // Import Sidebar
import Cookies from "js-cookie";


export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authToken = Cookies.get("authToken"); // Fetch the auth token on client-side
        setIsAuthenticated(!!authToken); // Update state based on auth token presence
    }, []);

    if (!isAuthenticated) {
        // Optionally, you can show a loading state or redirect
        return <div>Loading...</div>;
    }

    // const authToken = Cookies.get("authToken");


    return (
        <div className="min-h-screen">
            <Header />
            <div className="flex">
                {/* Sidebar: Always visible on large screens, hidden on small screens */}
                <div className="lg:w-1/6 hidden sm:flex">
                    <Sidebar />
                </div>

                {/* Main Content: Full width on mobile, 5/6 on larger screens */}
                <div className="pt-16 sm:w-5/6 w-full ">
                    {children}
                </div>
            </div>
        </div>
    );
}
