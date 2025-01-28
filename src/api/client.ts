// const API_BASE_URL = 'http://localhost:5000'; // Replace with your backend URL
const API_BASE_URL = 'https://ticket.gosnd.com'; // Replace with your backend URL



export async function httpClient({
    endpoint = '',
    method = 'GET',
    body = null,
    headers = {},
    query = {},
    credentials = ""

}: {
    endpoint: string;
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    query?: Record<string, string | number>;
    credentials?: string
}): Promise<Response> {
    try {
        const queryString = new URLSearchParams(
            Object.entries(query).reduce((acc, [key, value]) => {
                acc[key] = String(value); // Convert number to string
                return acc;
            }, {} as Record<string, string>)
        ).toString();
        const url = `${API_BASE_URL}/api/${endpoint}${queryString ? `?${queryString}` : ''}`;
        // console.log("URL", url)
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json', // Ensure JSON content type
                ...headers,
            },
            body: body ? JSON.stringify(body) : null, // Serialize body to JSON
        };
        // console.log('Serialized Body:', body);


        const response = await fetch(url, options);
        // console.log('response', response);


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'API request failed');
        }

        return response;
    } catch (error) {
        if (error instanceof Error) {
            console.error('HTTP Request Error:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
}
