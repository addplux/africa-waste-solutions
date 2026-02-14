import { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    SafeAreaView,
    Platform,
    StatusBar as RNStatusBar,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/Colors';
import GradientCard from '../../components/GradientCard';

export default function DashboardScreen() {
    const router = useRouter();
    const { user, isAdmin } = useAuth();
    const [stats, setStats] = useState(null);
    const [adminStats, setAdminStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Load user stats
            const userStatsResponse = await api.auth.getStats();
            setStats(userStatsResponse.data);

            // Load admin stats if admin
            if (isAdmin()) {
                const reportStatsResponse = await api.reports.getStats();
                setAdminStats(reportStatsResponse.data);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadDashboardData();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
                }
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome back,</Text>
                        <Text style={styles.userName}>{user?.name || 'User'}!</Text>
                    </View>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                </View>

                {/* System Analysis Badge */}
                <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>✨ SYSTEM ANALYSIS ACTIVE</Text>
                    </View>
                </View>

                {/* Hero Text */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Environmental Performance</Text>
                    <Text style={styles.heroSubtitle}>Real-time monitoring of your waste management ecosystem.</Text>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/monitored-items')}
                    >
                        <LinearGradient
                            colors={['#fff', '#f9fafb']}
                            style={styles.actionGradient}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#eff6ff' }]}>
                                <Ionicons name="list" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={styles.actionTitle}>Monitored Items</Text>
                                <Text style={styles.actionSubtitle}>View active products</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { marginTop: Spacing.md }]}
                        onPress={() => router.push('/safety-protocols')}
                    >
                        <LinearGradient
                            colors={['#fff', '#f9fafb']}
                            style={styles.actionGradient}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#f0fdf4' }]}>
                                <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={styles.actionTitle}>Safety Protocols</Text>
                                <Text style={styles.actionSubtitle}>Guidelines & procedures</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* User Stats */}
                <Text style={styles.sectionTitle}>My Activity</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.column}>
                        <GradientCard
                            title="Supply Received"
                            value={stats?.supply_received?.toLocaleString() || '0'}
                            subtitle="Units Processed"
                            icon="cube"
                            gradientColors={Colors.gradients.primary}
                            shadowColor={Colors.shadows.primary}
                        />
                        <GradientCard
                            title="Returned"
                            value={stats?.returned?.toLocaleString() || '0'}
                            subtitle="Lifetime Impact"
                            icon="refresh"
                            gradientColors={Colors.gradients.success}
                            shadowColor={Colors.shadows.success}
                        />
                    </View>
                    <View style={styles.column}>
                        <GradientCard
                            title="Distributed"
                            value={stats?.distributed?.toLocaleString() || '0'}
                            subtitle="Outbound Stream"
                            icon="swap-horizontal"
                            gradientColors={Colors.gradients.info}
                            shadowColor={Colors.shadows.info}
                        />
                        <GradientCard
                            title="Balance"
                            value={stats?.balance?.toLocaleString() || '0'}
                            subtitle="Current Stock"
                            icon="wallet"
                            gradientColors={Colors.gradients.warning}
                            shadowColor={Colors.shadows.warning}
                        />
                    </View>
                </View>

                {/* Admin Stats */}
                {isAdmin() && adminStats && (
                    <>
                        <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>System Overview</Text>
                        <View style={styles.statsGrid}>
                            <View style={styles.column}>
                                <GradientCard
                                    title="Total Accounts"
                                    value={adminStats.total_accounts?.toLocaleString() || '0'}
                                    subtitle="Active Participants"
                                    icon="people"
                                    gradientColors={Colors.gradients.primary}
                                    shadowColor={Colors.shadows.primary}
                                />
                                <GradientCard
                                    title="Global Recovery"
                                    value={(adminStats.global_recovery?.toLocaleString() || '0') + ' T'}
                                    subtitle="Total System Output"
                                    icon="earth"
                                    gradientColors={Colors.gradients.success}
                                    shadowColor={Colors.shadows.success}
                                />
                            </View>
                            <View style={styles.column}>
                                <GradientCard
                                    title="Pending KYC"
                                    value={adminStats.pending_kyc?.toLocaleString() || '0'}
                                    subtitle="Awaiting Verification"
                                    icon="id-card"
                                    gradientColors={Colors.gradients.warning}
                                    shadowColor={Colors.shadows.warning}
                                />
                                <GradientCard
                                    title="Node Status"
                                    value={adminStats.node_status || '100%'}
                                    subtitle="Network Uptime"
                                    icon="server"
                                    gradientColors={Colors.gradients.info}
                                    shadowColor={Colors.shadows.info}
                                />
                            </View>
                        </View>
                    </>
                )}

                {/* KYC Status */}
                {stats?.kyc_status && (
                    <View style={[
                        styles.kycCard,
                        {
                            backgroundColor: stats.kyc_status === 'approved' ? '#ecfdf5' : '#fffbeb',
                            borderColor: stats.kyc_status === 'approved' ? '#d1fae5' : '#fef3c7',
                        }
                    ]}>
                        <View style={styles.kycContent}>
                            <View style={[
                                styles.kycIcon,
                                { backgroundColor: stats.kyc_status === 'approved' ? Colors.success : Colors.warning }
                            ]}>
                                <Text style={styles.kycIconText}>
                                    {stats.kyc_status === 'approved' ? '✓' : '!'}
                                </Text>
                            </View>
                            <View>
                                <Text style={[
                                    styles.kycLabel,
                                    { color: stats.kyc_status === 'approved' ? '#047857' : '#b45309' }
                                ]}>Compliance Status</Text>
                                <Text style={[
                                    styles.kycValue,
                                    { color: stats.kyc_status === 'approved' ? '#065f46' : '#92400e' }
                                ]}>
                                    {stats.kyc_status.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={{ height: Spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    contentContainer: {
        padding: Spacing.lg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    greeting: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    userName: {
        fontSize: FontSizes.xl,
        fontWeight: 'bold',
        color: Colors.text,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    avatarText: {
        color: '#fff',
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
    },
    badgeContainer: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
    },
    badge: {
        backgroundColor: '#eff6ff',
        borderColor: '#dbeafe',
        borderWidth: 1,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    badgeText: {
        color: '#2563eb',
        fontSize: FontSizes.xs,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    heroSection: {
        marginBottom: Spacing.xl,
    },
    heroTitle: {
        fontSize: FontSizes.xxxl,
        fontWeight: '900',
        color: Colors.text,
        letterSpacing: -0.5,
        marginBottom: Spacing.xs,
    },
    heroSubtitle: {
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
        lineHeight: 24,
    },
    quickActionsContainer: {
        marginBottom: Spacing.xl,
    },
    actionButton: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    actionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        gap: Spacing.md,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: FontSizes.md,
        fontWeight: 'bold',
        color: Colors.text,
    },
    actionSubtitle: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
    },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    column: {
        flex: 1,
        gap: Spacing.xs,
    },
    kycCard: {
        marginTop: Spacing.xl,
        borderWidth: 1,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
    },
    kycContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    kycIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    kycIconText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: FontSizes.lg,
    },
    kycLabel: {
        fontSize: FontSizes.xs,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    kycValue: {
        fontSize: FontSizes.xl,
        fontWeight: 'bold',
    },
});
