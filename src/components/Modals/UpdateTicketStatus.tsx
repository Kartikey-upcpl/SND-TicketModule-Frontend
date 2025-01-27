import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateTicketAction } from "@/api/action/ticketAction";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ticketId: string; // Pass the ticket ID as a prop
    username: string
}

const UpdateTicketStatus = ({ isOpen, onClose, ticketId, username }: Props) => {
    const priorities = ["Low", "Medium", "High"];
    const statuses = ["In-Progress", "Hold", "Closed"];

    const [formData, setFormData] = useState({
        priority: "",
        status: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.priority && !formData.status) {
            toast.error("Please update at least one field (priority or status) before submitting.");
            return;
        }
        try {
            const updatedTicket = await updateTicketAction(ticketId, formData, username);
            if (updatedTicket.status === "error") {
                throw new Error(updatedTicket.message);
            }
            toast.success("Ticket updated successfully!");
            onClose(); // Close the modal
        } catch (error: any) {
            toast.error(`Failed to update ticket: ${error.message}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Update Ticket Status</h2>

                <div className="space-y-4">
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Update Priority</option>
                        {priorities.map((priority) => (
                            <option key={priority} value={priority}>
                                {priority}
                            </option>
                        ))}
                    </select>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Update Status</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-[#0CAF60] text-white rounded hover:bg-[#258255]"
                    >
                        Update
                    </button>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default UpdateTicketStatus;
