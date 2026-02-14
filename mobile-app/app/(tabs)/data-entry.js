import { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    Platform,
    StatusBar as RNStatusBar,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import api from '../../services/api';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/Colors';

export default function DataEntryScreen() {
    const [loading, setLoading] = useState(false);
    const [transactionType, setTransactionType] = useState('supply');
    const [productGroup, setProductGroup] = useState('');
    const [productName, setProductName] = useState('');
    const [pin, setPin] = useState('');
    const [quantities, setQuantities] = useState({
        unit: '',
        dozen: '',
        half_dozen: '',
        case: '',
        series: '',
        level_16: '',
        level_10: '',
    });

    const [accounts, setAccounts] = useState([]);
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedTarget, setSelectedTarget] = useState('');

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const response = await api.accounts.getAll();
            setAccounts(response.data || []);
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    };

    const handleSubmit = async () => {
        if (!productGroup || !productName || !pin) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            const entryData = {
                transaction_type: transactionType,
                source_account_id: selectedSource || null,
                target_account_id: selectedTarget || null,
                pin,
                product_group: productGroup,
                product_name: productName,
                unit: parseInt(quantities.unit) || 0,
                dozen: parseInt(quantities.dozen) || 0,
                half_dozen: parseInt(quantities.half_dozen) || 0,
                case: parseInt(quantities.case) || 0,
                series: parseInt(quantities.series) || 0,
                level_16: parseInt(quantities.level_16) || 0,
                level_10: parseInt(quantities.level_10) || 0,
            };

            await api.entries.create(entryData);
            Alert.alert('Success', `${transactionType} recorded successfully!`);

            // Reset form
            setProductGroup('');
            setProductName('');
            setPin('');
            setQuantities({
                unit: '',
                dozen: '',
                half_dozen: '',
                case: '',
                series: '',
                level_16: '',
                level_10: '',
            });
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to submit entry');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>New Transaction</Text>
            </View>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Transaction Details</Text>
                    <View style={styles.card}>
                        <Text style={styles.label}>Transaction Type</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={transactionType}
                                onValueChange={setTransactionType}
                                style={styles.picker}
                            >
                                <Picker.Item label="Supply (Production)" value="supply" />
                                <Picker.Item label="Transfer (Dispatch)" value="transfer" />
                                <Picker.Item label="Return (Recovery)" value="return" />
                            </Picker>
                        </View>

                        {transactionType === 'supply' && (
                            <>
                                <Text style={styles.label}>Manufacturer</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedSource}
                                        onValueChange={setSelectedSource}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Select Manufacturer" value="" />
                                        {accounts
                                            .filter(acc => acc.account_type === 'manufacturer')
                                            .map(acc => (
                                                <Picker.Item key={acc.id} label={acc.name} value={acc.id} />
                                            ))}
                                    </Picker>
                                </View>
                            </>
                        )}

                        {transactionType === 'transfer' && (
                            <>
                                <Text style={styles.label}>From (Source)</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedSource}
                                        onValueChange={setSelectedSource}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Select Source" value="" />
                                        {accounts.map(acc => (
                                            <Picker.Item key={acc.id} label={acc.name} value={acc.id} />
                                        ))}
                                    </Picker>
                                </View>

                                <Text style={styles.label}>To (Target)</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedTarget}
                                        onValueChange={setSelectedTarget}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Select Target" value="" />
                                        {accounts.map(acc => (
                                            <Picker.Item key={acc.id} label={acc.name} value={acc.id} />
                                        ))}
                                    </Picker>
                                </View>
                            </>
                        )}

                        {transactionType === 'return' && (
                            <>
                                <Text style={styles.label}>Household</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedSource}
                                        onValueChange={setSelectedSource}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Select Household" value="" />
                                        {accounts
                                            .filter(acc => acc.account_type === 'household')
                                            .map(acc => (
                                                <Picker.Item key={acc.id} label={acc.name} value={acc.id} />
                                            ))}
                                    </Picker>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Product Information</Text>
                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Product Group *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Plastic Bottles"
                                value={productGroup}
                                onChangeText={setProductGroup}
                                placeholderTextColor={Colors.textLight}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Product Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., PET 500ml"
                                value={productName}
                                onChangeText={setProductName}
                                placeholderTextColor={Colors.textLight}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Quantities</Text>
                    <View style={styles.card}>
                        <View style={styles.quantityRow}>
                            <View style={styles.quantityInput}>
                                <Text style={styles.label}>Units</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={quantities.unit}
                                    onChangeText={(val) => setQuantities({ ...quantities, unit: val })}
                                    placeholderTextColor={Colors.textLight}
                                />
                            </View>
                            <View style={styles.quantityInput}>
                                <Text style={styles.label}>Dozen</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={quantities.dozen}
                                    onChangeText={(val) => setQuantities({ ...quantities, dozen: val })}
                                    placeholderTextColor={Colors.textLight}
                                />
                            </View>
                        </View>

                        <View style={styles.quantityRow}>
                            <View style={styles.quantityInput}>
                                <Text style={styles.label}>Half Dozen</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={quantities.half_dozen}
                                    onChangeText={(val) => setQuantities({ ...quantities, half_dozen: val })}
                                    placeholderTextColor={Colors.textLight}
                                />
                            </View>
                            <View style={styles.quantityInput}>
                                <Text style={styles.label}>Case</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={quantities.case}
                                    onChangeText={(val) => setQuantities({ ...quantities, case: val })}
                                    placeholderTextColor={Colors.textLight}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Authorization</Text>
                    <View style={styles.card}>
                        <Text style={styles.label}>PIN *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your 4-digit PIN"
                            value={pin}
                            onChangeText={setPin}
                            secureTextEntry
                            keyboardType="numeric"
                            maxLength={4}
                            placeholderTextColor={Colors.textLight}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
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
                            <Text style={styles.buttonText}>Submit Transaction</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
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
        padding: Spacing.lg,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: FontSizes.xl,
        fontWeight: 'bold',
        color: Colors.text,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    contentContainer: {
        padding: Spacing.lg,
    },
    sectionContainer: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSizes.sm,
        fontWeight: '700',
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    label: {
        fontSize: FontSizes.sm,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: FontSizes.md,
        backgroundColor: Colors.background,
        color: Colors.text,
    },
    inputGroup: {
        marginBottom: Spacing.md,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.background,
        overflow: 'hidden',
        marginBottom: Spacing.md,
    },
    picker: {
        height: 50,
        color: Colors.text,
    },
    quantityRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    quantityInput: {
        flex: 1,
    },
    button: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginTop: Spacing.md,
        elevation: 4,
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
});
