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
        <div className="">
            <Header />
            <div className="flex">
                <div className="w-1/6">
                    <Sidebar />
                </div>
                <div className="pt-16 w-10/12 h-screen  overflow-y-scroll">{children}</div>
            </div>
        </div>
    );
}
