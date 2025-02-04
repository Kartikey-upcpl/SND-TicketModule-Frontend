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
}): Promise<Response> {  // ✅ Return a Response-like object
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
        const contentType = response.headers.get('content-type');

        let responseData;
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        // console.log('HTTP Response:', responseData);

        // ✅ Simulate a Response-like object so `.json()` still works
        return new Response(JSON.stringify(responseData), {
            status: response.status,
            statusText: response.statusText,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        // console.error('HTTP Request Error:', error);

        // ✅ Simulate an error Response so `.json()` still works
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }), {
            status: 500,
            statusText: 'Internal Server Error',
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
