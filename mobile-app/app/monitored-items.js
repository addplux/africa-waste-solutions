import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Platform,
    StatusBar as RNStatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import api from '../services/api';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/Colors';

export default function MonitoredItemsScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = products.filter(
                (product) =>
                    product.name?.toLowerCase().includes(lowerCaseQuery) ||
                    product.category?.toLowerCase().includes(lowerCaseQuery) ||
                    product.description?.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchQuery, products]);

    const loadProducts = async () => {
        try {
            const response = await api.products.getAll();
            // detailed response logging
            console.log('Product API Response:', JSON.stringify(response, null, 2));

            // Handle different response structures
            let productList = [];
            if (Array.isArray(response)) {
                productList = response;
            } else if (response && Array.isArray(response.data)) {
                productList = response.data;
            } else if (response && Array.isArray(response.products)) {
                productList = response.products;
            }

            setProducts(productList);
            setFilteredProducts(productList);
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback for demo/dev if API fails or is empty
            if (__DEV__) {
                setProducts(MOCK_PRODUCTS);
                setFilteredProducts(MOCK_PRODUCTS);
            }
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Ionicons
                    name={getIconForCategory(item.category)}
                    size={24}
                    color={Colors.primary}
                />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.category}>{item.category || 'General'}</Text>
                {item.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {item.description}
                    </Text>
                )}
            </View>
            <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Monitored Items</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.textLight} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor={Colors.textLight}
                />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>No items found</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

// Helper to pick icons based on category
const getIconForCategory = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('plastic')) return 'cube-outline';
    if (cat.includes('metal')) return 'hammer-outline';
    if (cat.includes('glass')) return 'beer-outline';
    if (cat.includes('paper')) return 'document-text-outline';
    if (cat.includes('organic')) return 'leaf-outline';
    return 'cube-outline';
};

const MOCK_PRODUCTS = [
    { id: 1, name: 'PET Bottles', category: 'Plastic', description: 'Clear plastic bottles (water/soda).' },
    { id: 2, name: 'HDPE Containers', category: 'Plastic', description: 'Milk jugs, detergent bottles.' },
    { id: 3, name: 'Aluminum Cans', category: 'Metal', description: 'Soda and beer cans.' },
    { id: 4, name: 'Cardboard', category: 'Paper', description: 'Corrugated cardboard boxes.' },
    { id: 5, name: 'Glass Bottles', category: 'Glass', description: 'Clear, green, and brown glass.' },
];

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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        height: 50,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: FontSizes.md,
        color: Colors.text,
        height: '100%',
    },
    listContent: {
        padding: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyText: {
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    cardContent: {
        flex: 1,
    },
    productName: {
        fontSize: FontSizes.md,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 2,
    },
    category: {
        fontSize: FontSizes.sm,
        fontWeight: '600',
        color: Colors.primary,
        marginBottom: 2,
    },
    description: {
        fontSize: FontSizes.xs,
        color: Colors.textLight,
    },
    statusContainer: {
        marginLeft: Spacing.sm,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});
