import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function ReportsScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Reports & Analytics</Text>
                <Text style={styles.subtitle}>Coming soon...</Text>
                <Text style={styles.description}>
                    This section will display detailed reports, charts, and analytics about waste management activities.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
    },
    title: {
        fontSize: FontSizes.xxl,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: FontSizes.lg,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    description: {
        fontSize: FontSizes.md,
        color: Colors.textLight,
        textAlign: 'center',
        lineHeight: 24,
    },
});
