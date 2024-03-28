// utils/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, options);

    if (!res.ok) {
        throw new Error(`An error occurred while fetching ${endpoint}`);
    }

    return await res.json();
}

export const getApi = <T>(endpoint: string) => fetchApi<T>(endpoint);

export const postApi = <T>(endpoint: string, body: object) =>
    fetchApi<T>(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

export const putApi = <T>(endpoint: string, body: object) =>
    fetchApi<T>(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

export const deleteApi = <T>(endpoint: string) =>
    fetchApi<T>(endpoint, {
        method: 'DELETE',
    });