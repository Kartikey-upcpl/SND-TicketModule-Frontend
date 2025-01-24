"use client"
import React, { useState } from 'react';
import { signup } from '@/api/action/authAction';
import { toast, ToastContainer } from 'react-toastify';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        email: "",
        password: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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
            });
        } catch (error: any) {
            toast.error(error.message || 'Signup failed');
        }
    };

    return (
        <div className="flex justify-center items-center p-4 sm:p-8 mt-10 w-full">
            <div className="bg-red-300 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-md justify-center p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg shadow-lg">
                <div className="flex justify-center mb-10">
                    <img src="/assets/snd-logo.png" alt="logo" className="h-20 " />
                </div>
                <form className='w-full mt-2 space-y-2' onSubmit={handleSubmit}>
                    <input
                        className="w-full p-2 border rounded"
                        name="username"
                        placeholder="User Name"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded"
                        name="fullname"
                        placeholder="Full Name"
                        value={formData.fullname}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded"
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded"
                        name="password"
                        placeholder="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <select className='w-full p-2 border rounded' name="role" id="">
                        <option value="Agent">Select User Role</option>
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


