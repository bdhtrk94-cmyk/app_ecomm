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
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import SearchBar from '../components/SearchBar';
import MainHeader from '../components/MainHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { productsApi } from '../services/api';
import { useWishlistStore } from '../store/wishlistStore';
import { useSettingsStore } from '../store/settingsStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
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
  brand: p.brand?.name || p.brand?.name_en || p.seller?.store_name_en || p.seller?.store_name_ar || null,
  stock: p.quantity_in_stock || undefined,
  specs: p.specifications ? Object.entries(p.specifications).map(([k, v]) => `${k}: ${v}`) : [],
  deliveryDate: 'Soon',
  coupon: undefined,
  images: p.images?.map((img: any) => img.url || img) || [],
});

// ── Rating Stars ──
const StarRating = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Ionicons
        key={i}
        name={i <= Math.round(rating) ? 'star' : 'star-outline'}
        size={size}
        color="#FFC107"
      />
    ))}
  </View>
);

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
        {item.rating > 0 && (
          <View style={pStyles.ratingRow}>
            <StarRating rating={item.rating} />
            {item.ratingCount > 0 && (
              <Text style={pStyles.ratingCount}>({item.ratingCount})</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ══════════════════════════════════════════════════
// ── Price Filter Modal ──
// ══════════════════════════════════════════════════
const PriceModal = ({
  visible, onClose, onApply, isAr,
  initMin, initMax,
}: {
  visible: boolean; onClose: () => void; isAr: boolean;
  onApply: (min: string, max: string, sort: string) => void;
  initMin: string; initMax: string;
}) => {
  const [minVal, setMinVal] = useState(initMin);
  const [maxVal, setMaxVal] = useState(initMax);
  const [sort, setSort] = useState('');

  useEffect(() => {
    if (visible) { setMinVal(initMin); setMaxVal(initMax); }
  }, [visible]);

  const sortOptions = [
    { key: 'price_asc', labelEn: 'Price: Low to High', labelAr: 'السعر: من الأقل للأعلى' },
    { key: 'price_desc', labelEn: 'Price: High to Low', labelAr: 'السعر: من الأعلى للأقل' },
    { key: 'newest', labelEn: 'Newest', labelAr: 'الأحدث' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={fStyles.backdrop} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={fStyles.sheetWrapper}>
        <View style={fStyles.sheet}>
          <View style={fStyles.handle} />
          <Text style={fStyles.sheetTitle}>{isAr ? 'السعر والترتيب' : 'Price & Sort'}</Text>

          {/* Price Range */}
          <Text style={fStyles.sectionLabel}>{isAr ? 'نطاق السعر (EGP)' : 'Price Range (EGP)'}</Text>
          <View style={fStyles.priceRow}>
            <View style={fStyles.priceInputWrap}>
              <Text style={fStyles.priceInputLabel}>{isAr ? 'من' : 'Min'}</Text>
              <TextInput
                style={fStyles.priceInput}
                value={minVal}
                onChangeText={setMinVal}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#CCC"
              />
            </View>
            <View style={fStyles.priceDash} />
            <View style={fStyles.priceInputWrap}>
              <Text style={fStyles.priceInputLabel}>{isAr ? 'إلى' : 'Max'}</Text>
              <TextInput
                style={fStyles.priceInput}
                value={maxVal}
                onChangeText={setMaxVal}
                keyboardType="numeric"
                placeholder="99999"
                placeholderTextColor="#CCC"
              />
            </View>
          </View>

          {/* Quick price ranges */}
          <View style={fStyles.quickRow}>
            {[['0', '500'], ['500', '1000'], ['1000', '5000'], ['5000', '']].map(([mn, mx]) => (
              <TouchableOpacity
                key={`${mn}-${mx}`}
                style={[fStyles.quickChip, minVal === mn && maxVal === mx && fStyles.quickChipActive]}
                onPress={() => { setMinVal(mn); setMaxVal(mx); }}
              >
                <Text style={[fStyles.quickChipText, minVal === mn && maxVal === mx && fStyles.quickChipTextActive]}>
                  {mx ? `${mn}–${mx}` : `${mn}+`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sort */}
          <Text style={fStyles.sectionLabel}>{isAr ? 'الترتيب' : 'Sort By'}</Text>
          {sortOptions.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={fStyles.radioRow}
              onPress={() => setSort(sort === opt.key ? '' : opt.key)}
            >
              <View style={[fStyles.radio, sort === opt.key && fStyles.radioActive]}>
                {sort === opt.key && <View style={fStyles.radioDot} />}
              </View>
              <Text style={fStyles.radioLabel}>{isAr ? opt.labelAr : opt.labelEn}</Text>
            </TouchableOpacity>
          ))}

          {/* Buttons */}
          <View style={fStyles.btnRow}>
            <TouchableOpacity style={fStyles.clearBtn} onPress={() => onApply('', '', '')}>
              <Text style={fStyles.clearBtnText}>{isAr ? 'مسح' : 'Clear'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={fStyles.applyBtn} onPress={() => onApply(minVal, maxVal, sort)}>
              <Text style={fStyles.applyBtnText}>{isAr ? 'تطبيق' : 'Apply'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ── Rating Filter Modal ──
const RatingModal = ({
  visible, onClose, onApply, isAr, initRating,
}: {
  visible: boolean; onClose: () => void; isAr: boolean;
  onApply: (rating: number) => void; initRating: number;
}) => {
  const [selectedRating, setSelectedRating] = useState(initRating);
  useEffect(() => { if (visible) setSelectedRating(initRating); }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={fStyles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={fStyles.sheetWrapper}>
        <View style={fStyles.sheet}>
          <View style={fStyles.handle} />
          <Text style={fStyles.sheetTitle}>{isAr ? 'التقييم' : 'Rating'}</Text>
          <Text style={fStyles.sectionLabel}>{isAr ? 'الحد الأدنى للتقييم' : 'Minimum Rating'}</Text>
          {[4, 3, 2, 1].map(r => (
            <TouchableOpacity
              key={r}
              style={fStyles.radioRow}
              onPress={() => setSelectedRating(selectedRating === r ? 0 : r)}
            >
              <View style={[fStyles.radio, selectedRating === r && fStyles.radioActive]}>
                {selectedRating === r && <View style={fStyles.radioDot} />}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <StarRating rating={r} />
                <Text style={fStyles.radioLabel}>{isAr ? 'وأعلى' : '& above'}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={fStyles.btnRow}>
            <TouchableOpacity style={fStyles.clearBtn} onPress={() => onApply(0)}>
              <Text style={fStyles.clearBtnText}>{isAr ? 'مسح' : 'Clear'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={fStyles.applyBtn} onPress={() => onApply(selectedRating)}>
              <Text style={fStyles.applyBtnText}>{isAr ? 'تطبيق' : 'Apply'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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

  // Filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState('');

  // Modal visibility
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);

  // Active filter badges
  const priceActive = minPrice !== '' || maxPrice !== '' || sort !== '';
  const ratingActive = minRating > 0;
  const brandActive = selectedBrand !== '';

  // Initial load of categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productsApi.categories();
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
      navigation.setParams({ categoryId: undefined });
    }
  }, [route.params?.categoryId]);

  // Fetch products when category or filters change
  const fetchProducts = useCallback(async (
    catId: number,
    params: { min_price?: string; max_price?: string; sort?: string }
  ) => {
    setLoadingProducts(true);
    try {
      const query: any = { category_id: catId, page: 1, per_page: 50 };
      if (params.min_price) query.min_price = params.min_price;
      if (params.max_price) query.max_price = params.max_price;
      if (params.sort) query.sort = params.sort;

      const res = await productsApi.list(query);
      const raw = res.data;
      const items = raw?.data?.data || raw?.data || [];
      setProducts(Array.isArray(items) ? items.map(mapApiProduct) : []);
    } catch (err) {
      console.warn('Failed to fetch category products', err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory, { min_price: minPrice, max_price: maxPrice, sort });
    }
  }, [selectedCategory]);

  const applyPriceFilter = (mn: string, mx: string, srt: string) => {
    setMinPrice(mn);
    setMaxPrice(mx);
    setSort(srt);
    setShowPriceModal(false);
    if (selectedCategory) {
      fetchProducts(selectedCategory, { min_price: mn, max_price: mx, sort: srt });
    }
  };

  const applyRatingFilter = (rating: number) => {
    setMinRating(rating);
    setShowRatingModal(false);
    // Rating filter is client-side (API doesn't have min_rating param)
  };

  // Client-side filters (rating + brand)
  const availableBrands = Array.from(
    new Set(products.map(p => p.brand).filter(Boolean))
  ) as string[];

  const displayedProducts = products
    .filter(p => minRating === 0 || p.rating >= minRating)
    .filter(p => !brandActive || p.brand === selectedBrand);

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
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

        {/* Simple back header */}
        <View style={[styles.simpleHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            style={[styles.backBtn, { marginRight: isAr ? 0 : 12, marginLeft: isAr ? 12 : 0 }]}
          >
            <Ionicons name={isAr ? 'arrow-forward' : 'arrow-back'} size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.simpleHeaderTitle} numberOfLines={1}>{getCategoryName()}</Text>
        </View>

        {/* Filter Row */}
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {/* Price / Sort */}
            <TouchableOpacity
              style={[styles.filterPill, priceActive && styles.filterPillActive]}
              onPress={() => setShowPriceModal(true)}
            >
              <Text style={[styles.filterPillText, priceActive && styles.filterPillTextActive]}>
                {isAr ? 'السعر' : 'Price'}
              </Text>
              <Ionicons name="chevron-down" size={14} color={priceActive ? COLORS.primary : '#666'} />
              {priceActive && <View style={styles.activeDot} />}
            </TouchableOpacity>

            {/* Brand */}
            <TouchableOpacity
              style={[styles.filterPill, brandActive && styles.filterPillActive]}
              onPress={() => setShowBrandModal(true)}
            >
              <Text style={[styles.filterPillText, brandActive && styles.filterPillTextActive]}>
                {brandActive ? selectedBrand : (isAr ? 'الماركة' : 'Brand')}
              </Text>
              <Ionicons name="chevron-down" size={14} color={brandActive ? COLORS.primary : '#666'} />
              {brandActive && <View style={styles.activeDot} />}
            </TouchableOpacity>

            {/* Rating */}
            <TouchableOpacity
              style={[styles.filterPill, ratingActive && styles.filterPillActive]}
              onPress={() => setShowRatingModal(true)}
            >
              <Text style={[styles.filterPillText, ratingActive && styles.filterPillTextActive]}>
                {ratingActive ? `${minRating}★+` : (isAr ? 'التقييم' : 'Rating')}
              </Text>
              <Ionicons name="chevron-down" size={14} color={ratingActive ? COLORS.primary : '#666'} />
              {ratingActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.categoryLabel}>
          <Text style={styles.resultCount}>
            {loadingProducts ? '...' : displayedProducts.length} {isAr ? 'نتيجة' : 'results'}
          </Text>
        </View>

        {loadingProducts ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : displayedProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>{isAr ? 'لا توجد منتجات في هذه الفئة' : 'No products in this category'}</Text>
          </View>
        ) : (
          <FlatList
            data={displayedProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ProductCard item={item} onPress={() => handleProductPress(item)} />}
            contentContainerStyle={styles.productList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={<View style={{ height: 80 }} />}
          />
        )}


        <PriceModal
          visible={showPriceModal}
          onClose={() => setShowPriceModal(false)}
          onApply={applyPriceFilter}
          isAr={isAr}
          initMin={minPrice}
          initMax={maxPrice}
        />
        <RatingModal
          visible={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onApply={applyRatingFilter}
          isAr={isAr}
          initRating={minRating}
        />
        <Modal visible={showBrandModal} transparent animationType="slide" onRequestClose={() => setShowBrandModal(false)}>
          <TouchableOpacity style={fStyles.backdrop} activeOpacity={1} onPress={() => setShowBrandModal(false)} />
          <View style={fStyles.sheetWrapper}>
            <View style={fStyles.sheet}>
              <View style={fStyles.handle} />
              <Text style={fStyles.sheetTitle}>{isAr ? 'الماركة' : 'Brand'}</Text>
              {availableBrands.length === 0 ? (
                <Text style={{ color: '#999', textAlign: 'center', paddingVertical: 20 }}>
                  {isAr ? 'لا توجد ماركات في هذه الفئة' : 'No brands in this category'}
                </Text>
              ) : (
                availableBrands.map(brand => (
                  <TouchableOpacity
                    key={brand}
                    style={fStyles.radioRow}
                    onPress={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                  >
                    <View style={[fStyles.radio, selectedBrand === brand && fStyles.radioActive]}>
                      {selectedBrand === brand && <View style={fStyles.radioDot} />}
                    </View>
                    <Text style={fStyles.radioLabel}>{brand}</Text>
                  </TouchableOpacity>
                ))
              )}
              <View style={fStyles.btnRow}>
                <TouchableOpacity style={fStyles.clearBtn} onPress={() => { setSelectedBrand(''); setShowBrandModal(false); }}>
                  <Text style={fStyles.clearBtnText}>{isAr ? 'مسح' : 'Clear'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={fStyles.applyBtn} onPress={() => setShowBrandModal(false)}>
                  <Text style={fStyles.applyBtnText}>{isAr ? 'تطبيق' : 'Apply'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // ── Category Grid View ──
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <MainHeader />
      <View style={styles.searchWrap}>
        <SearchBar
          placeholder={isAr ? 'عن ماذا تبحث؟' : 'What are you looking for?'}
          onPress={() => navigation.navigate('Search')}
        />
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
  simpleHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: { marginRight: 12 },
  simpleHeaderTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', flex: 1 },
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
  filterPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E8E8E8' },
  filterPillActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '12' },
  filterPillText: { fontSize: 13, fontWeight: '600', color: '#444', marginRight: 4 },
  filterPillTextActive: { color: COLORS.primary },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginLeft: 2 },
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

// ── Filter Modal Styles ──
const fStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheetWrapper: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: Platform.OS === 'ios' ? 34 : 20 },
  sheet: { paddingHorizontal: 20, paddingTop: 12 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#888', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12, marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  priceInputWrap: { flex: 1 },
  priceInputLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  priceInput: { borderWidth: 1.5, borderColor: '#E8E8E8', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  priceDash: { width: 16, height: 2, backgroundColor: '#DDD', marginTop: 14 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' },
  quickChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  quickChipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  quickChipTextActive: { color: COLORS.primary },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  radioLabel: { fontSize: 15, color: '#333', fontWeight: '500' },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  clearBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#E0E0E0', alignItems: 'center' },
  clearBtnText: { fontSize: 15, fontWeight: '700', color: '#666' },
  applyBtn: { flex: 2, paddingVertical: 14, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
  applyBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
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
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  ratingCount: { fontSize: 11, color: '#888' },
});

export default CategoriesScreen;
