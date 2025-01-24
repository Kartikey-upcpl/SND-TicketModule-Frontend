import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for Toastify
import { TicketFormData } from '@/types/ticketType';
import { createTicketAction } from '@/api/action/ticketAction';
import axios from "axios"
import { fetchUserAction } from '@/api/action/userAction';
import { UserType } from '@/types/userType';
import { useUser } from '@/context/UserContext';
import UploadMedia from '@/app/upload-media/page';


interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: TicketFormData) => void;
}

const TicketModal = ({ isOpen, onClose, onCreate }: Props) => {
    const { user } = useUser();
    const [formData, setFormData] = useState<TicketFormData>({
        orderId: "",
        customer: '',
        productName: [],
        orderDate: "",
        issue: '',
        reversePickupAWB: "",
        description: '',
        imageProofLink: [],
        assignTo: '',
        priority: '',
        createdby: user?.username || "", // Set initial value based on user context
    });
    const priorities = ['Low', 'Medium', 'High'];
    const issues = ['Replacement Pickup', 'Missing', 'Part Replacement', "Compensation"];
    const [assignees, setAssignees] = useState<UserType[]>([]);
    const [products, setProducts] = useState<string[]>([]); // List of product names
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // Selected products
    const [uploadedMediaUrls, setUploadedMediaUrls] = useState<string[]>([]);
    const ticketId = `SND-${Math.floor(100000 + Math.random() * 900000)}`; // Generate ticketId


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUploadMedia = (urls: string[]) => {
        setUploadedMediaUrls(urls);
        setFormData((prev) => ({
            ...prev,
            imageProofLink: urls
        }));
    };

    // Dynamically update `createdby` when `user` changes
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            createdby: user?.username || "",
        }));
    }, [user]);

    useEffect(() => {
        const fetchAllUser = async () => {
            try {
                const UserData = await fetchUserAction()
                setAssignees(UserData)
            } catch (error: any) {
                console.log(error.message)
            }
        }
        fetchAllUser()
    }, []);

    const handleSubmit = async () => {
        try {
            setFormData((prev: any) => ({
                ...prev,
                productName: selectedProducts, // Save selected products as an array
            }));
            const createdTicket = await createTicketAction({
                ...formData,
                ticketId,
                productName: selectedProducts, // Ensure the API payload uses the array
            }); // Call API

            toast.success('Ticket created successfully!'); // Show success notification
            onCreate(createdTicket); // Pass created ticket back to parent
            onClose(); // Close modal
        } catch (error: any) {
            toast.error(`Failed to create ticket: ${error.message}`); // Show error notification
        }
    };

    const getOrderDetails = async () => {
        const consumer_key = process.env.NEXT_PUBLIC_CONSUMER_KEY;
        const consumer_secret = process.env.NEXT_PUBLIC_CONSUMER_SECRET;
        const api_initial = process.env.NEXT_PUBLIC_SND_ORDER_API;
        try {
            const response = await axios.get(
                `${api_initial}${formData.orderId}?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
            );
            const data = response?.data;
            const productNames = data.line_items?.map((item: any) => item.name) || [];
            setProducts(productNames);
            setFormData((prev) => ({
                ...prev,
                customer: data.billing?.first_name || '',
                orderDate: data.date_created?.slice(0, 10) || '',
            }));
        } catch (error: any) {
            console.error('Failed to fetch order details:', error.message);
            toast.error('Failed to fetch order details');
        }
    }

    const handleProductSelection = (product: string, isChecked: boolean) => {
        setSelectedProducts((prev) =>
            isChecked ? [...prev, product] : prev.filter((p) => p !== product)
        );
    };
    const handleSelectAll = (isChecked: boolean) => {
        setSelectedProducts(isChecked ? [...products] : []);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg w-96 h-2/3 overflow-y-scroll">
                <h2 className="text-xl font-semibold mb-4">Create Ticket</h2>
                <div className='my-4 flex justify-between'>
                    <div>
                        <input
                            type="text"
                            name="orderId"
                            placeholder="Order Id"
                            value={formData.orderId}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <button className='text-sm p-2 rounded bg-slate-300 text-black border' onClick={getOrderDetails}>
                            Get Order Data
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        name="customer"
                        placeholder="Customer"
                        value={formData.customer} // Sync with formData
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    {products.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Products</h3>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="selectAll"
                                    checked={selectedProducts.length === products.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                                <label htmlFor="selectAll" className="ml-2">Select All</label>
                            </div>
                            {products.map((product, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={`product-${index}`}
                                        checked={selectedProducts.includes(product)}
                                        onChange={(e) => handleProductSelection(product, e.target.checked)}
                                    />
                                    <label htmlFor={`product-${index}`} className="ml-2">{product}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    <input
                        type="text"
                        name="orderDate"
                        placeholder="Order Date"
                        value={formData.orderDate} // Sync with formData
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <select
                        name="issue"
                        value={formData.issue}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Issue</option>
                        {issues.map((issue) => (
                            <option key={issue} value={issue}>{issue}</option>
                        ))}
                    </select>
                    {formData.issue === "Replacement Pickup" &&
                        <textarea
                            name="reversePickupAWB"
                            placeholder="Reverse Pickup AWB"
                            value={formData.reversePickupAWB}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    }
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <UploadMedia ticketId={ticketId} onUpload={handleUploadMedia} />

                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Priority</option>
                        {priorities.map((priority) => (
                            <option key={priority} value={priority}>{priority}</option>
                        ))}
                    </select>
                    <select
                        name="assignTo"
                        value={formData.assignTo}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Assign To</option>
                        {assignees.map((assignee) => (
                            <option key={assignee._id} value={assignee?.username}>{assignee?.username}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create
                    </button>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default TicketModal;
