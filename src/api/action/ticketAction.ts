import { httpClient } from '../client';
import { TicketFormData } from '@/types/ticketType';

/**
 * Create a new ticket
 * @param {object} ticketData - Data for the new ticket
 * @returns {Promise<object>} - Response from the API
 */
export async function createTicketAction(ticketData: TicketFormData) {
    try {
        const res = await httpClient({
            endpoint: "tickets",
            method: "POST",
            body: ticketData,
        });

        // Check for success status codes (e.g., 200, 201)
        if (res.ok) {
            // Parse and return JSON response for successful requests
            return { status: "success", data: await res.json() };
        }

        // For non-2xx responses, throw an error with the returned message
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create ticket.");
    } catch (error: any) {
        // Catch network or parsing errors
        return { status: "error", message: error.message || "An unexpected error occurred." };
    }
}






/**
 * Fetch all tickets
 * @returns {Promise<object>} - List of tickets
 */
export async function fetchTicketsAction(
    status?: 'In-Progress' | 'Closed' | 'Hold',
    endpoint: string = 'tickets/status',
    page: number = 1, // Default to page 1
    limit: number = 10 // Default limit 10
) {
    try {
        const query: Record<string, string> = {};
        if (status) query.status = status;
        query.page = String(page);
        query.limit = String(limit);

        const res = await httpClient({
            endpoint: endpoint,
            method: 'GET',
            query, // ✅ Send status, page, and limit
        });

        return await res.json();
    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}


/**
 * Fetch tickets by status (and optionally by assigned user)
 * @returns {Promise<object>} - List of tickets by status and/or assigned user
 */
export async function fetchTicketsbyStatus(
    status?: "In-Progress" | "Closed" | "Hold",
    assignTo?: string,
    page: number = 1, // Added pagination support
    limit: number = 10, // Default limit is 10
    endpoint: string = "tickets/status"
) {
    try {

        const query: Record<string, string> = {};
        if (status) query.status = status;
        if (assignTo) query.assignTo = assignTo; // ✅ Add assignTo filter
        query.page = String(page); // ✅ Convert numbers to string
        query.limit = String(limit);

        // console.log("Fetching Tickets with Query:", query); // Debugging Log

        const res = await httpClient({
            endpoint: endpoint,
            method: "GET",
            query, // ✅ Send both status and assignTo in the request
        });

        const data = await res.json();

        // console.log("Fetched Tickets Data:", data); // ✅ Debugging Log

        return data;
    } catch (error: any) {
        console.error("Error Fetching Tickets:", error.message);
        return { status: "error", message: error.message };
    }
}

/**
 * Fetch priority tickets
 * @returns {Promise<object>} - List of priority tickets which is open
 */
export async function fetchPriorityTicketsAction(
    priority?: 'Low' | 'Medium' | "High",
) {
    try {
        const res = await httpClient({
            endpoint: "tickets/priority-open",
            method: 'GET',
            query: priority ? { priority } : {}, // Pass status only if provided

        });

        return await res.json(); // Parse and return JSON response
    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}

/**
 * Update a ticket by ID
 * @param {string} ticketId - The ID of the ticket to update
 * @param {Promise<object>} ticketData Updated ticket data
 * @returns {Promise<object>} - Updated ticket data
 */
export async function updateTicketAction(ticketId: string, updatedFields: Partial<TicketFormData>, username: string) {
    try {
        const res = await httpClient({
            endpoint: `tickets/update-ticket/${ticketId}`,
            method: 'PUT',
            body: {
                ...updatedFields, // Include the fields being updated
                updatedBy: username, // Add username for tracking
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update ticket');
        }

        return await res.json(); // Return the updated ticket data
    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}

export async function ticketSummaryAction() {
    try {
        const res = await httpClient({
            endpoint: "tickets/ticket-summary",
            method: 'GET',
        })
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update ticket');
        }
        // return await res.json(); // Return the ticket count
        const data = await res.json();
        return {
            ...data.statusCounts,
            ...data.priorityCounts,
            totalCount: data.totalCount
        };
    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}

export async function ticketById(ticketId: string) {
    try {
        const res = await httpClient({
            endpoint: `tickets/${ticketId}`,
            method: 'GET',
        })
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch ticket');
        }
        return await res.json(); // Return the ticket

    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}

export async function commentsByTicketId(ticketId: string) {
    try {
        const res = await httpClient({
            endpoint: `tickets/comments/${ticketId}`,
            method: 'GET',
        })
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch ticket');
        }
        return await res.json(); // Return the ticket

    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}

export async function updateReversePickup(ticketId: string, reverseAwbValue: string, fullname: string) {
    try {
        const res = await httpClient({
            endpoint: `tickets/update-reverse-AWB/${ticketId}`,
            method: 'PUT',
            body: { reversePickupAWB: reverseAwbValue, updatedBy: fullname }
        })
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch ticket');
        }
        return await res.json(); // Return the ticket

    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}

export async function updateForwardPickup(ticketId: string, forwardAwbValue: string, fullname: string) {
    try {
        const res = await httpClient({
            endpoint: `tickets/update-forward-AWB/${ticketId}`,
            method: 'PUT',
            body: { forwardShippingAWB: forwardAwbValue, updatedBy: fullname }
        })
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch ticket');
        }
        return await res.json(); // Return the ticket

    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}

export async function resolveTicketAction(ticketId: string, resolveComment: string, fullname: string) {
    try {
        const res = await httpClient({
            endpoint: `tickets/resolve-ticket/${ticketId}`,
            method: 'PUT',
            body: { resolveTicketRemark: resolveComment, updatedBy: fullname }
        })
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch ticket');
        }
        return await res.json(); // Return the ticket

    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}


export async function submitComment(ticketId: string, newComment: string, fullname: string) {
    try {
        const res = await httpClient({
            endpoint: `tickets/add-comment/${ticketId}`,
            method: 'POST',
            body: { comment: newComment, commentedBy: fullname }
        })
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch ticket');
        }
        return await res.json(); // Return the ticket

    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}