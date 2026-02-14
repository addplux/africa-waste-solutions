const Colors = {
    // Primary Brand Colors
    primary: '#2563eb', // blue-600
    primaryDark: '#1e40af', // blue-800
    primaryLight: '#60a5fa', // blue-400
    secondary: '#4f46e5', // indigo-600
    accent: '#9333ea', // purple-600
    background: '#f3f4f6', // gray-100
    surface: '#ffffff',
    text: '#111827', // gray-900
    textSecondary: '#6b7280', // gray-500
    textLight: '#9ca3af', // gray-400
    border: '#e5e7eb', // gray-200
    success: '#16a34a', // green-600
    warning: '#eab308', // yellow-500
    error: '#dc2626', // red-600
    info: '#3b82f6', // blue-500

    // Gradients
    gradients: {
        primary: ['#2563eb', '#4338ca'], // blue-600 -> indigo-700
        success: ['#16a34a', '#0f766e'], // green-600 -> teal-700
        warning: ['#eab308', '#ea580c'], // yellow-500 -> orange-600
        info: ['#9333ea', '#4338ca'], // purple-600 -> indigo-700
        danger: ['#dc2626', '#991b1b'], // red-600 -> red-800
    },

    // Shadows (colored glows)
    shadows: {
        primary: '#3b82f6',
        success: '#16a34a',
        warning: '#eab308',
        info: '#9333ea',
    }
};

const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

const FontSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24, // rounded-3xl approx
    xxl: 32,
};

export { Colors, Spacing, FontSizes, BorderRadius };
