import { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/Colors';

export default function DashboardScreen() {
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
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>

            {/* User Stats */}
            <View style={styles.statsGrid}>
                <StatCard
                    icon="cube"
                    label="Supply Received"
                    value={stats?.supply_received || 0}
                    color={Colors.primary}
                />
                <StatCard
                    icon="swap-horizontal"
                    label="Distributed"
                    value={stats?.distributed || 0}
                    color={Colors.secondary}
                />
                <StatCard
                    icon="refresh"
                    label="Returned"
                    value={stats?.returned || 0}
                    color={Colors.success}
                />
                <StatCard
                    icon="wallet"
                    label="Balance"
                    value={stats?.balance || 0}
                    color={Colors.accent}
                />
            </View>

            {/* Admin Stats */}
            {isAdmin() && adminStats && (
                <>
                    <Text style={styles.sectionTitle}>System Overview</Text>
                    <View style={styles.statsGrid}>
                        <StatCard
                            icon="people"
                            label="Total Accounts"
                            value={adminStats.total_accounts || 0}
                            color={Colors.info}
                        />
                        <StatCard
                            icon="checkmark-circle"
                            label="Pending KYC"
                            value={adminStats.pending_kyc || 0}
                            color={Colors.warning}
                        />
                        <StatCard
                            icon="trending-up"
                            label="Global Recovery"
                            value={adminStats.global_recovery || 0}
                            color={Colors.success}
                        />
                        <StatCard
                            icon="pulse"
                            label="Node Status"
                            value={adminStats.node_status || '100%'}
                            color={Colors.primary}
                            isPercentage
                        />
                    </View>
                </>
            )}

            {/* KYC Status */}
            {stats?.kyc_status && (
                <View style={styles.kycCard}>
                    <View style={styles.kycHeader}>
                        <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
                        <Text style={styles.kycTitle}>KYC Status</Text>
                    </View>
                    <Text style={[
                        styles.kycStatus,
                        { color: stats.kyc_status === 'approved' ? Colors.success : Colors.warning }
                    ]}>
                        {stats.kyc_status.toUpperCase()}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

function StatCard({ icon, label, value, color, isPercentage }) {
    return (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <Ionicons name={icon} size={24} color={color} />
            <Text style={styles.statValue}>{isPercentage ? value : value.toLocaleString()}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: Colors.primary,
        padding: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    greeting: {
        fontSize: FontSizes.md,
        color: '#fff',
        opacity: 0.9,
    },
    userName: {
        fontSize: FontSizes.xxl,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: Spacing.xs,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: Spacing.md,
        gap: Spacing.md,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#fff',
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statValue: {
        fontSize: FontSizes.xxl,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: Spacing.sm,
    },
    statLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
        color: Colors.text,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    kycCard: {
        backgroundColor: '#fff',
        margin: Spacing.md,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    kycHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    kycTitle: {
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
        color: Colors.text,
        marginLeft: Spacing.sm,
    },
    kycStatus: {
        fontSize: FontSizes.xl,
        fontWeight: 'bold',
        marginTop: Spacing.xs,
    },
});
