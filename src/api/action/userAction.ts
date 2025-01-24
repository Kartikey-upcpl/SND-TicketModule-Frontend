import { httpClient } from '../client';
/**
 * Fetch all tickets
 * @returns {Promise<object>} - List of tickets
 */
export async function fetchUserAction() {
    try {
        const res = await httpClient({
            endpoint: "users/all-user",
            method: 'GET',
        });
        return await res.json(); // Parse and return JSON response
    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}