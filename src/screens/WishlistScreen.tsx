import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Alert,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { wishlistApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { t } from '../constants/i18n';

const WishlistScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isLoggedIn = useAuthStore(s => s.isLoggedIn);
    const { toggleWishlist } = useWishlistStore();
    const addItem = useCartStore((state) => state.addItem);
    const { language } = useSettingsStore();
    const tr = t(language);
    const isAr = language === 'ar';

    const fetchFullWishlist = async () => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await wishlistApi.get();
            const items = res.data?.data || res.data || [];
            setWishlistItems(Array.isArray(items) ? items : []);
        } catch (err) {
            console.warn('Failed to fetch full wishlist items', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFullWishlist();
    }, [isLoggedIn]);

    const handleRemove = async (productId: number) => {
        // Optimistic remove
        setWishlistItems(prev => prev.filter(i => i.product_id !== productId));
        await toggleWishlist(productId);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!isLoggedIn) {
        return (
            <View style={styles.center}>
                <Ionicons name="heart-dislike-outline" size={60} color="#CCC" />
                <Text style={styles.emptyText}>Please log in to view your wishlist.</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginBtnText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { marginRight: isAr ? 0 : 15, marginLeft: isAr ? 15 : 0 }]}>
                    <Ionicons name={isAr ? 'arrow-forward' : 'arrow-back'} size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{tr('wishlist')}</Text>
            </View>

            {wishlistItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={64} color="#CCC" />
                    <Text style={styles.emptyText}>{tr('wishlistEmpty')}</Text>
                </View>
            ) : (
                <FlatList
                    data={wishlistItems}
                    keyExtractor={(item, idx) => `wishlist-${item.id || idx}`}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
                    contentContainerStyle={{ paddingVertical: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const product = item.product;
                        if (!product) return null;

                        const mappedProduct = {
                            id: product.id,
                            name: product.name_en || product.name,
                            nameAr: product.name_ar || product.name_en || product.name,
                            image: product.primary_image?.url || product.image || 'https://picsum.photos/200',
                            price: parseFloat(product.price) || 0,
                            originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
                            discount: product.discount_percentage || 0,
                            rating: parseFloat(product.rating || '0'),
                            ratingCount: product.reviews_count || 0,
                            isExpress: product.is_express || false,
                            isFreeShipping: product.is_free_shipping || false,
                            storeName: product.seller?.store_name_en || product.store?.name || 'Safqa Store',
                        };

                        return (
                            <View style={{ width: '48%', marginBottom: 16 }}>
                                <ProductCard
                                    {...mappedProduct}
                                    onPress={() => navigation.navigate('ProductDetail', { product: mappedProduct })}
                                    onFavorite={() => handleRemove(product.id)}
                                    onAddToCart={() => {
                                        addItem({ ...mappedProduct, productId: mappedProduct.id });
                                        Alert.alert(
                                            tr('addedToCart'),
                                            `${mappedProduct.name.substring(0, 35)}...`,
                                            [
                                                { text: tr('ok') },
                                                { text: tr('viewCart'), onPress: () => navigation.navigate('Tabs', { screen: 'Cart' }) },
                                            ]
                                        );
                                    }}
                                />
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backBtn: { marginRight: 15 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
    emptyText: { marginTop: 15, fontSize: 16, color: '#888', fontWeight: '500' },
    loginBtn: {
        marginTop: 20,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    loginBtnText: { color: '#FFF', fontWeight: 'bold' },
});

export default WishlistScreen;
