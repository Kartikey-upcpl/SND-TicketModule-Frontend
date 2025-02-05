import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for Toastify
import { TicketFormData } from '@/types/ticketType';
import { createTicketAction } from '@/api/action/ticketAction';
import axios from "axios"
import { fetchUserAction } from '@/api/action/userAction';
import { UserType } from '@/types/userType';
import { useUser } from '@/context/UserContext';
import UploadMedia from '../upload-media/page';


interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: TicketFormData) => void;
}
interface assigneesType {
    count: number;
    users: UserType[]; // Fix: users is an array of UserType
}
const TicketModal = ({ isOpen, onClose, onCreate }: Props) => {
    const { user } = useUser();
    const [ticketId, setTicketId] = useState<string | null>(null);
    // console.log("ticket", ticketId)
    const [formData, setFormData] = useState<TicketFormData>({
        orderId: "",
        customer: '',
        mobileNo: '',
        email: '',
        productName: [],
        orderDate: "",
        issue: '',
        reversePickupAWB: "",
        description: '',
        imageProofLink: [],
        assignTo: '',
        priority: '',
        marketplace: '', // New field for marketplace
        replacementReason: "", // New field for replacement reason
        createdby: user?.username || "", // Set initial value based on user context
    });

    const priorities = ['Low', 'Medium', 'High'];
    const marketplaces = ['Amazon', 'Flipkart', 'Website', "FirstCry", "Blinkit", "Meesho", "Other"];
    const replacementReasons = ['Wrong Product', 'Damaged Product'];
    const issues = ['Replacement Pickup', 'Missing', 'Part Replacement', "Compensation", "Part Purchase"];

    const [assignees, setAssignees] = useState<assigneesType | null>(null);
    const [products, setProducts] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [manualProduct, setManualProduct] = useState<string>("");
    const [uploadedMediaUrls, setUploadedMediaUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Generate ticketId when modal opens
    useEffect(() => {
        if (isOpen) {
            const generatedTicketId = `SND-${Math.floor(100000 + Math.random() * 900000)}`;
            setTicketId(generatedTicketId);
        }
    }, [isOpen]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleUploadMedia = (urls: string[]) => {
        setUploadedMediaUrls(urls);
        setFormData((prev) => ({ ...prev, imageProofLink: urls }));
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            createdby: user?.username || "",
        }));
    }, [user]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const userData = await fetchUserAction();
                setAssignees(userData);
            } catch (error: any) {
                console.error("Error fetching users:", error.message);
            }
        };
        fetchAllUsers();
    }, []);

    const handleSubmit = async () => {
        try {
            toast.dismiss();
            // Validation: Check for required fields
            if (!formData.orderId.trim()) {
                toast.error("Order ID is required.");
                return;
            }

            if (!formData.customer.trim()) {
                toast.error("Customer name is required.");
                return;
            }

            if (!formData.mobileNo.trim()) {
                toast.error("Mobile number is required.");
                return;
            }

            if (!formData.email.trim()) {
                toast.error("Email is required.");
                return;
            }

            if (!manualProduct.trim() && selectedProducts.length === 0) {
                toast.error("Please enter a product name or select at least one product.");
                return;
            }


            if (!formData.orderDate.trim()) {
                toast.error("Order date is required.");
                return;
            }

            if (!formData.issue.trim()) {
                toast.error("Please select an issue.");
                return;
            }

            if (!formData.description.trim()) {
                toast.error("Description is required.");
                return;
            }

            if (!formData.assignTo.trim()) {
                toast.error("Please assign the ticket to a user.");
                return;
            }

            if (!formData.priority.trim()) {
                toast.error("Please select a priority level.");
                return;
            }

            if (!formData.marketplace.trim()) {
                toast.error("Please select a marketplace.");
                return;
            }

            if (formData.issue === "Replacement Pickup") {
                if (!formData.replacementReason.trim()) {
                    toast.error("Please select a replacement reason.");
                    return;
                }

                if (!formData.reversePickupAWB.trim()) {
                    toast.error("Please provide the Reverse Pickup AWB.");
                    return;
                }
            }

            const allProducts = manualProduct ? [...selectedProducts, manualProduct] : [...selectedProducts];

            if (allProducts.length === 0) {
                toast.error("Please enter or select at least one product.");
                return;
            }

            // console.log("🛠 Sending FormData:", { ...formData, ticketId, productName: allProducts });

            const response = await createTicketAction({
                ...formData,
                ticketId: ticketId || "",
                productName: allProducts,
            });
            // console.log("response", response)
            if (response.status === "success") {
                toast.success("Ticket created successfully!", {
                    autoClose: 4000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    hideProgressBar: false,
                    theme: "light",
                });
                onCreate(response.data);

                setFormData({
                    orderId: "",
                    customer: "",
                    mobileNo: "",
                    email: "",
                    productName: [],
                    orderDate: "",
                    issue: "",
                    reversePickupAWB: "",
                    description: "",
                    imageProofLink: [],
                    assignTo: "",
                    priority: "",
                    marketplace: "",
                    replacementReason: "",
                    createdby: user?.username || "",
                });

                setProducts([]);
                setManualProduct("");
                onClose();
            } else if (response.status === "error") {
                console.error("🚨 API Error:", response.message);
                toast.error(response.message);
            }
        } catch (error: any) {
            console.error("❌ Unexpected Error:", error);
            toast.error(`Unexpected error: ${error.message}`);
        }
    };


    const getOrderDetails = async () => {
        if (!formData.orderId) return;
        setIsLoading(true);

        // Debugging: Check if environment variables are set correctly
        // console.log("🔍 API URL:", process.env.NEXT_PUBLIC_SND_ORDER_API);
        // console.log("🔑 Consumer Key:", process.env.NEXT_PUBLIC_CONSUMER_KEY);
        // console.log("🔑 Consumer Secret:", process.env.NEXT_PUBLIC_CONSUMER_SECRET);
        const consumer_key = process.env.NEXT_PUBLIC_CONSUMER_KEY;
        const consumer_secret = process.env.NEXT_PUBLIC_CONSUMER_SECRET;
        const api_initial = process.env.NEXT_PUBLIC_SND_ORDER_API;
        try {

            const response = await axios.get(`
                ${api_initial}${formData.orderId}?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
            );

            const data = response?.data;
            const productNames = data.line_items?.map((item: any) => item.name) || [];

            setProducts(productNames);
            setFormData((prev) => ({
                ...prev,
                customer: data.billing?.first_name || "",
                mobileNo: data.billing?.phone || "",
                email: data.billing?.email || "",
                orderDate: data.date_created?.slice(0, 10) || "",
            }));
        } catch (error: any) {
            console.error("Failed to fetch order details:", error.message);
            // toast.error("Failed to fetch order details");
        } finally {
            setIsLoading(false);
        }
    };


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
                        <button
                            className={`text-sm p-2 rounded bg-slate-300 text-black border ${!formData.orderId || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={getOrderDetails}
                            disabled={!formData.orderId || isLoading}
                        >
                            {isLoading ? "Fetching..." : "Get Order Data"}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <select name="marketplace" value={formData.marketplace} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="">Select Marketplace</option>
                        {marketplaces.map((marketplace) => (
                            <option key={marketplace} value={marketplace}>{marketplace}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="customer"
                        placeholder="Customer"
                        value={formData.customer} // Sync with formData
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="mobileNo"
                        placeholder="Mobile Number"
                        value={formData.mobileNo} // Sync with formData
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="E-Mail"
                        value={formData.email} // Sync with formData
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    {products.length === 0 && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Product Name</h3>
                            <input type="text" placeholder="Enter product name" value={manualProduct} onChange={(e) => setManualProduct(e.target.value)} className="w-full p-2 border rounded" />
                        </div>
                    )}
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
                        (
                            <>
                                <select name="replacementReason" value={formData.replacementReason} onChange={handleChange} className="w-full p-2 border rounded">
                                    <option value="">Select Replacement Reason</option>
                                    {replacementReasons.map((reason) => (
                                        <option key={reason} value={reason}>{reason}</option>
                                    ))}
                                </select>
                                < textarea
                                    name="reversePickupAWB"
                                    placeholder="Reverse Pickup AWB"
                                    value={formData.reversePickupAWB}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </>
                        )
                    }
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <UploadMedia ticketId={ticketId || ""} onUpload={handleUploadMedia} />

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
                        {assignees?.users?.map((assignee) => (
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
                        className="px-4 py-2 bg-[#0CAF60] text-white rounded hover:bg-[#258255]"
                    >
                        Create
                    </button>
                </div>
            </div>
            <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default TicketModal;
