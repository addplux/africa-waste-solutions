// API Configuration
export const API_CONFIG = {
    BASE_URL: __DEV__
        ? 'http://10.0.2.2:8080/api'  // Android emulator localhost
        : 'https://africa-waste-solutions-production.up.railway.app/api', // Production Railway URL
    TIMEOUT: 10000,
};

// App Configuration
export const APP_CONFIG = {
    APP_NAME: 'Africa Waste Solutions',
    VERSION: '1.0.0',
};

export default { API_CONFIG, APP_CONFIG };
