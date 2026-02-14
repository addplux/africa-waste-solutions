import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';

export default function Index() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // Redirect to appropriate screen
    if (isAuthenticated) {
        return <Redirect href="/(tabs)/dashboard" />;
    }

    return <Redirect href="/login" />;
}
