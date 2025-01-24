import { httpClient } from '../client';


/**
 * Fetch all tickets
 * @returns {Promise<object>} - List of tickets
 */
export async function fetchUploadedMediaAction() {
    try {
        const res = await httpClient({
            endpoint: "media/images",
            method: 'GET',
        });
        return await res.json(); // Parse and return JSON response
    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}
/**
 * Upload images for a specific ticket
 * @param {string} ticketId - The ID of the ticket
 * @param {string[]} urls - The URLs of the uploaded images
 * @returns {Promise<object>} - Updated ticket with imageProofLink
 */
export async function handleImageUploadForTicket(ticketId: string, urls: string[]) {
    try {
        const response = await httpClient({
            endpoint: `media/save-images/${ticketId}`,
            method: "POST",
            body: { imageUrls: urls },
        });

        // Check for HTTP errors
        if (!response.ok) {
            const errorText = await response.text(); // Parse as plain text to handle HTML errors
            throw new Error(`HTTP Request Error: ${errorText}`);
        }

        const data = await response.json(); // Parse response as JSON
        return { status: "success", data: data.ticket };
    } catch (error: any) {
        // Log the error for debugging
        console.error("Error uploading images:", error.message);

        // Return a structured error response
        return {
            status: "error",
            message: error.message.includes("Unexpected token")
                ? "The server returned an unexpected response. Please check the API endpoint or server logs."
                : error.message,
        };
    }
}


