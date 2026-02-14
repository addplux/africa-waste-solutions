import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/Colors';

export default function AccountScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={48} color="#fff" />
                </View>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
                <Text style={styles.email}>{user?.email || ''}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Information</Text>

                <InfoRow icon="mail" label="Email" value={user?.email} />
                <InfoRow icon="call" label="Contact" value={user?.contact || 'N/A'} />
                <InfoRow icon="location" label="Area" value={user?.area || 'N/A'} />
                <InfoRow icon="home" label="Plot Number" value={user?.plot_number || 'N/A'} />
                <InfoRow icon="briefcase" label="Account Type" value={user?.account_type || 'N/A'} />
                <InfoRow
                    icon="shield-checkmark"
                    label="KYC Status"
                    value={user?.kyc_status || 'pending'}
                    valueColor={user?.kyc_status === 'approved' ? Colors.success : Colors.warning}
                />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out" size={20} color={Colors.error} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Africa Waste Solutions v1.0.0</Text>
            </View>
        </ScrollView>
    );
}

function InfoRow({ icon, label, value, valueColor }) {
    return (
        <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
                <Ionicons name={icon} size={20} color={Colors.textSecondary} />
                <Text style={styles.infoLabel}>{label}</Text>
            </View>
            <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        backgroundColor: Colors.primary,
        padding: Spacing.xl,
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    name: {
        fontSize: FontSizes.xxl,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: Spacing.xs,
    },
    email: {
        fontSize: FontSizes.md,
        color: '#fff',
        opacity: 0.9,
    },
    section: {
        backgroundColor: '#fff',
        margin: Spacing.md,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    infoLabel: {
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
    },
    infoValue: {
        fontSize: FontSizes.md,
        fontWeight: '600',
        color: Colors.text,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: '#fff',
        margin: Spacing.md,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.error,
    },
    logoutText: {
        fontSize: FontSizes.lg,
        fontWeight: '600',
        color: Colors.error,
    },
    footer: {
        alignItems: 'center',
        padding: Spacing.xl,
    },
    footerText: {
        fontSize: FontSizes.sm,
        color: Colors.textLight,
    },
});
