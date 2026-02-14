import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSizes } from '../constants/Colors';

export default function GradientCard({
    title,
    value,
    subtitle,
    icon,
    gradientColors,
    shadowColor,
    onPress
}) {
    const CardContent = (
        <LinearGradient
            colors={['#ffffff', '#ffffff']} // Keep white background for content part if needed, or transparent
            style={styles.cardInner}
        >
            <View style={[styles.container, { shadowColor: shadowColor || '#000' }]}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <LinearGradient
                            colors={gradientColors || Colors.gradients.primary}
                            style={[styles.iconContainer, { shadowColor: gradientColors?.[0] || Colors.primary }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name={icon} size={24} color="#fff" />
                        </LinearGradient>
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.value}>{value}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>

                {/* Decorative background blob */}
                <View style={[styles.blob, { backgroundColor: gradientColors?.[0] || Colors.primary }]} />
            </View>
        </LinearGradient>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                {CardContent}
            </TouchableOpacity>
        );
    }

    return CardContent;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginVertical: Spacing.sm,
        overflow: 'hidden',
        position: 'relative',
        // Shadow styles
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    content: {
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    title: {
        fontSize: FontSizes.xs,
        fontWeight: '700',
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: FontSizes.xxxl,
        fontWeight: '900',
        color: Colors.text,
        marginTop: Spacing.xs,
    },
    subtitle: {
        fontSize: FontSizes.xs,
        fontWeight: '700',
        marginTop: Spacing.sm,
    },
    blob: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        opacity: 0.1,
        transform: [{ scale: 1.5 }],
    },
});
