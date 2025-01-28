"use client"
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect, useRef, useState, useCallback } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { logout } from "@/api/action/authAction";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { UserType } from "@/types/userType";
import { useUser } from "@/context/UserContext";
import Image from "next/image";


export default function Header() {
    const profileRef = useRef<HTMLDivElement>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userDetails, setUserDetails] = useState<UserType | null>(null); // Allow null as initial value
    const router = useRouter();
    const { setUser } = useUser()

    // Toggle the profile dropdown menu
    const handleProfileButton = useCallback(() => {
        setDropdownOpen((prev) => !prev);
    }, []);

    // Close dropdown if clicked outside
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
            profileRef.current &&
            !profileRef.current.contains(event.target as Node)
        ) {
            setDropdownOpen(false); // Close the dropdown if clicked outside
        }
    }, []);

    useEffect(() => {
        // Add event listener on mount
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener on unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        // Fetch the user object from the cookies
        const userCookie = Cookies.get("user");
        if (userCookie) {
            try {
                const parsedUser = JSON.parse(userCookie); // Parse the JSON string
                setUserDetails(parsedUser); // Set the parsed object in state
            } catch (error) {
                console.error("Failed to parse user cookie:", error);
                setUserDetails(null); // Handle invalid user cookie
            }
        } else {
            setUserDetails(null); // No user cookie found
        }
    }, []);


    // Don't render the Header until username is ready to ensure consistent server and client HTML
    if (userDetails === null) {
        return null; // Render nothing until username is set
    }

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result.message === 'Logout successful') {
                Cookies.remove('authToken', { path: '/' });
                Cookies.remove('user', { path: '/' });
                setUser(null);
                toast.success(result.message);
                router.push('/login'); // Redirect to login page
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('An error occurred while logging out');
        }
    };

    return (
        <div className="bg-[#fdfefd] text-black p-4 fixed top-0 left-0 w-full  flex items-center justify-between z-10">
            {/* Left Section - Logo */}
            <div className="flex items-center space-x-4">
                <div className="w-32">
                    <Image
                        src="/assets/snd-logo.png"
                        alt="logo"
                        width={500}
                        height={500}
                    />
                </div>
                {/* Only show "Create A User" button if user is Admin */}
            </div>
            {/* Center Section - Refund Module Text */}
            <div className="flex justify-center w-full absolute inset-x-0 text-center">
                <div className="text-2xl italic font-bold text-[#394b5d]">
                    Ticket Module
                </div>
            </div>
            <div ref={profileRef} className="relative">
                <button onClick={handleProfileButton} className="focus:outline-none">
                    <AccountCircleIcon sx={{ color: "black", fontSize: 32 }} />
                    <KeyboardArrowDownIcon />
                </button>
                <div
                    className={`absolute right-0 mt-2 bg-[#d72f59] text-white px-4 py-2  rounded shadow-lg ${dropdownOpen ? "block" : "hidden"
                        }`}
                >
                    <p className="cursor-default border-b-2 ">
                        Hi, {userDetails?.fullname.toUpperCase()}
                    </p>
                    <button
                        onClick={handleLogout}
                        className="hover:text-[#f1eded] cursor-pointer w-full text-left"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
