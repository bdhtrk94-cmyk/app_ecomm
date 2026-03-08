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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useCartStore, CartItem } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { checkoutApi } from '../services/api';
import { t } from '../constants/i18n';

const CartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { items, getTotal, getSavings, getItemCount, updateQuantity, removeItem, fetchCart, clearCart } = useCartStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { language } = useSettingsStore();
  const tr = t(language);
  const isAr = language === 'ar';
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Only fetch cart when user is authenticated
      if (isLoggedIn) fetchCart();
    }, [isLoggedIn])
  );

  const total = getTotal();
  const savings = getSavings();
  const itemCount = getItemCount();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      // Pass a dummy address ID for now
      await checkoutApi.checkout({ address_id: 1 });
      await clearCart();
      Alert.alert('Success!', 'Your order has been placed successfully.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (err: any) {
      console.warn('Checkout error:', err?.response?.data || err);
      const msg = err?.response?.data?.message || 'Failed to place order';
      Alert.alert('Checkout Failed', msg);
    } finally {
      setIsCheckingOut(false);
    }
  };

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
            <Text style={styles.emptyTitle}>{tr('cartEmpty')}</Text>
            <Text style={styles.emptySubtitle}>{tr('cartEmptySub')}</Text>
            <TouchableOpacity
              style={styles.startShoppingBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.startShoppingText}>{tr('startShopping')}</Text>
            </TouchableOpacity>
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
                  <Text style={styles.expressLabel}>{isAr ? 'إكسبريس' : 'express'}</Text>
                </View>
              )}

              <View style={styles.cartItemContent}>
                <Image source={{ uri: item.image }} style={styles.cartItemImage} resizeMode="contain" />
                <View style={styles.cartItemDetails}>
                  <View style={styles.storeBadge}>
                    <Text style={styles.storeBadgeText}>{item.storeName}</Text>
                  </View>
                  <Text style={[styles.cartItemName, { textAlign: isAr ? 'right' : 'left' }]} numberOfLines={2}>{language === 'ar' ? (item.nameAr || item.name) : item.name}</Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceValue}>{item.price.toLocaleString()}</Text>
                    <Text style={styles.priceCurrency}>EGP</Text>
                    {item.originalPrice && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={styles.originalPrice}>{item.originalPrice.toLocaleString()}</Text>
                        <Text style={styles.discountTag}>{discount}% {isAr ? 'خصم' : 'OFF'}</Text>
                      </View>
                    )}
                  </View>

                  {item.deliveryDate && (
                    <View style={styles.deliveryInfo}>
                      <Text style={styles.deliveryEtaText}>{tr('getItBy')}</Text>
                      <Text style={styles.deliveryEtaDate}>{item.deliveryDate}</Text>
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
                    <Text style={styles.freeShipText}>{isAr ? 'شحن مجاني' : 'Free Shipping'}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Express Shipping Info */}
        <View style={styles.expressShipInfo}>
          <MaterialCommunityIcons name="truck-fast" size={16} color={COLORS.primary} />
          <Text style={styles.expressShipText}>{isAr ? 'استمتع بشحن اكسبريس مجاني' : 'Enjoy free Express shipping'}</Text>
        </View>



        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Checkout Bar */}
      <View style={styles.checkoutBar}>
        <TouchableOpacity style={styles.collapseRow}>
          <Ionicons name="chevron-up" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <View style={styles.checkoutContent}>
          <View style={styles.checkoutPriceSection}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
              <Text style={styles.checkoutTotalValue}>{total.toLocaleString()}.00</Text>
              <Text style={styles.checkoutTotalCurrency}>EGP</Text>
            </View>
            {savings > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.checkoutSavings}>{isAr ? 'توفير' : 'Saving'}</Text>
                <Text style={styles.checkoutSavingsValue}>{savings.toFixed(2)}</Text>
                <Text style={styles.checkoutSavings}>{isAr ? 'ج.م' : 'EGP'}</Text>
              </View>
            )}
            <Text style={styles.itemCountText}>{itemCount} {isAr ? 'عنصر في السلة' : `item${itemCount > 1 ? 's' : ''} in cart`}</Text>
          </View>
          <TouchableOpacity
            style={[styles.checkoutButton, isCheckingOut && { opacity: 0.7 }]}
            onPress={handleCheckout}
            disabled={isCheckingOut}
            activeOpacity={0.8}
          >
            {isCheckingOut ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.checkoutButtonText}>{tr('checkout').toUpperCase()}</Text>
            )}
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
  expressBanner: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start' },
  expressLabel: { color: COLORS.white, fontSize: SIZES.fontSm, ...FONTS.bold, fontStyle: 'italic' },
  cartItemContent: { flexDirection: 'row', padding: 12 },
  cartItemImage: { width: 90, height: 90, borderRadius: SIZES.radiusMd, backgroundColor: COLORS.background, marginRight: 12 },
  cartItemDetails: { flex: 1 },
  storeBadge: { backgroundColor: COLORS.textPrimary, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: SIZES.radiusSm, marginBottom: 4 },
  storeBadgeText: { color: COLORS.white, fontSize: 10, ...FONTS.medium },
  cartItemName: { fontSize: SIZES.fontSm, color: COLORS.textPrimary, ...FONTS.regular, lineHeight: 18, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 },
  priceCurrency: { fontSize: SIZES.fontXs, color: COLORS.textPrimary, ...FONTS.medium },
  priceValue: { fontSize: SIZES.fontLg, color: COLORS.textPrimary, ...FONTS.bold },
  originalPrice: { fontSize: SIZES.fontXs, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  discountTag: { fontSize: SIZES.fontXs, color: COLORS.discount, ...FONTS.semiBold },
  deliveryInfo: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  deliveryEtaText: { fontSize: SIZES.fontXs, color: COLORS.textPrimary },
  deliveryEtaDate: { fontSize: SIZES.fontXs, color: COLORS.textPrimary, ...FONTS.bold },
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

  // Sticky Checkout Bar
  checkoutBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 20, paddingTop: 12, borderTopWidth: 1, borderColor: COLORS.border, ...SHADOWS.medium },
  collapseRow: { alignItems: 'center', marginBottom: 8 },
  checkoutContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkoutPriceSection: { flex: 1 },
  checkoutTotalCurrency: { fontSize: SIZES.fontMd, color: COLORS.textPrimary, ...FONTS.bold },
  checkoutTotalValue: { fontSize: SIZES.fontXxl, ...FONTS.bold, color: COLORS.textPrimary },
  checkoutSavings: { fontSize: SIZES.fontSm, color: COLORS.discount, ...FONTS.medium },
  checkoutSavingsValue: { fontSize: SIZES.fontSm, color: COLORS.discount, ...FONTS.bold },
  itemCountText: { fontSize: SIZES.fontXs, color: COLORS.textMuted, marginTop: 2 },
  checkoutButton: { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: SIZES.radiusLg, ...SHADOWS.small, marginLeft: 16 },
  checkoutButtonText: { color: COLORS.white, fontSize: SIZES.fontMd, ...FONTS.bold },
});

export default CartScreen;
