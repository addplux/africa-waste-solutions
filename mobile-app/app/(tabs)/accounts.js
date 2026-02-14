import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/Colors';

export default function AccountsScreen() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#fff', '#f3f4f6']}
                style={styles.card}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="people" size={64} color={Colors.primary} />
                </View>
                <Text style={styles.title}>Account Management</Text>
                <Text style={styles.subtitle}>Admin Access Only</Text>
                <Text style={styles.description}>
                    This module will allow administrators to manage user accounts, roles, and permissions.
                </Text>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: Spacing.lg,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: '#fff',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSizes.xxl,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSizes.lg,
        fontWeight: '600',
        color: Colors.primary,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    description: {
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
});
