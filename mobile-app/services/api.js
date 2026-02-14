import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// API Configuration
const API_BASE_URL = __DEV__
    ? 'http://10.0.2.2:8080/api'  // Android emulator localhost
    : 'https://africa-waste-solutions-production.up.railway.app/api'; // Production Railway URL

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// API Service Methods
export const api = {
    // Authentication
    auth: {
        login: async (email, password) => {
            const response = await apiClient.post('/auth/login', { email, password });
            return response.data;
        },

        register: async (formData) => {
            const response = await apiClient.post('/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },

        getStats: async () => {
            const response = await apiClient.get('/auth/stats');
            return response.data;
        },
    },

    // Accounts
    accounts: {
        getAll: async () => {
            const response = await apiClient.get('/accounts');
            return response.data;
        },

        create: async (accountData) => {
            const response = await apiClient.post('/accounts', accountData);
            return response.data;
        },

        block: async (accountId) => {
            const response = await apiClient.post(`/accounts/${accountId}/block`);
            return response.data;
        },

        suspend: async (accountId) => {
            const response = await apiClient.put(`/accounts/${accountId}/suspend`);
            return response.data;
        },

        unsuspend: async (accountId) => {
            const response = await apiClient.put(`/accounts/${accountId}/unsuspend`);
            return response.data;
        },

        updateKYC: async (accountId, status) => {
            const response = await apiClient.put(`/accounts/${accountId}/kyc`, { kyc_status: status });
            return response.data;
        },

        delete: async (accountId) => {
            const response = await apiClient.delete(`/accounts/${accountId}`);
            return response.data;
        },
    },

    // Entries (Transactions)
    entries: {
        getAll: async () => {
            const response = await apiClient.get('/entries');
            return response.data;
        },

        create: async (entryData) => {
            const response = await apiClient.post('/entries', entryData);
            return response.data;
        },

        delete: async (entryId) => {
            const response = await apiClient.delete(`/entries/${entryId}`);
            return response.data;
        },
    },

    // Reports
    reports: {
        getStats: async () => {
            const response = await apiClient.get('/reports/stats');
            return response.data;
        },

        export: async () => {
            const response = await apiClient.get('/reports/export');
            return response.data;
        },

        getInsights: async () => {
            const response = await apiClient.get('/reports/insights');
            return response.data;
        },
    },

    // Products
    products: {
        getAll: async () => {
            const response = await apiClient.get('/products');
            return response.data;
        },
    },
};

export default api;
