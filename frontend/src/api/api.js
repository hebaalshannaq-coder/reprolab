const API_URL = import.meta.env.VITE_API_URL;

export const request = async (path, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = { "Content-Type": "application/json" };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    let data = null;
    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    if (!response.ok) {
        const message = (data && data.error) || "Something went wrong";
        const err = new Error(message);
        err.status = response.status;
        throw err;
    }

    return data;
};