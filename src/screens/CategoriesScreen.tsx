import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import SearchBar from '../components/SearchBar';
import MainHeader from '../components/MainHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { productsApi } from '../services/api';
import { useWishlistStore } from '../store/wishlistStore';
import { useSettingsStore } from '../store/settingsStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 8;
const CARD_PADDING = 16;
const CARD_WIDTH = Math.floor((SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP * 2) / 3);

// ── Helpers ──
const mapApiProduct = (p: any) => ({
  id: p.id,
  productId: p.id,
  name: p.name_en || p.name || 'Product',
  nameAr: p.name_ar || p.name_en || p.name,
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
  description: p.description || p.description_en,
  brand: p.brand?.name || undefined,
  stock: p.quantity_in_stock || undefined,
  specs: p.specifications ? Object.entries(p.specifications).map(([k, v]) => `${k}: ${v}`) : [],
  deliveryDate: 'Soon', // TODO: compute based on real logic
  coupon: undefined,
  images: p.images?.map((img: any) => img.url || img) || [],
});

// ══════════════════════════════
// ── Product Card Component ──
// ══════════════════════════════
const ProductCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { language } = useSettingsStore();
  const isAr = language === 'ar';
  const isFav = isInWishlist(item.id);
  const displayName = isAr ? (item.nameAr || item.name) : item.name;

  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <TouchableOpacity style={pStyles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={pStyles.imageSection}>
        <Image source={{ uri: item.image }} style={pStyles.productImage} resizeMode="contain" />
        <TouchableOpacity style={pStyles.heartBtn} onPress={() => toggleWishlist(item.id)}>
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? '#E53935' : '#999'} />
        </TouchableOpacity>
      </View>
      <View style={pStyles.infoSection}>
        <Text style={pStyles.productName} numberOfLines={2}>{displayName}</Text>
        {item.specs && item.specs.length > 0 && (
          <View style={pStyles.specsRow}>
            {item.specs.slice(0, 2).map((spec: string, i: number) => (
              <Text key={i} style={pStyles.specText} numberOfLines={1}>{spec}</Text>
            ))}
          </View>
        )}
        <View style={pStyles.priceRow}>
          <Text style={pStyles.currency}>EGP </Text>
          <Text style={pStyles.price}>{item.price.toLocaleString()}</Text>
        </View>
        {item.originalPrice && (
          <View style={pStyles.discountRow}>
            <Text style={pStyles.originalPrice}>{item.originalPrice.toLocaleString()}</Text>
            <Text style={pStyles.discountBadgeText}>{discount}% OFF</Text>
          </View>
        )}
        {item.isFreeShipping && (
          <View style={pStyles.deliveryRow}>
            <MaterialCommunityIcons name="truck-fast" size={14} color="#00796B" />
            <Text style={pStyles.freeDeliveryText}>Free Delivery</Text>
          </View>
        )}
        {item.coupon && (
          <View style={pStyles.couponBadge}>
            <Text style={pStyles.couponText}>{item.coupon}</Text>
          </View>
        )}
        {item.isExpress && (
          <View style={pStyles.expressRow}>
            <View style={pStyles.expressBadge}>
              <Text style={pStyles.expressTextSmall}>express</Text>
            </View>
            <Text style={pStyles.deliveryDateText}>{isAr ? 'إكسبريس' : 'express'} <Text style={{ fontWeight: '700' }}>{item.deliveryDate}</Text></Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ══════════════════════════════
// ── Main Screen ──
// ══════════════════════════════
const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { language } = useSettingsStore();
  const isAr = language === 'ar';

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Initial load of categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productsApi.categories();
        // Categories endpoint uses get() not paginate() so it's: { success, data: [...] }
        const raw = res.data;
        const data = raw?.data || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Failed to fetch categories', err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

  // Handle categoryId param from HomeScreen navigation
  useEffect(() => {
    if (route.params?.categoryId) {
      setSelectedCategory(route.params.categoryId);
      // Clear the param so it doesn't persist on tab re-focus
      navigation.setParams({ categoryId: undefined });
    }
  }, [route.params?.categoryId]);

  // Fetch products when category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchCategoryProducts = async () => {
        setLoadingProducts(true);
        try {
          const res = await productsApi.list({ category_id: selectedCategory, page: 1 });
          // Products use paginate() so items are at response.data.data.data
          const raw = res.data;
          const items = raw?.data?.data || raw?.data || [];
          setProducts(Array.isArray(items) ? items.map(mapApiProduct) : []);
        } catch (err) {
          console.warn('Failed to fetch category products', err);
          setProducts([]);
        } finally {
          setLoadingProducts(false);
        }
      };
      fetchCategoryProducts();
    }
  }, [selectedCategory]);

  const getCategoryName = () => {
    const cat = categories.find(c => c.id === selectedCategory);
    if (!cat) return '';
    return isAr
      ? (cat.name_ar || cat.name_en || cat.name || '').replace('\n', ' ')
      : (cat.name_en || cat.name || '').replace('\n', ' ');
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', { product });
  };

  // ── Product List View ──
  if (selectedCategory) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <MainHeader />
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.expressFilterTag}>
            <View style={styles.filterCheckbox} />
            <Text style={styles.expressFilterText}>{isAr ? 'إكسبريس' : 'express'}</Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <TouchableOpacity style={styles.filterPill}>
              <Text style={styles.filterPillText}>{isAr ? 'السعر' : 'Price'}</Text>
              <Ionicons name="chevron-down" size={14} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterPill}>
              <Text style={styles.filterPillText}>{isAr ? 'الماركة' : 'Brand'}</Text>
              <Ionicons name="chevron-down" size={14} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterPill}>
              <Text style={styles.filterPillText}>{isAr ? 'التقييم' : 'Rating'}</Text>
              <Ionicons name="chevron-down" size={14} color="#666" />
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.categoryLabel}>
          <Text style={styles.categoryLabelText}>{getCategoryName()}</Text>
          <Text style={styles.resultCount}>
            {loadingProducts ? '...' : products.length} {isAr ? 'نتيجة' : 'results'}
          </Text>
        </View>

        {loadingProducts ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>{isAr ? 'لا توجد منتجات في هذه الفئة' : 'No products in this category'}</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ProductCard item={item} onPress={() => handleProductPress(item)} />}
            contentContainerStyle={styles.productList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={<View style={{ height: 80 }} />}
          />
        )}

        <View style={styles.floatingBar}>
          <TouchableOpacity style={styles.floatingButton}>
            <Text style={styles.floatingText}>{isAr ? 'ترتيب' : 'Sort'}</Text>
            <Ionicons name="swap-vertical" size={16} color={COLORS.white} />
            <View style={styles.floatingDivider} />
            <Text style={styles.floatingText}>{isAr ? 'تصفية' : 'Filter'}</Text>
            <Ionicons name="filter" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Category Grid View ──
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <MainHeader />
      <View style={styles.searchWrap}>
        <SearchBar placeholder={isAr ? 'عن ماذا تبحث؟' : 'What are you looking for?'} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{isAr ? 'الفئات' : 'Categories'}</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContent}>
        {loadingCats ? (
          <View style={[styles.loadingContainer, { marginTop: 40 }]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : categories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{isAr ? 'لا توجد فئات متاحة' : 'No categories available'}</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard} activeOpacity={0.8} onPress={() => setSelectedCategory(category.id)}>
                <View style={styles.categoryImageWrapper}>
                  <Image source={{ uri: category.image_url || category.image || 'https://picsum.photos/id/1/200/200' }} style={styles.categoryImage} resizeMode="contain" />
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {isAr ? (category.name_ar || category.name_en || category.name) : (category.name_en || category.name)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

// ═══════════════════════════════════
// ── Styles ──
// ═══════════════════════════════════

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: '#999' },
  searchWrap: { backgroundColor: COLORS.white, paddingBottom: 4 },
  titleContainer: { paddingHorizontal: 16, paddingBottom: 10, paddingTop: 4 },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  scrollView: { flex: 1 },
  gridContent: { paddingHorizontal: CARD_PADDING },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: { width: CARD_WIDTH, marginBottom: 16, alignItems: 'center' },
  categoryImageWrapper: { width: CARD_WIDTH, height: CARD_WIDTH, borderRadius: 16, backgroundColor: '#FAFAFA', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  categoryImage: { width: '70%', height: '70%' },
  categoryName: { fontSize: 13, fontWeight: '600', color: '#333', marginTop: 8, textAlign: 'center', paddingHorizontal: 4 },
  filterRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: '#FFF' },
  expressFilterTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5E5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 12, borderWidth: 1, borderColor: '#FFE0B2' },
  filterCheckbox: { width: 14, height: 14, borderRadius: 4, borderWidth: 1.5, borderColor: '#F57C00', marginRight: 6 },
  expressFilterText: { fontSize: 12, fontWeight: '800', color: '#F57C00', fontStyle: 'italic' },
  filterPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E8E8E8' },
  filterPillText: { fontSize: 13, fontWeight: '600', color: '#444', marginRight: 4 },
  categoryLabel: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  categoryLabelText: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  resultCount: { fontSize: 13, color: '#888', fontWeight: '500', marginBottom: 2 },
  productList: { paddingBottom: 20 },
  separator: { height: 8, backgroundColor: '#F5F5F5' },
  floatingBar: { position: 'absolute', bottom: 20, alignSelf: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
  floatingButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30, gap: 8 },
  floatingText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  floatingDivider: { width: 1, height: 16, backgroundColor: '#444', marginHorizontal: 8 },
});

const pStyles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 16, backgroundColor: '#FFF' },
  imageSection: { position: 'relative', width: 110, height: 130, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 8 },
  productImage: { width: '100%', height: '100%' },
  heartBtn: { position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  infoSection: { flex: 1, paddingLeft: 12, justifyContent: 'center' },
  productName: { fontSize: 15, fontWeight: '500', color: '#1A1A1A', lineHeight: 22, paddingRight: 10 },
  specsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  specText: { fontSize: 11, color: '#666', backgroundColor: '#F0F0F0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  currency: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  price: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  discountRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  originalPrice: { fontSize: 13, color: '#999', textDecorationLine: 'line-through' },
  discountBadgeText: { fontSize: 11, fontWeight: '700', color: '#2E7D32', backgroundColor: '#E8F5E9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  freeDeliveryText: { fontSize: 12, color: '#00796B', fontWeight: '600' },
  couponBadge: { alignSelf: 'flex-start', borderWidth: 1, borderColor: '#FFC107', borderStyle: 'dashed', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#FFFDE7', marginTop: 6 },
  couponText: { fontSize: 11, fontWeight: '700', color: '#F57F17' },
  expressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  expressBadge: { backgroundColor: COLORS.primary, borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2 },
  expressTextSmall: { fontSize: 10, fontWeight: '800', color: '#FFF', fontStyle: 'italic' },
  deliveryDateText: { fontSize: 11, color: '#666' },
});

export default CategoriesScreen;
