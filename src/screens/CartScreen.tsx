import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useCartStore, CartItem } from '../store/cartStore';
import { useNavigation } from '@react-navigation/native';

const BESTSELLER_PRODUCTS = [
  { id: 1, name: 'Samsung Galaxy S24 Ultra 512GB...', image: 'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S24/1.png', price: 54999, originalPrice: 64999 },
  { id: 2, name: 'Apple MacBook Pro 14" M3 Pro...', image: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png', price: 89999, originalPrice: 99999 },
  { id: 3, name: 'Essence Mascara Lash Princess...', image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png', price: 299, originalPrice: 450 },
  { id: 4, name: 'ASUS Zenbook Pro Dual Screen...', image: 'https://cdn.dummyjson.com/products/images/laptops/Asus%20Zenbook%20Pro%20Dual%20Screen%20Laptop/1.png', price: 95555, originalPrice: 105000 },
];

const SUGGESTED_PRODUCTS = [
  { id: 1, name: 'Stainless Steel Cleaning Bucket Set...', image: 'https://cdn.dummyjson.com/products/images/kitchen-accessories/Cleaning%20Spray/1.png', price: 899 },
  { id: 2, name: 'Microfiber Flat Floor Mop Set...', image: 'https://cdn.dummyjson.com/products/images/kitchen-accessories/Wooden%20Rolling%20Pin/1.png', price: 549 },
];

const CartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { items, getTotal, getSavings, getItemCount, updateQuantity, removeItem } = useCartStore();

  const total = getTotal();
  const savings = getSavings();
  const itemCount = getItemCount();

  // ── Empty Cart State ──
  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Ionicons name="bag-handle" size={22} color="#FFF" />
            <Text style={styles.brandName}>Safqa</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Empty State */}
          <View style={styles.emptyState}>
            <View style={styles.emptyCartIcon}>
              <Text style={{ fontSize: 80 }}>🛒</Text>
              <View style={styles.sparkle1}><Text style={{ fontSize: 16 }}>✨</Text></View>
              <View style={styles.sparkle2}><Text style={{ fontSize: 12 }}>⭐</Text></View>
              <View style={styles.sparkle3}><Text style={{ fontSize: 14 }}>✦</Text></View>
            </View>
            <Text style={styles.emptyTitle}>Your shopping cart{'\n'}looks empty.</Text>
            <Text style={styles.emptySubtitle}>What are you waiting for?</Text>
            <TouchableOpacity
              style={styles.startShoppingBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.startShoppingText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>

          {/* Bestsellers Section */}
          <View style={styles.bestsellersSection}>
            <Text style={styles.bestsellersTitle}>Bestsellers for you</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bestsellersScroll}
            >
              {BESTSELLER_PRODUCTS.map((prod) => (
                <TouchableOpacity
                  key={prod.id}
                  style={styles.bestsellerCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('ProductDetail', {
                    product: {
                      ...prod,
                      brand: prod.name.split(' ')[0],
                      images: [prod.image],
                      rating: 4.5,
                      reviews: 100,
                      stock: 10,
                      description: prod.name,
                      specs: ['Premium Quality'],
                      freeDelivery: true,
                      isExpress: true,
                      deliveryDate: '9 March',
                    }
                  })}
                >
                  {/* Best Seller Tag */}
                  <View style={styles.bestsellerTag}>
                    <Text style={styles.bestsellerTagText}>Best Seller</Text>
                  </View>
                  {/* Heart */}
                  <TouchableOpacity style={styles.bestsellerHeart}>
                    <Ionicons name="heart-outline" size={16} color="#999" />
                  </TouchableOpacity>
                  {/* Image */}
                  <Image source={{ uri: prod.image }} style={styles.bestsellerImage} resizeMode="contain" />
                  {/* Add button */}
                  <TouchableOpacity style={styles.bestsellerAddBtn}>
                    <Ionicons name="add" size={18} color="#333" />
                  </TouchableOpacity>
                  {/* Name */}
                  <Text style={styles.bestsellerName} numberOfLines={1}>{prod.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Cart with Items ──
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Ionicons name="bag-handle" size={22} color="#FFF" />
          <Text style={styles.brandName}>Safqa</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Cart Items */}
        {items.map((item) => {
          const discount = item.originalPrice
            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
            : 0;

          return (
            <View key={`${item.productId}-${item.id}`} style={styles.cartItemCard}>
              {item.isExpress && (
                <View style={styles.expressBanner}>
                  <Text style={styles.expressLabel}>express</Text>
                </View>
              )}

              <View style={styles.cartItemContent}>
                <Image source={{ uri: item.image }} style={styles.cartItemImage} resizeMode="contain" />
                <View style={styles.cartItemDetails}>
                  <View style={styles.storeBadge}>
                    <Text style={styles.storeBadgeText}>{item.storeName}</Text>
                  </View>
                  <Text style={styles.cartItemName} numberOfLines={2}>{item.name}</Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceCurrency}>EGP </Text>
                    <Text style={styles.priceValue}>{item.price.toLocaleString()}</Text>
                    {item.originalPrice && (
                      <>
                        <Text style={styles.originalPrice}> {item.originalPrice.toLocaleString()}</Text>
                        <Text style={styles.discountTag}> {discount}% OFF</Text>
                      </>
                    )}
                  </View>

                  {item.deliveryDate && (
                    <View style={styles.deliveryInfo}>
                      <Text style={styles.deliveryEta}>
                        Get it by <Text style={FONTS.bold}>{item.deliveryDate}</Text>
                      </Text>
                    </View>
                  )}

                  <View style={styles.quantityRow}>
                    <TouchableOpacity style={styles.quantityBtn} onPress={() => removeItem(item.id)}>
                      <Ionicons name="trash-outline" size={18} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.quantityDisplay}>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                    </View>
                    <TouchableOpacity style={styles.quantityBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Ionicons name="add" size={18} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.freeShipRow}>
                    <MaterialCommunityIcons name="truck-fast-outline" size={14} color={COLORS.freeShipping} />
                    <Text style={styles.freeShipText}>Free Shipping</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Express Shipping Info */}
        <View style={styles.expressShipInfo}>
          <MaterialCommunityIcons name="truck-fast" size={16} color={COLORS.primary} />
          <Text style={styles.expressShipText}>Enjoy free Express shipping</Text>
        </View>

        {/* Suggestions */}
        <View style={styles.suggestionsHeader}>
          <Text style={styles.suggestionsTitle}>Don't miss out on these offers</Text>
          <Text style={styles.adBadge}>Ad</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
          {SUGGESTED_PRODUCTS.map((prod) => (
            <TouchableOpacity key={prod.id} style={styles.suggestionCard}>
              <Image source={{ uri: prod.image }} style={styles.suggestionImage} resizeMode="contain" />
              <Text style={styles.suggestionName} numberOfLines={2}>{prod.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Checkout Bar */}
      <View style={styles.checkoutBar}>
        <TouchableOpacity style={styles.collapseRow}>
          <Ionicons name="chevron-up" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <View style={styles.checkoutContent}>
          <View style={styles.checkoutPriceSection}>
            <Text style={styles.checkoutTotal}>
              EGP <Text style={styles.checkoutTotalValue}>{total.toLocaleString()}.00</Text>
            </Text>
            {savings > 0 && (
              <Text style={styles.checkoutSavings}>Saving EGP {savings.toFixed(2)}</Text>
            )}
            <Text style={styles.itemCountText}>{itemCount} item{itemCount > 1 ? 's' : ''} in cart</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary },
  headerInner: { paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 0) + 12, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' },
  brandName: { fontSize: 26, fontWeight: '900', color: '#FFF', marginLeft: 8, letterSpacing: 1.5 },
  scrollView: { flex: 1 },

  // ── Empty State ──
  emptyState: { alignItems: 'center', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 },
  emptyCartIcon: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' },
  sparkle1: { position: 'absolute', top: 10, right: 10 },
  sparkle2: { position: 'absolute', top: 25, left: 15 },
  sparkle3: { position: 'absolute', bottom: 20, right: 20 },
  emptyTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', textAlign: 'center', lineHeight: 32, marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: '#999', textAlign: 'center', marginBottom: 30 },
  startShoppingBtn: { backgroundColor: '#1A1A1A', borderRadius: 30, paddingHorizontal: 40, paddingVertical: 14 },
  startShoppingText: { fontSize: 16, fontWeight: '700', color: '#FFF' },

  // ── Bestsellers ──
  bestsellersSection: { marginTop: 20, backgroundColor: '#FFF', paddingTop: 20, paddingBottom: 16 },
  bestsellersTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', paddingHorizontal: 16, marginBottom: 14 },
  bestsellersScroll: { paddingHorizontal: 16, gap: 10 },
  bestsellerCard: { width: 150, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#F0F0F0', overflow: 'hidden', position: 'relative', paddingBottom: 10 },
  bestsellerTag: { position: 'absolute', top: 0, left: 0, zIndex: 10, backgroundColor: '#1A1A1A', paddingHorizontal: 8, paddingVertical: 4, borderBottomRightRadius: 8 },
  bestsellerTagText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  bestsellerHeart: { position: 'absolute', top: 6, right: 6, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 50, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  bestsellerImage: { width: '100%', height: 120, backgroundColor: '#FAFAFA' },
  bestsellerAddBtn: { position: 'absolute', right: 6, top: 100, zIndex: 10, backgroundColor: '#FFF', borderRadius: 50, width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#E0E0E0' },
  bestsellerName: { fontSize: 11, color: '#333', paddingHorizontal: 8, marginTop: 8 },

  // ── Cart Items ──
  cartItemCard: { backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: 10, borderRadius: SIZES.radiusLg, overflow: 'hidden', ...SHADOWS.small },
  expressBanner: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 6 },
  expressLabel: { color: COLORS.white, fontSize: SIZES.fontSm, ...FONTS.bold, fontStyle: 'italic' },
  cartItemContent: { flexDirection: 'row', padding: 12 },
  cartItemImage: { width: 90, height: 90, borderRadius: SIZES.radiusMd, backgroundColor: COLORS.background, marginRight: 12 },
  cartItemDetails: { flex: 1 },
  storeBadge: { backgroundColor: COLORS.textPrimary, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: SIZES.radiusSm, marginBottom: 4 },
  storeBadgeText: { color: COLORS.white, fontSize: 10, ...FONTS.medium },
  cartItemName: { fontSize: SIZES.fontSm, color: COLORS.textPrimary, ...FONTS.regular, lineHeight: 18, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' },
  priceCurrency: { fontSize: SIZES.fontXs, color: COLORS.textPrimary, ...FONTS.medium },
  priceValue: { fontSize: SIZES.fontLg, color: COLORS.textPrimary, ...FONTS.bold },
  originalPrice: { fontSize: SIZES.fontXs, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  discountTag: { fontSize: SIZES.fontXs, color: COLORS.discount, ...FONTS.semiBold },
  deliveryInfo: { marginTop: 6 },
  deliveryEta: { fontSize: SIZES.fontXs, color: COLORS.textPrimary },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, alignSelf: 'flex-start', borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusMd, overflow: 'hidden' },
  quantityBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  quantityDisplay: { paddingHorizontal: 14, paddingVertical: 6, borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.border },
  quantityText: { fontSize: SIZES.fontMd, ...FONTS.semiBold, color: COLORS.textPrimary },
  freeShipRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  freeShipText: { fontSize: SIZES.fontXs, color: COLORS.freeShipping, ...FONTS.medium },

  // Express Shipping
  expressShipInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: 10, padding: 12, borderRadius: SIZES.radiusMd, gap: 8 },
  expressShipText: { fontSize: SIZES.fontSm, color: COLORS.textPrimary, ...FONTS.medium },

  // Suggestions
  suggestionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  suggestionsTitle: { fontSize: SIZES.fontMd, ...FONTS.bold, color: COLORS.textPrimary },
  adBadge: { fontSize: SIZES.fontXs, color: COLORS.textMuted, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
  suggestionsScroll: { paddingHorizontal: 16, gap: 6 },
  suggestionCard: { width: 140, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 10, marginRight: 4, borderWidth: 1, borderColor: '#F0F0F0' },
  suggestionImage: { width: '100%', height: 90, borderRadius: 8, marginBottom: 8, backgroundColor: '#FAFAFA' },
  suggestionName: { fontSize: SIZES.fontXs, color: COLORS.textPrimary, lineHeight: 14 },

  // Checkout Bar
  checkoutBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.divider, paddingBottom: 26, ...SHADOWS.large },
  collapseRow: { alignItems: 'center', paddingTop: 4 },
  checkoutContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6 },
  checkoutPriceSection: { flex: 1 },
  checkoutTotal: { fontSize: SIZES.fontSm, color: COLORS.textPrimary, ...FONTS.medium },
  checkoutTotalValue: { fontSize: SIZES.fontXl, ...FONTS.bold },
  checkoutSavings: { fontSize: SIZES.fontXs, color: COLORS.freeShipping, ...FONTS.medium, marginTop: 2 },
  itemCountText: { fontSize: 11, color: '#999', marginTop: 2 },
  checkoutButton: { backgroundColor: COLORS.secondary, borderRadius: SIZES.radiusMd, paddingHorizontal: 30, paddingVertical: 10 },
  checkoutButtonText: { color: COLORS.white, fontSize: SIZES.fontMd, ...FONTS.bold, letterSpacing: 1 },
});

export default CartScreen;
