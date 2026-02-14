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

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            router.replace('/(tabs)/dashboard');
        } else {
            Alert.alert('Login Failed', result.message);
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
                    <Text style={styles.title}>Africa Waste Solutions</Text>
                    <Text style={styles.subtitle}>Sustainable Waste Management</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!loading}
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!loading}
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => router.push('/register')}
                        disabled={loading}
                    >
                        <Text style={styles.linkText}>
                            Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
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
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    title: {
        fontSize: FontSizes.xxxl,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: Spacing.sm,
        textAlign: 'center',
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
        marginTop: Spacing.md,
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
