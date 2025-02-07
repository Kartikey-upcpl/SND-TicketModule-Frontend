"use client"
import React, { useState } from 'react';
import { signup } from '@/api/action/authAction';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        email: "",
        password: "",
        role: ""
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const data = await signup(formData);
            toast.success("User created successfully");
            setFormData({
                username: "",
                fullname: "",
                email: "",
                password: "",
                role: ""
            });
            router.push("/")
        } catch (error: any) {
            toast.error(error.message || 'Signup failed');
        }
    };

    return (
        <div className="flex justify-center items-center p-4 sm:p-8 mt-10 w-full">
            <div className="bg-red-300 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-md justify-center p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg shadow-lg">
                <div className="flex justify-center mb-10">
                    <Image
                        src="/assets/snd-logo.png"
                        width={500}
                        height={500}
                        alt="logo"
                    />
                </div>
                <form className='w-full mt-2 space-y-2 ' onSubmit={handleSubmit}>
                    <input
                        className="w-full p-2 border rounded text-black"
                        name="username"
                        placeholder="User Name"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded text-black"
                        name="fullname"
                        placeholder="Full Name"
                        value={formData.fullname}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded text-black"
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded text-black"
                        name="password"
                        placeholder="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <select
                        className='w-full p-2 border rounded text-black'
                        name="role"
                        value={formData.role}
                        onChange={handleChange}>
                        <option value="Select User Role">Select User Role</option>
                        <option value="Agent">Agent</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-[#d7315b] text-white px-4 py-2 rounded flex justify-center w-full"
                    >
                        Create A User{" "}
                    </button>
                </form>
            </div>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default SignupPage;


