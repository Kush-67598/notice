const API_URL = '/api';

const api = {
    // Auth
    login: async (username, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        return data;
    },

    // Notices
    getNotices: async () => {
        const res = await fetch(`${API_URL}/notices`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch notices');
        return data;
    },

    createNotice: async (formData, token) => {
        const res = await fetch(`${API_URL}/notices`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create notice');
        return data;
    },

    updateNotice: async (id, formData, token) => {
        const res = await fetch(`${API_URL}/notices/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update notice');
        return data;
    },

    deleteNotice: async (id, token) => {
        const res = await fetch(`${API_URL}/notices/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete notice');
        return data;
    }
};

window.api = api;
