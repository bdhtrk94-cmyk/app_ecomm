import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useCartStore } from '../store/cartStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }: any) => {
  const { product } = route.params;
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        nameAr: product.name,
        image: product.image || (product.images && product.images[0]) || '',
        price: product.price,
        originalPrice: product.originalPrice,
        storeName: product.brand || 'Safqa Store',
        isExpress: product.isExpress || false,
        deliveryDate: product.deliveryDate,
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const images = product.images || [product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.headerBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={s.headerSearch}>
          <Ionicons name="search" size={18} color="#999" />
          <Text style={s.headerSearchText}>Search</Text>
        </View>
        <TouchableOpacity onPress={() => setIsFav(!isFav)} style={s.headerBtn}>
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? '#E53935' : '#1A1A1A'} />
        </TouchableOpacity>
        <TouchableOpacity style={s.headerBtn}>
          <Ionicons name="share-outline" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Carousel */}
        <View style={s.imageCarousel}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveImage(index);
            }}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={s.imageSlide}>
                <Image source={{ uri: item }} style={s.productMainImage} resizeMode="contain" />
              </View>
            )}
          />
          <View style={s.dotRow}>
            {images.map((_: any, i: number) => (
              <View key={i} style={[s.dot, activeImage === i && s.dotActive]} />
            ))}
          </View>
        </View>

        {/* Brand Row */}
        <View style={s.brandRow}>
          <Text style={s.brandName}>{product.brand || 'Brand'}</Text>
          <TouchableOpacity style={s.viewProducts}>
            <Text style={s.viewProductsText}>View Products</Text>
            <Ionicons name="chevron-forward" size={16} color="#1565C0" />
          </TouchableOpacity>
        </View>

        {/* Product Name */}
        <View style={s.nameSection}>
          <Text style={s.productName}>{product.name}</Text>
        </View>

        {/* Rating */}
        <View style={s.ratingRow}>
          <Text style={s.ratingScore}>{product.rating || '4.0'}</Text>
          <Ionicons name="star" size={14} color="#4CAF50" />
          <View style={s.ratingDivider} />
          <Text style={s.ratingLabel}>Brand Rating</Text>
          <Text style={s.reviewCount}>({product.reviews || product.ratingCount || 0} reviews)</Text>
        </View>

        {/* Price */}
        <View style={s.priceSection}>
          <View style={s.priceRow}>
            <Text style={s.priceCurrency}>EGP </Text>
            <Text style={s.priceValue}>{product.price.toLocaleString()}</Text>
          </View>
          {product.originalPrice && (
            <View style={s.discountRow}>
              <Text style={s.originalPrice}>EGP {product.originalPrice.toLocaleString()}</Text>
              <View style={s.discountBadge}>
                <Text style={s.discountText}>{discount}% OFF</Text>
              </View>
            </View>
          )}
          <Text style={s.vatNote}>Inclusive of VAT</Text>
        </View>

        {/* Stock */}
        {product.stock && product.stock <= 10 && (
          <View style={s.stockRow}>
            <Ionicons name="lock-closed" size={14} color="#E65100" />
            <Text style={s.stockText}>Only {product.stock} left in stock</Text>
          </View>
        )}

        {/* Coupon */}
        {product.coupon && (
          <View style={s.couponSection}>
            <View style={s.couponBadge}>
              <Ionicons name="pricetag" size={14} color="#F57F17" />
              <Text style={s.couponText}>{product.coupon}</Text>
            </View>
          </View>
        )}

        <View style={s.divider} />

        {/* Delivery Information */}
        <View style={s.deliverySection}>
          <Text style={s.sectionTitle}>Delivery Information</Text>
          {product.isExpress && (
            <View style={s.expressDelivery}>
              <View style={s.expressBadge}>
                <Text style={s.expressText}>express</Text>
              </View>
              <Text style={s.deliveryDate}>
                Get it by <Text style={{ fontWeight: '700' }}>{product.deliveryDate || 'Soon'}</Text>
              </Text>
              {product.orderIn && <Text style={s.orderIn}>Order in {product.orderIn}</Text>}
            </View>
          )}
          {product.freeDelivery !== false && (
            <View style={s.freeDeliveryRow}>
              <MaterialCommunityIcons name="truck-fast" size={16} color="#00796B" />
              <Text style={s.freeDeliveryText}>Free Delivery</Text>
            </View>
          )}
        </View>

        <View style={s.divider} />

        {/* Specs */}
        {product.specs && product.specs.length > 0 && (
          <View style={s.specsSection}>
            <Text style={s.sectionTitle}>Specifications</Text>
            {product.specs.map((spec: string, i: number) => (
              <View key={i} style={s.specRow}>
                <View style={s.specDot} />
                <Text style={s.specText}>{spec}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={s.divider} />

        {/* Description */}
        {product.description && (
          <View style={s.descSection}>
            <Text style={s.sectionTitle}>Description</Text>
            <Text style={s.descText}>{product.description}</Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={s.bottomBar}>
        <View style={s.qtyBox}>
          <Text style={s.qtyLabel}>QTY</Text>
          <View style={s.qtyControls}>
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={s.qtyBtn}>
              <Ionicons name="remove" size={16} color="#666" />
            </TouchableOpacity>
            <Text style={s.qtyValue}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={s.qtyBtn}>
              <Ionicons name="add" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[s.addToCartBtn, addedToCart && { backgroundColor: '#4CAF50' }]}
          activeOpacity={0.85}
          onPress={handleAddToCart}
        >
          {addedToCart ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={s.addToCartText}>Added to Cart!</Text>
            </View>
          ) : (
            <Text style={s.addToCartText}>Add To Cart</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 0) + 12, paddingHorizontal: 8, paddingBottom: 8, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerSearch: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 24, paddingHorizontal: 14, paddingVertical: 8, marginHorizontal: 4, gap: 8 },
  headerSearchText: { fontSize: 14, color: '#999' },
  imageCarousel: { backgroundColor: '#FAFAFA' },
  imageSlide: { width: SCREEN_WIDTH, height: 320, alignItems: 'center', justifyContent: 'center' },
  productMainImage: { width: '70%', height: '85%' },
  dotRow: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 14, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDD' },
  dotActive: { backgroundColor: '#1A1A1A', width: 10, height: 10, borderRadius: 5 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, backgroundColor: '#F8F9FA', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  brandName: { fontSize: 16, fontWeight: '800', color: '#1565C0' },
  viewProducts: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewProductsText: { fontSize: 13, fontWeight: '600', color: '#1565C0' },
  nameSection: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6 },
  productName: { fontSize: 16, fontWeight: '500', color: '#1A1A1A', lineHeight: 24 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10, gap: 4 },
  ratingScore: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  ratingDivider: { width: 1, height: 14, backgroundColor: '#DDD', marginHorizontal: 6 },
  ratingLabel: { fontSize: 13, color: '#888' },
  reviewCount: { fontSize: 12, color: '#AAA', marginLeft: 4 },
  priceSection: { paddingHorizontal: 16, paddingBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  priceCurrency: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  priceValue: { fontSize: 28, fontWeight: '900', color: '#1A1A1A' },
  discountRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  originalPrice: { fontSize: 14, color: '#AAA', textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: '#E8F5E9', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  discountText: { fontSize: 12, fontWeight: '700', color: '#2E7D32' },
  vatNote: { fontSize: 11, color: '#999', marginTop: 4 },
  stockRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8, gap: 6 },
  stockText: { fontSize: 13, fontWeight: '600', color: '#E65100' },
  couponSection: { paddingHorizontal: 16, paddingBottom: 10 },
  couponBadge: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: '#FFC107', borderStyle: 'dashed', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#FFFDE7' },
  couponText: { fontSize: 13, fontWeight: '700', color: '#F57F17' },
  divider: { height: 8, backgroundColor: '#F5F5F5' },
  deliverySection: { paddingHorizontal: 16, paddingVertical: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  expressDelivery: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 },
  expressBadge: { backgroundColor: COLORS.primary, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 3 },
  expressText: { fontSize: 12, fontWeight: '800', color: '#FFF', fontStyle: 'italic' },
  deliveryDate: { fontSize: 14, color: '#1A1A1A' },
  orderIn: { fontSize: 12, fontWeight: '600', color: '#4CAF50' },
  freeDeliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  freeDeliveryText: { fontSize: 13, color: '#00796B', fontWeight: '600' },
  specsSection: { paddingHorizontal: 16, paddingVertical: 14 },
  specRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  specDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  specText: { fontSize: 14, color: '#444' },
  descSection: { paddingHorizontal: 16, paddingVertical: 14 },
  descText: { fontSize: 14, color: '#555', lineHeight: 22 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#F0F0F0', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 6, gap: 12 },
  qtyBox: { alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 4 },
  qtyLabel: { fontSize: 10, fontWeight: '600', color: '#AAA' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', minWidth: 20, textAlign: 'center' },
  addToCartBtn: { flex: 1, backgroundColor: '#3F6CDF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  addToCartText: { fontSize: 16, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
});

export default ProductDetailScreen;
