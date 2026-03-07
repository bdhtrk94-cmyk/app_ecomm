import React from 'react';
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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import SearchBar from '../components/SearchBar';
import BannerCarousel from '../components/BannerCarousel';
import CategoryIcon from '../components/CategoryIcon';
import SectionHeader from '../components/SectionHeader';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';

// Mock data - using picsum.photos (direct URLs) and fakestoreapi for reliable loading
const BANNERS = [
  { id: 1, image: 'https://picsum.photos/id/26/600/250', backgroundColor: '#1B5E20' },
  { id: 2, image: 'https://picsum.photos/id/3/600/250', backgroundColor: '#F58634' },
  { id: 3, image: 'https://picsum.photos/id/96/600/250', backgroundColor: '#3866DF' },
];

const CATEGORIES = [
  { id: 1, name: 'Deals!', image: 'https://picsum.photos/id/1/120/120', isDome: true },
  { id: 2, name: 'Installments\n& Discounts', image: 'https://picsum.photos/id/20/120/120' },
  { id: 3, name: 'Shop & Win', image: 'https://picsum.photos/id/26/120/120' },
  { id: 4, name: "Men's Fashion", image: 'https://picsum.photos/id/64/120/120' },
  { id: 5, name: 'Brand Store', image: 'https://picsum.photos/id/96/120/120' },
  { id: 6, name: 'Coupon\nSavings', image: 'https://picsum.photos/id/60/120/120' },
  { id: 7, name: 'Ramadan\nEssentials', image: 'https://picsum.photos/id/225/120/120' },
  { id: 8, name: 'Beauty', image: 'https://picsum.photos/id/152/120/120' },
  { id: 9, name: "Women's\nFashion", image: 'https://picsum.photos/id/177/120/120' },
  { id: 10, name: 'Bundles', image: 'https://picsum.photos/id/175/120/120' },
];

// Map HomeScreen category names to CategoriesScreen category IDs
const CATEGORY_ID_MAP: Record<string, number> = {
  "Men's Fashion": 4,
  'Beauty': 3,
  "Women's\nFashion": 5,
  'Brand Store': 1,
  'Deals!': 1,
  'Coupon\nSavings': 1,
  'Ramadan\nEssentials': 8,
  'Bundles': 1,
  'Installments\n& Discounts': 1,
  'Shop & Win': 1,
};

// Map mega deal labels to category IDs
const MEGA_DEAL_CATEGORY_MAP: Record<string, number> = {
  'Fashion deals': 5,
  'Health deals': 3,
  'Home deals': 8,
  'TVs deals': 1,
  'Baby deals': 12,
  'Stationary deals': 8,
};

const PRODUCTS = [
  {
    id: 1,
    name: 'Vileda Turbo Smart Spin Microfiber Mop And Bucket Set...',
    image: 'https://cdn.dummyjson.com/products/images/kitchen-accessories/Cleaning%20Spray/1.png',
    price: 1099,
    originalPrice: 1699,
    discount: 35,
    rating: 3.1,
    ratingCount: 119,
    isExpress: true,
    isFreeShipping: true,
    isBestSeller: false,
    soldCount: undefined,
  },
  {
    id: 2,
    name: 'Mop Bucket Two Sinks For Rinse And Spin...',
    image: 'https://cdn.dummyjson.com/products/images/kitchen-accessories/Wooden%20Rolling%20Pin/1.png',
    price: 315,
    originalPrice: 450,
    discount: 30,
    rating: 3.1,
    ratingCount: 119,
    isExpress: true,
    isFreeShipping: true,
    isBestSeller: false,
    soldCount: undefined,
  },
  {
    id: 3,
    name: 'AIWANTO 2-Tier Dish Drying Storage Rack...',
    image: 'https://cdn.dummyjson.com/products/images/furniture/Knoll%20Saarinen%20Executive%20Conference%20Chair/1.png',
    price: 499,
    originalPrice: 899,
    discount: 44,
    rating: 4.3,
    ratingCount: 217,
    isExpress: true,
    isFreeShipping: false,
    isBestSeller: true,
    soldCount: '260+',
  },
  {
    id: 4,
    name: 'Flash Floor Cleaning Mop With Broom...',
    image: 'https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Helmet/1.png',
    price: 359,
    originalPrice: 499,
    discount: 28,
    rating: 4.5,
    ratingCount: 89,
    isExpress: true,
    isFreeShipping: false,
    isBestSeller: false,
    soldCount: undefined,
  },
  {
    id: 5,
    name: 'Samsung Galaxy S24 Ultra 512GB Titanium...',
    image: 'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S24/1.png',
    price: 54999,
    originalPrice: 64999,
    discount: 15,
    rating: 4.8,
    ratingCount: 342,
    isExpress: true,
    isFreeShipping: true,
    isBestSeller: true,
    soldCount: '500+',
  },
  {
    id: 6,
    name: 'JBL Charge 5 Portable Bluetooth Speaker...',
    image: 'https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods%20Max%20Silver/1.png',
    price: 5499,
    originalPrice: 7999,
    discount: 31,
    rating: 4.7,
    ratingCount: 156,
    isExpress: false,
    isFreeShipping: true,
    isBestSeller: false,
    soldCount: '120+',
  },
];

// Enrich products with detail data for ProductDetailScreen
const PRODUCTS_DETAIL = PRODUCTS.map(p => ({
  ...p,
  brand: p.name.split(' ')[0],
  images: [p.image],
  rating: p.rating,
  reviews: p.ratingCount,
  stock: 10,
  description: `High-quality ${p.name}. Premium build with modern design. Satisfaction guaranteed.`,
  specs: ['Premium Quality', 'Modern Design', 'Best Value'],
  freeDelivery: p.isFreeShipping,
  isExpress: p.isExpress,
  deliveryDate: '9 March',
  orderIn: '5h 30m',
}));

const MEGA_DEALS = [
  {
    id: 1,
    label: 'Fashion deals',
    labelColor: '#2E7D32',
    bgColor: '#F5F0EB',
    image: 'https://cdn.dummyjson.com/products/images/tops/Blue%20Women\'s%20Handbag/1.png',
    discount: 'Up to 80% off',
  },
  {
    id: 2,
    label: 'Health deals',
    labelColor: '#5C35A8',
    bgColor: '#E8174E',
    image: 'https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Helmet/1.png',
    discount: 'Up to 10% off',
  },
  {
    id: 3,
    label: 'Home deals',
    labelColor: '#00695C',
    bgColor: '#E0F2F1',
    image: 'https://cdn.dummyjson.com/products/images/furniture/Knoll%20Saarinen%20Executive%20Conference%20Chair/1.png',
    discount: 'Up to 20% off',
  },
  {
    id: 4,
    label: 'TVs deals',
    labelColor: '#1A237E',
    bgColor: '#0D1B2A',
    image: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png',
    discount: 'EGP 17,499',
    originalPrice: '19999',
  },
  {
    id: 5,
    label: 'Baby deals',
    labelColor: '#D81B60',
    bgColor: '#FCE4EC',
    image: 'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/1.png',
    discount: 'Up to 50% off',
  },
  {
    id: 6,
    label: 'Stationary deals',
    labelColor: '#FF6F00',
    bgColor: '#FFF8E1',
    image: 'https://cdn.dummyjson.com/products/images/kitchen-accessories/Wooden%20Rolling%20Pin/1.png',
    discount: 'Up to 60% off',
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEAL_CARD_WIDTH = 140;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleCategoryPress = (cat: any) => {
    const categoryId = CATEGORY_ID_MAP[cat.name] || 1;
    navigation.navigate('Categories', { categoryId });
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleMegaDealPress = (deal: any) => {
    const categoryId = MEGA_DEAL_CATEGORY_MAP[deal.label] || 1;
    navigation.navigate('Categories', { categoryId });
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      nameAr: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      storeName: 'Safqa Store',
      isExpress: product.isExpress || false,
      deliveryDate: 'Sun, Mar 9',
    });
    Alert.alert('✅ Added to Cart', `${product.name.substring(0, 35)}... added!`, [
      { text: 'OK' },
      { text: 'View Cart', onPress: () => navigation.navigate('Tabs', { screen: 'Cart' }) },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header - Brand */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Ionicons name="bag-handle" size={22} color="#FFF" />
          <Text style={styles.brandName}>Safqa</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Search Bar */}
        <SearchBar placeholder="Search Smart Watch" />

        {/* Hero Banner Carousel */}
        <BannerCarousel banners={BANNERS} height={160} />

        {/* Shop by Category */}
        <SectionHeader title="Shop by category" showSeeAll onSeeAll={() => {}} />

        {/* Categories - 2 rows, horizontal scroll like Noon */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          <View style={styles.categoriesColumn}>
            {/* Row 1 */}
            <View style={styles.categoriesRow}>
              {CATEGORIES.slice(0, 5).map((cat) => (
                <CategoryIcon
                  key={cat.id}
                  name={cat.name}
                  image={cat.image}
                  isDome={cat.isDome}
                  onPress={() => handleCategoryPress(cat)}
                />
              ))}
            </View>
            {/* Row 2 */}
            <View style={styles.categoriesRow}>
              {CATEGORIES.slice(5).map((cat) => (
                <CategoryIcon
                  key={cat.id}
                  name={cat.name}
                  image={cat.image}
                  isDome={cat.isDome}
                  onPress={() => handleCategoryPress(cat)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Recommended for you */}
        <SectionHeader title="Recommended for you" showSeeAll onSeeAll={() => {}} />

        {/* Product Horizontal Scroll - like Noon */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsScroll}
        >
          {PRODUCTS.map((product) => (
            <View key={product.id} style={styles.productCardWrapper}>
              <ProductCard
                {...product}
                onPress={() => handleProductPress(PRODUCTS_DETAIL.find(p => p.id === product.id) || product)}
                onFavorite={() => {}}
                onAddToCart={() => handleAddToCart(product)}
              />
            </View>
          ))}
        </ScrollView>

        {/* ── Mega Deals Section ── */}
        <View style={styles.megaDealsContainer}>
          {/* Decorative Header */}
          <View style={styles.megaDealsHeader}>
            <Text style={styles.megaDealsStars}>✦  ✦  ✦</Text>
            <Text style={styles.megaDealsTitle}>Mega Deals</Text>
            <Text style={styles.megaDealsSubtitle}>Limited time offers</Text>
          </View>

          {/* Deals Body */}
          <View style={styles.megaDealsBody}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.megaDealsScroll}
            >
              <View style={styles.megaDealsColumn}>
                {/* Row 1 */}
                <View style={styles.megaDealsRow}>
                  {MEGA_DEALS.slice(0, 3).map((deal) => (
                    <TouchableOpacity key={deal.id} activeOpacity={0.9} style={styles.dealCardOuter} onPress={() => handleMegaDealPress(deal)}>
                      <View style={styles.dealCard}>
                        <View style={[styles.dealImageArea, { backgroundColor: deal.bgColor }]}>
                          <View style={[styles.dealLabel, { backgroundColor: deal.labelColor }]}>
                            <Text style={styles.dealLabelText}>{deal.label}</Text>
                          </View>
                          <Image source={{ uri: deal.image }} style={styles.dealImage} resizeMode="contain" />
                        </View>
                        <View style={styles.dealInfoArea}>
                          <Text style={styles.dealDiscount}>{deal.discount}</Text>
                          {deal.originalPrice && (
                            <Text style={styles.dealOriginalPrice}>{deal.originalPrice}</Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Row 2 */}
                <View style={styles.megaDealsRow}>
                  {MEGA_DEALS.slice(3).map((deal) => (
                    <TouchableOpacity key={deal.id} activeOpacity={0.9} style={styles.dealCardOuter} onPress={() => handleMegaDealPress(deal)}>
                      <View style={styles.dealCard}>
                        <View style={[styles.dealImageArea, { backgroundColor: deal.bgColor }]}>
                          <View style={[styles.dealLabel, { backgroundColor: deal.labelColor }]}>
                            <Text style={styles.dealLabelText}>{deal.label}</Text>
                          </View>
                          <Image source={{ uri: deal.image }} style={styles.dealImage} resizeMode="contain" />
                        </View>
                        <View style={styles.dealInfoArea}>
                          <Text style={styles.dealDiscount}>{deal.discount}</Text>
                          {deal.originalPrice && (
                            <Text style={styles.dealOriginalPrice}>{deal.originalPrice}</Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
  },
  headerInner: {
    paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 0) + 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFF',
    marginLeft: 8,
    letterSpacing: 1.5,
  },
  scrollView: {
    flex: 1,
  },
  promoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginTop: 4,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  promoStripInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoStripLabel: {
    color: COLORS.white,
    fontSize: SIZES.fontSm,
    ...FONTS.bold,
    marginRight: 8,
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  promoStripText: {
    color: COLORS.white,
    fontSize: SIZES.fontSm,
    ...FONTS.regular,
  },
  promoStripTC: {
    color: COLORS.white,
    fontSize: SIZES.fontXs,
    opacity: 0.8,
  },
  categoriesScroll: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoriesColumn: {
    flexDirection: 'column',
  },
  categoriesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  productsScroll: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  productCardWrapper: {
    width: 165,
    marginRight: 10,
  },
  // ── Mega Deals ──
  megaDealsContainer: {
    marginTop: 20,
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  megaDealsHeader: {
    backgroundColor: COLORS.primary,
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: 'center',
  },
  megaDealsStars: {
    color: '#FFD700',
    fontSize: 10,
    letterSpacing: 6,
    marginBottom: 4,
  },
  megaDealsTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  megaDealsSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    fontWeight: '500',
  },
  megaDealsBody: {
    backgroundColor: COLORS.primary,
    paddingBottom: 12,
  },
  megaDealsScroll: {
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  megaDealsColumn: {
    flexDirection: 'column',
  },
  megaDealsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dealCardOuter: {
    width: DEAL_CARD_WIDTH,
    marginRight: 8,
  },
  dealCard: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dealImageArea: {
    width: '100%',
    height: 135,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dealLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dealLabelText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  dealImage: {
    width: 85,
    height: 85,
  },
  dealInfoArea: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
  },
  dealDiscount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  dealOriginalPrice: {
    fontSize: 11,
    color: '#AAA',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
});

export default HomeScreen;
