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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
        <ScrollView style={styles.container}>
            <View style={styles.form}>
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

                <Text style={styles.label}>Product Group *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Plastic Bottles"
                    value={productGroup}
                    onChangeText={setProductGroup}
                />

                <Text style={styles.label}>Product Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., PET 500ml"
                    value={productName}
                    onChangeText={setProductName}
                />

                <Text style={styles.sectionTitle}>Quantities</Text>

                <View style={styles.quantityRow}>
                    <View style={styles.quantityInput}>
                        <Text style={styles.label}>Units</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            keyboardType="numeric"
                            value={quantities.unit}
                            onChangeText={(val) => setQuantities({ ...quantities, unit: val })}
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
                        />
                    </View>
                </View>

                <Text style={styles.label}>PIN *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your PIN"
                    value={pin}
                    onChangeText={setPin}
                    secureTextEntry
                    keyboardType="numeric"
                    maxLength={4}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Submit Entry</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    form: {
        padding: Spacing.md,
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
        backgroundColor: '#fff',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    quantityRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    quantityInput: {
        flex: 1,
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        alignItems: 'center',
        marginTop: Spacing.xl,
        marginBottom: Spacing.xxl,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
    },
});
