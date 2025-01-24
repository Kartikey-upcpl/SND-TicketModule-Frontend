export interface TicketFormData {
    ticketId?: string; // Add ticketId as an optional string
    orderId: string;
    customer: string;
    productName: string[]; // Change from string to string[]
    orderDate: string;
    issue: string;
    reversePickupAWB: string;
    description: string;
    priority: string;
    assignTo: string;
    createdby: string;
    imageProofLink: string[];
}