"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UpdateTicketStatus from "@/components/Modals/UpdateTicketStatus";
import { toast } from "react-toastify";
import UploadMedia from "@/components/upload-media/page";
import { handleImageUploadForTicket } from "@/api/action/mediaAction";
import { commentsByTicketId, resolveTicketAction, submitComment, ticketById, updateForwardPickup, updateReversePickup, updateTicketAction } from "@/api/action/ticketAction";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

const TicketPage: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>(); // Get ticketId directly from useParams
    const [ticket, setTicket] = useState<any>(null);
    const { user } = useUser();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingReverseAWB, setIsEditingReverseAWB] = useState(false);
    const [isForwardAWB, setIsForwardAWB] = useState(false);
    const [reverseAwbValue, setReverseAwbValue] = useState<string>("");
    const [forwardAwbValue, setForwardAwbValue] = useState<string>("");
    const [isResolving, setIsResolving] = useState<boolean>(false); // For showing the text box
    const [resolveComment, setResolveComment] = useState<string>(""); // Comment input
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [updatedDescription, setUpdatedDescription] = useState<string>("");
    const [comments, setComments] = useState<any[]>([]); // Ensure it's an array
    const [newComment, setNewComment] = useState<string>(""); // New: New comment input


    useEffect(() => {
        const fetchTicketAndComments = async () => {
            try {
                if (!ticketId) throw new Error("No ticketId provided");
                // Fetch ticket details
                const ticketResponse = await ticketById(ticketId)
                // if (!ticketResponse.ok) throw new Error("Failed to fetch ticket details");
                setTicket(ticketResponse.ticket);
                setReverseAwbValue(ticketResponse.ticket?.reversePickupAWB || "");
                setForwardAwbValue(ticketResponse.ticket?.forwardShippingAWB || "");

                // Fetch comments
                const commentsResponse = await commentsByTicketId(ticketId)
                setComments(commentsResponse);
            } catch (err: any) {
                console.error("Error loading ticket or comments:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTicketAndComments();
    }, [ticketId]);

    const saveReversePickup = async () => {
        try {
            const response = await updateReversePickup(ticket?._id, reverseAwbValue, user?.fullname || "")

            if (!response.ok) {
                throw new Error("Failed to update Reverse Pickup AWB");
            }

            toast.success("Reverse Pickup AWB updated successfully!");
            setTicket((prev: any) => ({
                ...prev,
                reversePickupAWB: reverseAwbValue,
            }));
        } catch (error: any) {
            toast.error(`Failed to update AWB: ${error.message}`);
        } finally {
            setIsEditingReverseAWB(false);
        }
    };

    const saveForwardPickup = async () => {
        try {
            const response = await updateForwardPickup(ticket?._id, forwardAwbValue, user?.fullname || "")

            if (!response.ok) {
                throw new Error("Failed to update Forward Shipping AWB");
            }

            toast.success("Forward Shipping AWB updated successfully!");
            setTicket((prev: any) => ({
                ...prev,
                forwardShippingAWB: forwardAwbValue,
            }));
        } catch (error: any) {
            toast.error(`Failed to update AWB: ${error.message}`);
        } finally {
            setIsForwardAWB(false);
        }
    };

    const resolveTicket = async () => {
        if (!resolveComment) {
            toast.error("Please enter a comment before resolving the ticket.");
            return;
        }
        try {
            const response = await resolveTicketAction(ticket?._id, resolveComment, user?.fullname || "")

            if (!response.ok) {
                throw new Error("Failed to resolve ticket");
            }

            toast.success("Ticket resolved successfully!");
            setTicket((prev: any) => ({
                ...prev,
                status: "Resolved",
            }));
            setIsResolving(false);
        } catch (error: any) {
            toast.error(`Failed to resolve ticket: ${error.message}`);
        }
    };

    const uploadImages = async (urls: string[]) => {
        const result = await handleImageUploadForTicket(ticket?._id, urls);
        if (result.status === "success") {
            toast.success("Images uploaded successfully!");
            setTicket((prev: any) => ({
                ...prev,
                imageProofLink: [...(prev.imageProofLink || []), ...urls],
            }));
        } else {
            toast.error(result.message);
        }
    };

    const mimeMap: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        mp4: 'video/mp4',
        mpeg: 'video/mpeg',
        avi: 'video/avi',
    };

    function getMimeType(link: string): string | null {
        const extension = link.split('.').pop()?.toLowerCase();
        return extension && mimeMap[extension] ? mimeMap[extension] : null;
    }

    function getStatusColor(status: string): string {
        switch (status) {
            case "In-Progress":
                return "bg-[#3EC9D6] text-white";
            case "Closed":
                return "bg-[#0CAF60] text-white";
            case "Hold":
                return "bg-[#6C757D] text-white";
            default:
                return "bg-gray-100 text-gray-700";
        }
    }


    function getIssueColor(issue: string): string {
        switch (issue) {
            case "Missing":
                return "bg-[#f73208] text-white";
            case "Compensation":
                return "bg-[#AC290D] text-white";
            case "Replacement Pickup":
                return "bg-[#1b19a4] text-white";
            case "Part Replacement":
                return "bg-[#a8159c] text-white";
            default:
                return "bg-gray-100 text-gray-700";
        }
    }

    const handleUpdateDescription = async () => {
        if (!updatedDescription) {
            toast.error("Please fill description field to update");
            return;
        }
        try {
            const updatedTicket = await updateTicketAction(ticket?._id, { "description": updatedDescription }, user?.fullname || "");
            if (updatedTicket.status === "error") {
                throw new Error(updatedTicket.message);
            }
            toast.success("Ticket updated successfully!");
        } catch (error: any) {
            toast.error(`Failed to update ticket: ${error.message}`);
        } finally {
            setIsEditingDescription(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast.error("Comment cannot be empty.");
            return;
        }
        try {
            const response = await submitComment(ticket?._id, newComment, user?.fullname || "")

            setComments(response); // Update comments list
            setNewComment(""); // Clear input
            toast.success("Comment added successfully!");
        } catch (err: any) {
            console.error("Error adding comment:", err.message);
            toast.error("Failed to add comment.");
        }
    };

    if (loading) return <p>Loading ticket details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!ticket) return <p>No ticket found.</p>;

    return (
        <div className="sm:flex p-6 mx-auto bg-white shadow-md rounded-md max-w-full">
            <div className="w-3/4 md:w-7/10 p-6 bg-white  rounded-lg">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-[#0CAF60] flex items-center justify-center">
                    🎫 Ticket Details
                </h1>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <p className="text-lg font-semibold">
                        <span className="text-gray-600">Ticket ID:</span>
                        <span className="text-[#0CAF60]">{ticket.ticketId}</span>
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-[#0CAF60] text-white font-medium rounded-lg shadow hover:bg-[#258758] transition duration-200"
                    >
                        View Details
                    </button>
                    <UpdateTicketStatus
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        ticketId={ticket._id}
                        username={user?.fullname || ""}
                    />
                </div>

                {/* Ticket Details */}
                <div className="space-y-6 mb-8">
                    <div>
                        <strong className="text-gray-700">Customer:</strong> {ticket.customer}
                    </div>
                    <div>
                        <strong className="text-gray-700">Status:</strong>{" "}
                        <span className={`p-2 text-sm font-medium rounded ${getStatusColor(ticket.status)}`}>
                            {ticket.status.toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <strong className="text-gray-700">Issue:</strong>
                        <span className={`p-2 text-sm font-medium rounded ${getIssueColor(ticket?.issue)}`}>
                            {ticket.issue}
                        </span>
                    </div>
                    <div>
                        <strong className="text-gray-700">Description:</strong>
                        {isEditingDescription ? (
                            <div className="flex items-center space-x-4 mt-3">
                                <textarea
                                    rows={3}
                                    className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0CAF60]"
                                    value={updatedDescription}
                                    onChange={(e) => setUpdatedDescription(e.target.value)}
                                />
                                <button
                                    className="p-2 hover:bg-[#0CAF60] hover:text-white bg-transparent text-[#0CAF60] border border-[#0CAF60] font-medium rounded-lg shadow  transition duration-200"
                                    onClick={handleUpdateDescription}
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between mt-3">
                                <div className="text-gray-600 max-w-full break-words overflow-hidden">
                                    {ticket.description || "N/A"}
                                </div>
                                <button
                                    className="p-2 hover:bg-[#0CAF60] hover:text-white bg-transparent text-[#0CAF60] border border-[#0CAF60] font-medium rounded-lg shadow  transition duration-200"
                                    onClick={() => setIsEditingDescription(true)}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Uploaded Media */}
                <div className="mb-6">
                    <strong className="text-gray-700">Uploaded Media:</strong>
                    {ticket.imageProofLink && ticket.imageProofLink.length > 0 ? (
                        <div className="flex flex-wrap gap-4 mt-3">
                            {ticket.imageProofLink.map((link: string, index: number) => {
                                const mimeType = getMimeType(link.trim());
                                const isImage = ["image/jpeg", "image/png", "image/gif"].includes(mimeType || "");
                                const isVideo = ["video/mp4", "video/mpeg", "video/avi"].includes(mimeType || "");

                                return isImage ? (
                                    <a
                                        key={`image-${index}`}
                                        href={link.trim()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-32 h-32 rounded-lg shadow-md overflow-hidden border"
                                    >
                                        <Image
                                            src={link.trim()}
                                            alt={`Uploaded image ${index + 1}`}
                                            width={500}
                                            height={500}
                                        />
                                    </a>
                                ) : isVideo ? (
                                    <a
                                        key={`video-${index}`}
                                        href={link.trim()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-32 h-32 rounded-lg shadow-md overflow-hidden border"
                                    >
                                        <video
                                            src={link.trim()}
                                            className="w-full h-full"
                                            controls
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    </a>
                                ) : (
                                    <p key={`unsupported-${index}`} className="text-red-500">
                                        Unsupported media type.
                                    </p>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-3">
                            <p className="text-gray-600">No media found. Please upload images or videos:</p>
                            <UploadMedia ticketId={ticket.ticketId} onUpload={uploadImages} />
                        </div>
                    )}
                </div>

                {/* Priority */}
                <p>
                    <strong className="text-gray-700">Priority:</strong>{" "}
                    <span className="text-indigo-700">{ticket.priority}</span>
                </p>

                {/* Reverse and Forward AWB */}
                {ticket.issue === "Replacement Pickup" && (
                    <>
                        {/* Reverse Pickup */}
                        <div className="mt-6">
                            <strong className="text-gray-700">Reverse Pickup AWB:</strong>
                            {isEditingReverseAWB ? (
                                <div className="flex items-center space-x-4 mt-3">
                                    <textarea
                                        rows={3}
                                        className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={reverseAwbValue}
                                        onChange={(e) => setReverseAwbValue(e.target.value)}
                                    />
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition duration-200"
                                        onClick={saveReversePickup}
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between mt-3">
                                    <div className="text-gray-600 max-w-96 break-words overflow-hidden">
                                        {ticket.reversePickupAWB || "N/A"}
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg shadow hover:bg-indigo-600 transition duration-200"
                                        onClick={() => setIsEditingReverseAWB(true)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Forward Pickup */}
                        <div className="mt-6">
                            <strong className="text-gray-700">Forward Shipping AWB:</strong>
                            {isForwardAWB ? (
                                <div className="flex items-center space-x-4 mt-3">
                                    <textarea
                                        rows={3}
                                        className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={forwardAwbValue}
                                        onChange={(e) => setForwardAwbValue(e.target.value)}
                                    />
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition duration-200"
                                        onClick={saveForwardPickup}
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between mt-3">
                                    <div className="text-gray-600 max-w-96 break-words overflow-hidden">
                                        {ticket.forwardShippingAWB || "N/A"}
                                    </div>

                                    <button
                                        className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg shadow hover:bg-indigo-600 transition duration-200"
                                        onClick={() => setIsForwardAWB(true)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Resolve Ticket */}
                <div className="flex justify-center mt-8">
                    {isResolving ? (
                        <div className="space-y-4 w-full">
                            <textarea
                                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={4}
                                placeholder="Enter your resolution comment here"
                                value={resolveComment}
                                onChange={(e) => setResolveComment(e.target.value)}
                            />
                            <button
                                onClick={resolveTicket}
                                className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition duration-200"
                            >
                                Submit
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsResolving(true)}
                            className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition duration-200"
                        >
                            Resolve Ticket
                        </button>
                    )}
                </div>
            </div>

            <div className="w-1/4 md:w-3/10 p-4 border-2 border-gray-300 max-h-[650px] overflow-y-scroll">
                <h2 className="text-xl font-bold mb-4">Comments</h2>
                <div className="space-y-4">
                    {comments.map((comment, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gray-100 rounded-md shadow-sm flex flex-col relative z-0"
                            style={{ overflow: "hidden" }}
                        >
                            <div className="text-sm text-gray-600">
                                <strong>{comment.commentedBy}</strong> at{" "}
                                {new Date(comment.commentedAt).toLocaleString()}
                            </div>
                            <div className="text-gray-800 break-words overflow-wrap max-w-96">
                                {comment.comment}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Add New Comment */}
                <div className="mt-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                        className="w-full p-2 border rounded-md"
                        placeholder="Add a new comment..."
                    ></textarea>
                    <button
                        onClick={handleAddComment}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Post Comment
                    </button>
                </div>
            </div>
        </div >
    );
};

export default TicketPage;
