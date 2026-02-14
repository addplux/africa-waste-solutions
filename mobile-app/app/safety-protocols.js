import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar as RNStatusBar,
    LayoutAnimation,
    UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/Colors';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function SafetyProtocolsScreen() {
    const router = useRouter();
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const protocols = [
        {
            id: 'handling',
            title: 'Handling & Sorting',
            icon: 'hand-left-outline',
            color: Colors.info,
            content: [
                'Always wear protective gloves when sorting waste materials.',
                'Separate items into distinct categories (plastic, metal, paper, glass) immediately upon receipt.',
                'Avoid direct contact with sharp objects or broken glass; use tongs or improved protective gear.',
                'Wash hands thoroughly after every handling session.',
            ],
        },
        {
            id: 'storage',
            title: 'Storage Guidelines',
            icon: 'cube-outline',
            color: Colors.primary,
            content: [
                'Store organic waste in sealed containers to prevent odors and pests.',
                'Keep paper and cardboard dry and away from open flames.',
                'Ensure chemical or hazardous waste is clearly labeled and stored separately.',
                'Maintain clear pathways in storage areas to prevent tripping hazards.',
            ],
        },
        {
            id: 'emergency',
            title: 'Emergency Procedures',
            icon: 'warning-outline',
            color: Colors.error,
            content: [
                'In case of chemical spill, evacuate the area and notify the supervisor immediately.',
                'For cuts or injuries, apply first aid and seek medical attention if necessary.',
                'Know the location of the nearest fire extinguisher and emergency exit.',
                'Report any unsafe conditions or equipment malfunctions to management.',
            ],
        },
        {
            id: 'ppe',
            title: 'Personal Protective Equipment',
            icon: 'shield-checkmark-outline',
            color: Colors.success,
            content: [
                'High-visibility vests must be worn in active loading zones.',
                'Safety boots are required in all processing areas.',
                'Respiratory protection should be used when dealing with dusty or volatile materials.',
                'Eye protection is mandatory when operating machinery.',
            ],
        },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Safety Protocols</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.introContainer}>
                    <Ionicons name="shield-half" size={48} color={Colors.primary} style={styles.introIcon} />
                    <Text style={styles.introTitle}>Safety First</Text>
                    <Text style={styles.introText}>
                        Adhere to these guidelines to ensure a safe and efficient working environment for everyone.
                    </Text>
                </View>

                {protocols.map((section) => (
                    <View key={section.id} style={styles.sectionCard}>
                        <TouchableOpacity
                            style={[
                                styles.sectionHeader,
                                expandedSections[section.id] && styles.sectionHeaderActive,
                            ]}
                            onPress={() => toggleSection(section.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.headerLeft}>
                                <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
                                    <Ionicons name={section.icon} size={24} color={section.color} />
                                </View>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                            </View>
                            <Ionicons
                                name={expandedSections[section.id] ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={Colors.textSecondary}
                            />
                        </TouchableOpacity>

                        {expandedSections[section.id] && (
                            <View style={styles.sectionContent}>
                                {section.content.map((item, index) => (
                                    <View key={index} style={styles.bulletPoint}>
                                        <View style={[styles.bullet, { backgroundColor: section.color }]} />
                                        <Text style={styles.bulletText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}

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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backButton: {
        padding: Spacing.sm,
    },
    headerTitle: {
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
        color: Colors.text,
    },
    contentContainer: {
        padding: Spacing.lg,
    },
    introContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        marginTop: Spacing.md,
    },
    introIcon: {
        marginBottom: Spacing.md,
    },
    introTitle: {
        fontSize: FontSizes.xxl,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    introText: {
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    sectionHeaderActive: {
        backgroundColor: '#f9fafb',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: FontSizes.md,
        fontWeight: '600',
        color: Colors.text,
    },
    sectionContent: {
        padding: Spacing.md,
        paddingTop: 0,
        backgroundColor: '#f9fafb',
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: Spacing.md,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 8,
        marginRight: Spacing.md,
    },
    bulletText: {
        flex: 1,
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
});
