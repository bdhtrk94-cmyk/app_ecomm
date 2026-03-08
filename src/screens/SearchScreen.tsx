import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Platform,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { productsApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useSettingsStore } from '../store/settingsStore';
import { t } from '../constants/i18n';

const SearchScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { language } = useSettingsStore();
    const tr = t(language);
    const isAr = language === 'ar';

    const performSearch = useCallback(async (text: string) => {
        if (!text.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const response = await productsApi.list({ search: text });
            // Laravel paginate() returns: { success: true, data: { data: [...], total, ... } }
            // Or simplified: { success: true, data: [...] }
            const raw = response.data;
            const items = raw?.data?.data || raw?.data || [];
            setResults(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            performSearch(query);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, performSearch]);

    const renderItem = ({ item }: { item: any }) => {
        const mappedProduct = {
            id: item.id,
            productId: item.id,
            name: item.name_en || item.name || 'Product',
            nameAr: item.name_ar || item.name_en || item.name,
            image: item.primary_image?.url || item.images?.[0]?.url || item.image || 'https://via.placeholder.com/150',
            price: parseFloat(item.price) || 0,
            originalPrice: item.old_price || (item.original_price ? parseFloat(item.original_price) : undefined),
            discount: item.discount_percentage || item.discount || 0,
            rating: parseFloat(item.rating || '0'),
            ratingCount: item.reviews_count || 0,
            isExpress: item.is_express || false,
            slug: item.slug,
        };

        return (
            <View style={styles.cardContainer}>
                <ProductCard
                    {...mappedProduct}
                    onPress={() => navigation.navigate('ProductDetail', { product: mappedProduct })}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* Search Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name={isAr ? 'arrow-forward' : 'arrow-back'}
                        size={24}
                        color={COLORS.textPrimary}
                    />
                </TouchableOpacity>

                <View style={styles.inputWrapper}>
                    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={[styles.input, { textAlign: isAr ? 'right' : 'left' }]}
                        placeholder={isAr ? 'عن ماذا تبحث؟' : 'What are you looking for?'}
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#CCC" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : results.length > 0 ? (
                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            ) : query.trim().length > 0 ? (
                <View style={styles.center}>
                    <Ionicons name="search-outline" size={64} color="#EEE" />
                    <Text style={styles.emptyText}>
                        {isAr ? 'لا توجد نتائج لهذا البحث' : 'No results found for this search'}
                    </Text>
                </View>
            ) : (
                <View style={styles.center}>
                    <Ionicons name="search-outline" size={64} color="#F5F5F5" />
                    <Text style={styles.hintText}>
                        {isAr ? 'ابدأ البحث عن منتجاتك المفضلة' : 'Start searching for your favorite products'}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 50 : 15,
        paddingHorizontal: 16,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#FFF',
    },
    backBtn: {
        padding: 8,
        marginRight: 8,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 45,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textPrimary,
        paddingVertical: 0,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    listContent: {
        padding: 12,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    cardContainer: {
        width: '48%',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    hintText: {
        marginTop: 16,
        fontSize: 14,
        color: '#AAA',
        textAlign: 'center',
    },
});

export default SearchScreen;
