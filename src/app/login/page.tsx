"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { login } from "@/api/action/authAction";
import Cookies from 'js-cookie';
import "react-toastify/dist/ReactToastify.css"; // Ensure this is imported
import { useUser } from "@/context/UserContext";
import Image from "next/image";

const LoginForm = ({ onClose }: any) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { setUser } = useUser()
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const formData = { username: userName, password: password }
        try {
            const response = await login(formData);
            const { token: authToken, user } = response;
            if (authToken) {
                // Set the authToken in a cookie
                Cookies.set('authToken', authToken, {
                    expires: 1,        // Cookie expires in 7 days
                    secure: process.env.NODE_ENV === 'production', // Enable secure in production
                    path: '/',         // Make the cookie available site-wide
                });

                // Set the user object in a cookie
                Cookies.set('user', JSON.stringify(user), {
                    expires: 1,        // Cookie expires in 7 days
                    secure: process.env.NODE_ENV === 'production', // Enable secure in production
                    path: '/',         // Make the cookie available site-wide
                });
                setUser(user);
                toast.success("User Login successfully");
                router.push('/tickets/all');
            }
            else {
                toast.error('Invalid credentials');
            }
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen sm:w-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] sm:w-4/6"></div>
            <div className="bg-white sm:w-4/12	py-32 p-20 justify-center  rounded-lg shadow-lg">
                <div className="flex justify-center">
                    <Image
                        src="/assets/snd-logo.png"
                        width={500}
                        height={500}
                        alt="logo"
                    />
                </div>
                <p className="text-3xl font-semibold text-center py-10">
                    Ticket Dashboard
                </p>
                <div>
                    <form onSubmit={handleSubmit} className="w-full my-10">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded mt-1 focus:ring focus:border-blue-500 bg-gray-50"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full p-2 border rounded mt-1 focus:ring focus:border-blue-500 bg-gray-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-center w ">
                            <button
                                type="submit"
                                className="bg-[#d7315b] text-white px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-500 w-1/2"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default LoginForm;
