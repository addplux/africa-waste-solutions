import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function AccountsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Accounts Management</Text>
            <Text style={styles.subtitle}>Admin Only - Coming soon...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: FontSizes.xxl,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
    },
});
