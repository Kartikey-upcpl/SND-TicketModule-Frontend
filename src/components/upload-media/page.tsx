"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UploadMediaProps } from "@/types/ticketType";
import Image from "next/image";



const UploadMedia: React.FC<UploadMediaProps> = ({ onUpload, ticketId }) => {

    const [files, setFiles] = useState<File[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setUploadStatus("Please select at least one file first!");
            return;
        }
        const formData = new FormData();
        formData.append("ticketId", ticketId); // Use ticketId for association
        files.forEach((file) => {
            formData.append("media", file);
        });

        try {
            const response = await fetch("http://localhost:3000/api/media/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to upload media");
            }

            const data = await response.json();
            const urls = data.files.map((file: any) => file.url);
            setUploadedUrls(urls);
            setUploadStatus("Media uploaded successfully!");
            onUpload(urls); // Pass the uploaded URLs to the parent component
        } catch (error: any) {
            setUploadStatus(`Upload failed: ${error.message}`);
        }
    };


    // const copyLink = (url: string) => {
    //     navigator.clipboard.writeText(url);
    //     toast.success("Link copied successfully!");
    // };

    return (
        <div>
            <input
                type="file"
                accept="media_type"
                multiple
                onChange={handleFileChange}
                className="mb-4"
            />
            <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Upload
            </button>

            {uploadStatus && <p className="mt-2 text-gray-700">{uploadStatus}</p>}

            {uploadedUrls.length > 0 && (
                <div className="mt-4">
                    <p className="text-gray-700">Uploaded Media:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {uploadedUrls.map((url, index) => (
                            <div key={index} className="border p-2 rounded">
                                <Image
                                    src={url}
                                    alt={`Uploaded ${index}`} width={500}
                                    height={500}
                                />
                                {/* <p className="mt-2 text-gray-600">{url}</p> */}
                                {/* <button
                                    className="mt-2 p-2 border bg-red-300"
                                    onClick={() => copyLink(url)}
                                >
                                    Copy link
                                </button> */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default UploadMedia;
