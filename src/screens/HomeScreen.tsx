import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  Dimensions,
  Alert,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import SearchBar from '../components/SearchBar';
import BannerCarousel from '../components/BannerCarousel';
import CategoryIcon from '../components/CategoryIcon';
import SectionHeader from '../components/SectionHeader';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { bannersApi, productsApi } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../constants/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────
// Fallback static categories (from API /categories)
// ─────────────────────────────────────────
const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Deals!', image: 'https://picsum.photos/id/1/120/120', isDome: true },
  { id: 2, name: 'Installments\n& Discounts', image: 'https://picsum.photos/id/20/120/120' },
  { id: 3, name: 'Shop & Win', image: 'https://picsum.photos/id/26/120/120' },
  { id: 4, name: "Men's Fashion", image: 'https://picsum.photos/id/64/120/120' },
  { id: 5, name: 'Brand Store', image: 'https://picsum.photos/id/96/120/120' },
  { id: 6, name: 'Coupon\nSavings', image: 'https://picsum.photos/id/60/120/120' },
];

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
const mapApiProduct = (p: any) => ({
  id: p.id,
  productId: p.id,
  name: p.name_en || p.name || 'Product',
  nameAr: p.name_ar || p.name_en || p.name,
  // Backend may return primary_image object OR images array
  image: p.primary_image?.url
    || p.primaryImage?.url
    || p.images?.[0]?.url
    || p.image
    || 'https://picsum.photos/id/1/200/200',
  price: parseFloat(p.price) || 0,
  originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
  discount: p.discount_percentage || 0,
  rating: parseFloat(p.rating || '0'),
  ratingCount: p.reviews_count || 0,
  isExpress: p.is_express || false,
  isFreeShipping: p.is_free_shipping || false,
  isBestSeller: p.is_best_seller || false,
  soldCount: p.sold_count ? String(p.sold_count) : undefined,
  slug: p.slug,
  storeName: p.seller?.store_name_en || p.store?.name || 'Safqa Store',
  reviews: p.reviews || [],
  description: p.description || p.description_en,
  stock: p.quantity_in_stock,
  specs: p.specifications ? Object.entries(p.specifications).map(([k, v]) => `${k}: ${v}`) : [],
  images: p.images?.map((img: any) => img.url || img) || [],
});

const API_STORAGE_URL = 'http://10.0.2.2:8000/storage/';

const mapApiBanner = (b: any) => ({
  id: b.id,
  // image_path is a relative storage path  e.g. "banners/abc.jpg"
  image: b.image_url
    || b.image
    || (b.image_path ? `${API_STORAGE_URL}${b.image_path}` : null),
  backgroundColor: '#1B5E20',
  title: b.title_en || b.title,
  link: b.link_url || b.link,
});

// ─────────────────────────────────────────
// HomeScreen
// ─────────────────────────────────────────
const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const addItem = useCartStore((state) => state.addItem);
  const { fetchWishlist } = useWishlistStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { language } = useSettingsStore();
  const tr = t(language);
  const isAr = language === 'ar';

  const [banners, setBanners] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // Only fetch wishlist if user is logged in (avoids 401)
      if (isLoggedIn) fetchWishlist();
      const [bannersRes, productsRes, categoriesRes] = await Promise.allSettled([
        bannersApi.list(),
        productsApi.list({ page: 1 }),
        productsApi.categories(),
      ]);

      if (bannersRes.status === 'fulfilled') {
        const data = bannersRes.value.data?.data || bannersRes.value.data || [];
        const mapped = Array.isArray(data)
          ? data.map(mapApiBanner).filter((b: any) => !!b.image)
          : [];
        setBanners(mapped);
      } else {
        setBanners([]);
      }

      if (productsRes.status === 'fulfilled') {
        // Laravel paginate() returns: { success, data: { data: [...], total, current_page } }
        const raw = productsRes.value.data;
        const items = raw?.data?.data || raw?.data || [];
        setProducts(Array.isArray(items) ? items.map(mapApiProduct) : []);
      }

      if (categoriesRes.status === 'fulfilled') {
        // Categories uses get() not paginate(): { success, data: [...] }
        const raw = categoriesRes.value.data;
        const data = raw?.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.slice(0, 8).map((c: any) => ({
            id: c.id,
            name: c.name_en || c.name || 'Category',
            nameAr: c.name_ar || c.name_en || c.name || 'فئة',
            image: c.image_url || c.image || 'https://picsum.photos/id/1/120/120',
          })));
        }
      }
    } catch (_) {
      // silently keep fallback data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isLoggedIn, language]); // Refetch when language toggles

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleCategoryPress = (cat: any) => {
    navigation.navigate('Categories', { categoryId: cat.id });
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      storeName: product.storeName,
      isExpress: product.isExpress || false,
      deliveryDate: 'Soon',
    });
    Alert.alert('✅ Added to Cart', `${product.name.substring(0, 35)}... added!`, [
      { text: 'OK' },
      { text: 'View Cart', onPress: () => navigation.navigate('Tabs', { screen: 'Cart' }) },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerInner, { paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 0) + 12 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="bag-handle" size={22} color="#FFF" />
            <Text style={styles.brandName}>Safqa</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.navigate('Wishlist')}>
              <Ionicons name="heart-outline" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>{tr('loading')}</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        >
          {/* Search Bar */}
          <SearchBar placeholder={isAr ? 'ابحث عن ساعة ذكية...' : 'Search Smart Watch'} />

          {/* Banner Carousel */}
          {banners.length > 0 && <BannerCarousel banners={banners} height={160} />}

          {/* Shop by Category */}
          <SectionHeader title={isAr ? 'تسوق حسب الفئة' : 'Shop by category'} showSeeAll onSeeAll={() => navigation.navigate('Categories')} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.categoriesScroll, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
            <View style={styles.categoriesColumn}>
              <View style={[styles.categoriesRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                {categories.slice(0, Math.ceil(categories.length / 2)).map((cat) => (
                  <CategoryIcon key={cat.id} name={isAr ? (cat.nameAr || cat.name) : cat.name} image={cat.image} isDome={cat.isDome} onPress={() => handleCategoryPress(cat)} />
                ))}
              </View>
              <View style={[styles.categoriesRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                {categories.slice(Math.ceil(categories.length / 2)).map((cat) => (
                  <CategoryIcon key={cat.id} name={isAr ? (cat.nameAr || cat.name) : cat.name} image={cat.image} isDome={cat.isDome} onPress={() => handleCategoryPress(cat)} />
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Recommended Products */}
          {products.length > 0 && (
            <>
              <SectionHeader title={isAr ? 'مُوصى به لك' : 'Recommended for you'} showSeeAll onSeeAll={() => navigation.navigate('Categories')} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.productsScroll, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                {products.map((product) => (
                  <View key={product.id} style={[styles.productCardWrapper, isAr ? { marginLeft: 10 } : { marginRight: 10 }]}>
                    <ProductCard
                      {...product}
                      onPress={() => handleProductPress(product)}
                      onFavorite={() => { }}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* No products fallback */}
          {products.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color="#DDD" />
              <Text style={styles.emptyText}>{isAr ? 'لا توجد منتجات بعد' : 'No products yet'}</Text>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary },
  headerInner: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: { fontSize: 26, fontWeight: '900', color: '#FFF', marginLeft: 8, letterSpacing: 1.5 },
  scrollView: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#AAA' },
  categoriesScroll: { paddingHorizontal: 8, paddingVertical: 4 },
  categoriesColumn: { flexDirection: 'column' },
  categoriesRow: { flexDirection: 'row', marginBottom: 8 },
  productsScroll: { paddingHorizontal: 12, paddingVertical: 6 },
  productCardWrapper: { width: 165, marginRight: 10 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 15, color: '#AAA' },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});

export default HomeScreen;
