import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/Colors';

export default function RegisterScreen() {
    const router = useRouter();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contact: '',
        area: '',
        plot_number: '',
        account_type: 'household',
    });
    const [loading, setLoading] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const handleRegister = async () => {
        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        // Create FormData for registration
        const registrationData = new FormData();
        registrationData.append('name', formData.name);
        registrationData.append('email', formData.email);
        registrationData.append('password', formData.password);
        registrationData.append('contact', formData.contact);
        registrationData.append('area', formData.area);
        registrationData.append('plot_number', formData.plot_number);
        registrationData.append('account_type', formData.account_type);
        registrationData.append('kyc_status', 'pending');
        registrationData.append('is_international', 'false');

        const result = await register(registrationData);
        setLoading(false);

        if (result.success) {
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)/dashboard') }
            ]);
        } else {
            Alert.alert('Registration Failed', result.message);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join Africa Waste Solutions</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name *</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={Colors.textLight}
                                    value={formData.name}
                                    onChangeText={(val) => setFormData({ ...formData, name: val })}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email *</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor={Colors.textLight}
                                    value={formData.email}
                                    onChangeText={(val) => setFormData({ ...formData, email: val })}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
                                <Text style={styles.label}>Contact</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="call-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Phone"
                                        placeholderTextColor={Colors.textLight}
                                        value={formData.contact}
                                        onChangeText={(val) => setFormData({ ...formData, contact: val })}
                                        keyboardType="phone-pad"
                                        editable={!loading}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
                                <Text style={styles.label}>Area</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="location-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Area"
                                        placeholderTextColor={Colors.textLight}
                                        value={formData.area}
                                        onChangeText={(val) => setFormData({ ...formData, area: val })}
                                        editable={!loading}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Plot Number</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="home-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter plot number"
                                    placeholderTextColor={Colors.textLight}
                                    value={formData.plot_number}
                                    onChangeText={(val) => setFormData({ ...formData, plot_number: val })}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password *</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Min 6 characters"
                                    placeholderTextColor={Colors.textLight}
                                    value={formData.password}
                                    onChangeText={(val) => setFormData({ ...formData, password: val })}
                                    secureTextEntry={secureTextEntry}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password *</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm password"
                                    placeholderTextColor={Colors.textLight}
                                    value={formData.confirmPassword}
                                    onChangeText={(val) => setFormData({ ...formData, confirmPassword: val })}
                                    secureTextEntry={secureTextEntry}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={Colors.gradients.primary}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.linkButton}
                            onPress={() => router.back()}
                            disabled={loading}
                        >
                            <Text style={styles.linkText}>
                                Already have an account? <Text style={styles.linkTextBold}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Africa Waste Solutions © 2026</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '30%',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: Spacing.lg,
        paddingTop: Platform.OS === 'android' ? 40 : Spacing.lg,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        marginBottom: Spacing.md,
    },
    header: {
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: FontSizes.xxxl,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: FontSizes.md,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    row: {
        flexDirection: 'row',
    },
    inputGroup: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: FontSizes.sm,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
        marginLeft: Spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        height: 50,
    },
    inputIcon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: FontSizes.md,
        color: Colors.text,
        height: '100%',
    },
    button: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginTop: Spacing.md,
        elevation: 2,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonGradient: {
        paddingVertical: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: Spacing.lg,
        alignItems: 'center',
    },
    linkText: {
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
    },
    linkTextBold: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: Spacing.xl,
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    footerText: {
        color: Colors.textLight,
        fontSize: FontSizes.xs,
    },
});
