import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
    // Auth Token
    saveToken: async (token) => {
        try {
            await AsyncStorage.setItem('authToken', token);
        } catch (error) {
            console.error('Error saving token:', error);
        }
    },

    getToken: async () => {
        try {
            return await AsyncStorage.getItem('authToken');
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    removeToken: async () => {
        try {
            await AsyncStorage.removeItem('authToken');
        } catch (error) {
            console.error('Error removing token:', error);
        }
    },

    // User Data
    saveUser: async (user) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user:', error);
        }
    },

    getUser: async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    },

    removeUser: async () => {
        try {
            await AsyncStorage.removeItem('user');
        } catch (error) {
            console.error('Error removing user:', error);
        }
    },

    // Clear all data
    clearAll: async () => {
        try {
            await AsyncStorage.multiRemove(['authToken', 'user']);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    },
};

export default storage;
