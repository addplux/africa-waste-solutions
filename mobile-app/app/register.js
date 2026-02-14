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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join Africa Waste Solutions</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Full Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChangeText={(val) => setFormData({ ...formData, name: val })}
                        editable={!loading}
                    />

                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={formData.email}
                        onChangeText={(val) => setFormData({ ...formData, email: val })}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!loading}
                    />

                    <Text style={styles.label}>Contact Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your contact number"
                        value={formData.contact}
                        onChangeText={(val) => setFormData({ ...formData, contact: val })}
                        keyboardType="phone-pad"
                        editable={!loading}
                    />

                    <Text style={styles.label}>Area</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your area"
                        value={formData.area}
                        onChangeText={(val) => setFormData({ ...formData, area: val })}
                        editable={!loading}
                    />

                    <Text style={styles.label}>Plot Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your plot number"
                        value={formData.plot_number}
                        onChangeText={(val) => setFormData({ ...formData, plot_number: val })}
                        editable={!loading}
                    />

                    <Text style={styles.label}>Password *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter password (min 6 characters)"
                        value={formData.password}
                        onChangeText={(val) => setFormData({ ...formData, password: val })}
                        secureTextEntry
                        editable={!loading}
                    />

                    <Text style={styles.label}>Confirm Password *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChangeText={(val) => setFormData({ ...formData, confirmPassword: val })}
                        secureTextEntry
                        editable={!loading}
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Create Account</Text>
                        )}
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    scrollContent: {
        flexGrow: 1,
        padding: Spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginTop: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSizes.xxxl,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: FontSizes.md,
        color: '#fff',
        opacity: 0.9,
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
    },
    label: {
        fontSize: FontSizes.md,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.sm,
        marginTop: Spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: FontSizes.md,
        backgroundColor: Colors.surface,
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
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
});
