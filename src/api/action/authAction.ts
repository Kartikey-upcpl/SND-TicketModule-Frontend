import { httpClient } from "../client";


/**
 * User Signup
 * @returns {Promise<object>} - User Details after signup
 */
export async function signup(userData: any) {
    try {
        const res = await httpClient({
            endpoint: "users/signup",
            method: 'POST',
            body: userData,
            credentials: 'include', // Include cookies in requests

        });
        return await res.json(); // Parse and return JSON response
    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}

/**
 * User Login
 * @returns {Promise<object>} - User Login
 */
export async function login(userData: any) {
    try {
        const res = await httpClient({
            endpoint: "users/login",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: userData,
            credentials: 'include', // Include cookies in requests
        });
        return await res.json(); // Parse and return JSON response
    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}

/**
 * User Logout
 * @returns {Promise<{ status: string; message: string }>} - Logout response
 */
export async function logout(): Promise<{ status: string; message: string }> {
    try {
        const res = await httpClient({
            endpoint: "users/logout",
            method: 'POST',
            credentials: 'include', // Include cookies in requests
        });

        // Check for non-2xx HTTP response
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return await res.json(); // Parse and return JSON response
    } catch (error: any) {
        return { status: 'error', message: error.message };
    }
}



