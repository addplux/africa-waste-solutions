import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
    const { isAdmin } = useAuth();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textSecondary,
                headerStyle: {
                    backgroundColor: Colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="data-entry"
                options={{
                    title: 'Data Entry',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reports',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bar-chart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
            {isAdmin() && (
                <Tabs.Screen
                    name="accounts"
                    options={{
                        title: 'Accounts',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="people" size={size} color={color} />
                        ),
                    }}
                />
            )}
        </Tabs>
    );
}
