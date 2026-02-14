import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import storage from '../services/storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from storage on app start
    useEffect(() => {
        loadUserFromStorage();
    }, []);

    const loadUserFromStorage = async () => {
        try {
            const storedToken = await storage.getToken();
            const storedUser = await storage.getUser();

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.auth.login(email, password);

            if (response.token && response.user) {
                setToken(response.token);
                setUser(response.user);

                await storage.saveToken(response.token);
                await storage.saveUser(response.user);

                return { success: true };
            }

            return { success: false, message: 'Invalid response from server' };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please try again.',
            };
        }
    };

    const register = async (formData) => {
        try {
            const response = await api.auth.register(formData);

            if (response.token && response.user) {
                setToken(response.token);
                setUser(response.user);

                await storage.saveToken(response.token);
                await storage.saveUser(response.user);

                return { success: true };
            }

            return { success: true, message: 'Registration successful. Please login.' };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed. Please try again.',
            };
        }
    };

    const logout = async () => {
        try {
            await storage.clearAll();
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: !!token && !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
