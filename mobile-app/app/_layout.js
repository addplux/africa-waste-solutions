import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { PaperProvider } from 'react-native-paper';
import { Colors } from '../constants/Colors';

export default function RootLayout() {
    return (
        <PaperProvider theme={{ colors: { primary: Colors.primary } }}>
            <AuthProvider>
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: Colors.primary,
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="login" options={{ title: 'Login' }} />
                    <Stack.Screen name="register" options={{ title: 'Create Account' }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </AuthProvider>
        </PaperProvider>
    );
}
