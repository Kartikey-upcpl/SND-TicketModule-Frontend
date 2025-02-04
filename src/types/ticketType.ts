export interface TicketFormData {
    ticketId?: string; // Add ticketId as an optional string
    orderId: string;
    mobileNo: string;
    email: string;
    customer: string;
    productName: string[]; // Change from string to string[]
    orderDate: string;
    issue: string;
    reversePickupAWB: string;
    description: string;
    priority: string;
    assignTo: string;
    createdby: string;
    marketplace: string
    replacementReason: string;
    imageProofLink: string[];
}

export interface UploadMediaProps {
    onUpload: (urls: string[]) => void; // Callback to pass uploaded URLs to parent
    ticketId: string; // Ticket ID to associate with uploaded files
}