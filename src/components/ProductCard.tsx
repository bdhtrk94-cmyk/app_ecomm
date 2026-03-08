import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useWishlistStore } from '../store/wishlistStore';
import { useSettingsStore } from '../store/settingsStore';

interface ProductCardProps {
  id: number;
  name: string;
  nameAr?: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  ratingCount?: number;
  isExpress?: boolean;
  isFreeShipping?: boolean;
  isBestSeller?: boolean;
  soldCount?: string;
  storeName?: string;
  onPress?: () => void;
  onFavorite?: () => void;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  nameAr,
  image,
  price,
  originalPrice,
  discount,
  rating,
  ratingCount,
  isExpress = false,
  isFreeShipping = false,
  isBestSeller = false,
  soldCount,
  onPress,
  onFavorite,
  onAddToCart,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { language } = useSettingsStore();
  const isAr = language === 'ar';
  const isFav = isInWishlist(id);

  const displayName = isAr ? (nameAr || name) : name;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageSection}>
        {/* Best Seller Tag */}
        {isBestSeller && (
          <View style={styles.bestSellerTag}>
            <Text style={styles.bestSellerText}>Best Seller</Text>
          </View>
        )}

        {/* Discount Tag */}
        {(discount || 0) > 0 && (
          <View style={styles.discountTag}>
            <Text style={styles.discountTagText}>{discount}%</Text>
            <Text style={styles.discountTagOff}>{isAr ? 'خصم' : 'OFF'}</Text>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity style={styles.favoriteBtn} onPress={() => toggleWishlist(id)}>
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={18} color={isFav ? '#E53935' : '#999'} />
        </TouchableOpacity>

        {/* Product Image */}
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Add to Cart */}
        <TouchableOpacity style={styles.addToCartBtn} onPress={onAddToCart}>
          <Ionicons name="add" size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        {/* Product Name */}
        <Text style={[styles.name, { textAlign: isAr ? 'right' : 'left' }]} numberOfLines={2}>{displayName}</Text>

        {/* Rating */}
        {(rating || 0) > 0 && (
          <View style={[styles.ratingRow, { justifyContent: isAr ? 'flex-end' : 'flex-start' }]}>
            <Ionicons name="star" size={11} color="#FFB800" />
            <Text style={styles.ratingValue}>{rating}</Text>
            {(ratingCount || 0) > 0 && (
              <Text style={styles.ratingCount}>({ratingCount})</Text>
            )}
          </View>
        )}

        {/* Price */}
        <View style={[styles.priceRow, { flexDirection: 'row', justifyContent: isAr ? 'flex-end' : 'flex-start' }]}>
          <Text style={styles.currency}>EGP </Text>
          <Text style={styles.price}>{price.toLocaleString()}</Text>
        </View>

        {/* Original Price */}
        {originalPrice && (
          <Text style={[styles.originalPrice, { textAlign: isAr ? 'right' : 'left' }]}>
            EGP {originalPrice.toLocaleString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: '100%',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  // ── Image Section ──
  imageSection: {
    width: '100%',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bestSellerTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomRightRadius: 8,
  },
  bestSellerText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  discountTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9,
    backgroundColor: COLORS.discount,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderBottomRightRadius: 8,
    alignItems: 'center',
  },
  discountTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  discountTagOff: {
    color: '#FFF',
    fontSize: 7,
    fontWeight: '600',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 50,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartBtn: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    zIndex: 10,
    backgroundColor: '#FFF',
    borderRadius: 50,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  // ── Info Section ──
  infoSection: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
  },
  name: {
    fontSize: 12,
    color: '#333',
    fontWeight: '400',
    lineHeight: 16,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 4,
  },
  ratingValue: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
  },
  ratingCount: {
    fontSize: 10,
    color: '#999',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
    gap: 2,
  },
  currency: {
    fontSize: 10,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  price: {
    fontSize: 17,
    color: '#1A1A1A',
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 10,
    color: '#AAA',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
    gap: 4,
  },
  freeDeliveryTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeDeliveryText: {
    fontSize: 9.5,
    color: '#2E7D32',
    fontWeight: '600',
  },
  soldTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soldText: {
    fontSize: 9.5,
    color: COLORS.discount,
    fontWeight: '600',
  },
  expressBadge: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  expressText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    fontStyle: 'italic',
  },
});

export default ProductCard;
