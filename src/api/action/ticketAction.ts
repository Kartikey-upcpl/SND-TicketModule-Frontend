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
            method: 'POST',
            body: ticketData,
        });

        return await res.json(); // Parse and return JSON response
    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}
/**
 * Fetch all tickets
 * @returns {Promise<object>} - List of tickets
 */
export async function fetchTicketsAction(
    status?: 'In-Progress' | 'Closed' | "Hold",
    endpoint: string = 'tickets' // Default endpoint
) {
    try {
        const res = await httpClient({
            endpoint: endpoint,
            method: 'GET',
            query: status ? { status } : {}, // Pass status only if provided

        });

        return await res.json(); // Parse and return JSON response
    } catch (error: any) {
        return { status: 'error', message: error.message };
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