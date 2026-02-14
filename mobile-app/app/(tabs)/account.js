import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Image,
    Platform,
    StatusBar as RNStatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';

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
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.headerBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.headerContent}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#ffffff', '#f3f4f6']}
                                style={styles.avatarBackground}
                            >
                                <Text style={styles.avatarText}>
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </Text>
                            </LinearGradient>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: user?.kyc_status === 'approved' ? Colors.success : Colors.warning }
                            ]} />
                        </View>
                        <Text style={styles.name}>{user?.name || 'User'}</Text>
                        <Text style={styles.email}>{user?.email || ''}</Text>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Profile Details</Text>
                        <View style={styles.card}>
                            <InfoRow icon="call" label="Contact" value={user?.contact || 'N/A'} isFirst />
                            <InfoRow icon="location" label="Area" value={user?.area || 'N/A'} />
                            <InfoRow icon="home" label="Plot Number" value={user?.plot_number || 'N/A'} />
                            <InfoRow icon="briefcase" label="Account Type" value={user?.account_type || 'N/A'} />
                            <InfoRow
                                icon="shield-checkmark"
                                label="Verification Status"
                                value={user?.kyc_status?.toUpperCase() || 'PENDING'}
                                valueColor={user?.kyc_status === 'approved' ? Colors.success : Colors.warning}
                                isLast
                            />
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Settings</Text>
                        <View style={styles.card}>
                            <TouchableOpacity style={styles.menuItem} onPress={() => { }}>
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
                                        <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
                                    </View>
                                    <Text style={styles.menuItemLabel}>Notifications</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity style={styles.menuItem} onPress={() => { }}>
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.iconBox, { backgroundColor: '#f0fdf4' }]}>
                                        <Ionicons name="lock-closed-outline" size={20} color={Colors.success} />
                                    </View>
                                    <Text style={styles.menuItemLabel}>Privacy & Security</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity style={styles.menuItem} onPress={() => { }}>
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.iconBox, { backgroundColor: '#fff7ed' }]}>
                                        <Ionicons name="help-circle-outline" size={20} color={Colors.warning} />
                                    </View>
                                    <Text style={styles.menuItemLabel}>Help & Support</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <LinearGradient
                            colors={['#fee2e2', '#fecaca']}
                            style={styles.logoutGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                            <Text style={styles.logoutText}>Sign Out</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.versionText}>Version 1.0.0 (Build 2026.02)</Text>
                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function InfoRow({ icon, label, value, valueColor, isFirst, isLast }) {
    return (
        <View style={[
            styles.infoRow,
            !isLast && styles.infoRowBorder,
            isFirst && styles.infoRowFirst,
            isLast && styles.infoRowLast
        ]}>
            <View style={styles.infoLeft}>
                <View style={styles.miniIconBox}>
                    <Ionicons name={icon} size={16} color={Colors.textSecondary} />
                </View>
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
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 280,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    },
    contentContainer: {
        padding: Spacing.lg,
    },
    headerContent: {
        alignItems: 'center',
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: Spacing.md,
    },
    avatarBackground: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    statusBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#fff',
    },
    name: {
        fontSize: FontSizes.xxl,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    email: {
        fontSize: FontSizes.md,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    sectionContainer: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSizes.md,
        fontWeight: '700',
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: BorderRadius.xl,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: '#fff',
    },
    infoRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    miniIconBox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
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
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemLabel: {
        fontSize: FontSizes.md,
        fontWeight: '500',
        color: Colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginLeft: 56,
    },
    logoutButton: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        marginTop: Spacing.md,
    },
    logoutGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    logoutText: {
        fontSize: FontSizes.md,
        fontWeight: '600',
        color: Colors.error,
    },
    versionText: {
        textAlign: 'center',
        color: Colors.textLight,
        fontSize: FontSizes.xs,
        marginTop: Spacing.xl,
    },
});
