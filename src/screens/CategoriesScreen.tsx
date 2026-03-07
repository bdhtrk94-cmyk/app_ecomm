import React, { useState, useRef, useEffect } from 'react';
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
import SearchBar from '../components/SearchBar';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 8;
const CARD_PADDING = 16;
const CARD_WIDTH = Math.floor((SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP * 2) / 3);

// ── Category Data ──
const CATEGORIES_DATA = [
  { id: 1, name: 'Electronics', image: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png' },
  { id: 2, name: 'Large\nAppliances', image: 'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/1.png' },
  { id: 3, name: 'Beauty', image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png' },
  { id: 4, name: "Men's\nFashion", image: 'https://cdn.dummyjson.com/products/images/mens-shirts/Man%20Plaid%20Shirt/1.png' },
  { id: 5, name: "Women's\nFashion", image: "https://cdn.dummyjson.com/products/images/womens-dresses/Black%20Women's%20Gown/1.png" },
  { id: 6, name: "Kids'\nFashion", image: "https://cdn.dummyjson.com/products/images/tops/Blue%20Women's%20Handbag/1.png" },
  { id: 7, name: 'Mobiles &\naccessories', image: 'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S24/1.png' },
  { id: 8, name: 'Home &\nKitchen', image: 'https://cdn.dummyjson.com/products/images/kitchen-accessories/Cleaning%20Spray/1.png' },
  { id: 9, name: 'Small\nAppliances', image: 'https://cdn.dummyjson.com/products/images/kitchen-accessories/Wooden%20Rolling%20Pin/1.png' },
  { id: 10, name: 'Groceries', image: 'https://cdn.dummyjson.com/products/images/groceries/Apple/1.png' },
  { id: 11, name: 'Sports &\nOutdoors', image: 'https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Helmet/1.png' },
  { id: 12, name: 'Baby &\nToys', image: 'https://cdn.dummyjson.com/products/images/furniture/Knoll%20Saarinen%20Executive%20Conference%20Chair/1.png' },
];

// ── Mock Products with detail data ──
const CATEGORY_PRODUCTS: Record<number, any[]> = {
  1: [
    {
      id: 101, brand: 'MSI', rating: 4.3, reviews: 128, stock: 3,
      name: 'MSI Katana 15 HX B14WFK (Black) Gaming Laptop, 15.6" QHD IPS 165Hz Display, Intel Core i7-14650HX, RTX 4060 8GB, 16GB DDR5, 512GB SSD',
      images: [
        'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png',
        'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/2.png',
        'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/3.png',
      ],
      image: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png',
      price: 63600, originalPrice: 72000,
      specs: ['RAM Size 16 GB', 'Internal Memory 512 GB', 'Number of Cores 16-Core'],
      description: 'MSI Katana 15 HX B14WFK is a powerful gaming laptop featuring the latest Intel Core i7-14650HX processor and NVIDIA GeForce RTX 4060 graphics. With 16GB DDR5 RAM and 512GB NVMe SSD, this laptop delivers outstanding performance for gaming and creative work. The 15.6" QHD IPS display with 165Hz refresh rate ensures smooth gameplay and vibrant visuals.',
      freeDelivery: true, isExpress: true, deliveryDate: '9 March', orderIn: '7h 34m',
    },
    {
      id: 102, brand: 'ASUS', rating: 4.5, reviews: 89, stock: 7,
      name: 'ASUS Zenbook S16 UM5606WA | AI PC AI laptop - AMD Ryzen AI 9 HX 370, 16" 3K OLED 120Hz, 32GB LPDDR5X, 1TB SSD',
      images: [
        'https://cdn.dummyjson.com/products/images/laptops/Asus%20Zenbook%20Pro%20Dual%20Screen%20Laptop/1.png',
        'https://cdn.dummyjson.com/products/images/laptops/Asus%20Zenbook%20Pro%20Dual%20Screen%20Laptop/2.png',
        'https://cdn.dummyjson.com/products/images/laptops/Asus%20Zenbook%20Pro%20Dual%20Screen%20Laptop/3.png',
      ],
      image: 'https://cdn.dummyjson.com/products/images/laptops/Asus%20Zenbook%20Pro%20Dual%20Screen%20Laptop/1.png',
      price: 95555, originalPrice: 105000,
      specs: ['RAM Size 32 GB', 'Internal Memory 1 TB', 'Number of Cores 12-Core'],
      description: 'The ASUS Zenbook S16 sets a new standard for ultralight laptops with its ceraluminum lid. Powered by AMD Ryzen AI 9 processor, it features a stunning 16" 3K OLED display with 120Hz refresh rate. The 32GB LPDDR5X RAM and 1TB SSD ensure blazing performance.',
      freeDelivery: true, isExpress: true, deliveryDate: '8 March', orderIn: '5h 12m',
      coupon: 'Get 2000 EGP OFF',
    },
    {
      id: 103, brand: 'Lenovo', rating: 4.1, reviews: 56, stock: 12,
      name: 'Lenovo IdeaPad Slim 5 16IRU9 Laptop, Intel Core Ultra 7-155H, 16" WUXGA IPS, 16GB DDR5, 512GB SSD, Backlit KB',
      images: [
        'https://cdn.dummyjson.com/products/images/laptops/Lenovo%20Yoga%20920/1.png',
        'https://cdn.dummyjson.com/products/images/laptops/Lenovo%20Yoga%20920/2.png',
      ],
      image: 'https://cdn.dummyjson.com/products/images/laptops/Lenovo%20Yoga%20920/1.png',
      price: 42999, originalPrice: 49999,
      specs: ['RAM Size 16 GB', 'Internal Memory 512 GB', 'Number of Cores 14-Core'],
      description: 'The Lenovo IdeaPad Slim 5 is designed for productivity and entertainment. With Intel Core Ultra 7 processor and 16" WUXGA IPS display, it offers excellent performance and visuals for everyday computing.',
      freeDelivery: true, isExpress: false, deliveryDate: '10 March',
    },
    {
      id: 104, brand: 'HP', rating: 4.0, reviews: 203, stock: 5,
      name: 'HP Pavilion 14" FHD Touch Laptop, Intel Core i7-1355U, 8GB DDR4, 256GB SSD, Windows 11',
      images: [
        'https://cdn.dummyjson.com/products/images/laptops/HP%20Pavilion%2015%20DK1056WM/1.png',
        'https://cdn.dummyjson.com/products/images/laptops/HP%20Pavilion%2015%20DK1056WM/2.png',
        'https://cdn.dummyjson.com/products/images/laptops/HP%20Pavilion%2015%20DK1056WM/3.png',
      ],
      image: 'https://cdn.dummyjson.com/products/images/laptops/HP%20Pavilion%2015%20DK1056WM/1.png',
      price: 35800, originalPrice: 41000,
      specs: ['RAM Size 8 GB', 'Internal Memory 256 GB', 'Number of Cores 10-Core'],
      description: 'The HP Pavilion 14 features a 14" FHD touchscreen, Intel Core i7 processor, and a sleek design. Perfect for students and professionals seeking a reliable, portable laptop.',
      freeDelivery: true, isExpress: true, deliveryDate: '8 March', orderIn: '3h 20m',
    },
  ],
  3: [
    {
      id: 301, brand: 'Essence', rating: 4.7, reviews: 1200, stock: 50,
      name: 'Essence Mascara Lash Princess False Lash Effect Waterproof, Gluten & Cruelty Free',
      images: [
        'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png',
      ],
      image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png',
      price: 299, originalPrice: 450,
      specs: ['Waterproof', 'Long-lasting'],
      description: 'The Essence Lash Princess False Lash Effect Mascara gives you dramatic lash volume and a false lash look. Waterproof formula ensures long-lasting wear. Cruelty-free and gluten-free.',
      freeDelivery: true, isExpress: true, deliveryDate: '7 March', orderIn: '6h 50m',
    },
    {
      id: 302, brand: 'Morphe', rating: 4.4, reviews: 340, stock: 20,
      name: 'Eyeshadow Palette with Mirror - 12 Colors Matte & Shimmer, Long-lasting, Blendable',
      images: [
        'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png',
      ],
      image: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png',
      price: 549, originalPrice: 799,
      specs: ['12 Colors', 'With Mirror'],
      description: 'A versatile eyeshadow palette featuring 12 highly pigmented colors in matte and shimmer finishes. Built-in mirror for on-the-go application.',
      freeDelivery: true, isExpress: false, deliveryDate: '9 March',
    },
  ],
  7: [
    {
      id: 701, brand: 'Samsung', rating: 4.6, reviews: 890, stock: 8,
      name: 'Samsung Galaxy S24 Ultra 5G Dual SIM Smartphone, 256GB 12GB RAM, Titanium Gray',
      images: [
        'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S24/1.png',
        'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S24/2.png',
      ],
      image: 'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S24/1.png',
      price: 52999, originalPrice: 59999,
      specs: ['RAM 12 GB', 'Storage 256 GB', '5G Connectivity'],
      description: 'The Samsung Galaxy S24 Ultra features the most advanced Galaxy AI, stunning 200MP camera, titanium frame, and S Pen built-in. With 12GB RAM and Snapdragon 8 Gen 3 processor.',
      freeDelivery: true, isExpress: true, deliveryDate: '7 March', orderIn: '4h 15m',
    },
    {
      id: 702, brand: 'Apple', rating: 4.8, reviews: 2100, stock: 4,
      name: 'iPhone 15 Pro Max 256GB Natural Titanium, A17 Pro Chip, 48MP Camera System',
      images: [
        'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro/1.png',
        'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro/2.png',
        'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro/3.png',
        'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro/4.png',
      ],
      image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro/1.png',
      price: 69999, originalPrice: 74999,
      specs: ['RAM 8 GB', 'Storage 256 GB', 'A17 Pro Chip'],
      description: 'iPhone 15 Pro Max features a strong and light titanium design with A17 Pro chip, the most powerful chip ever in a smartphone. Advanced 48MP camera system and USB-C connectivity.',
      freeDelivery: true, isExpress: true, deliveryDate: '7 March', orderIn: '2h 45m',
      coupon: 'Get 3000 EGP OFF',
    },
  ],
};

const DEFAULT_PRODUCTS = [
  {
    id: 901, brand: 'Generic', rating: 4.0, reviews: 50, stock: 15,
    name: 'Premium Product Item with Modern Design and Quality Build Materials',
    images: ['https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/1.png'],
    image: 'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/1.png',
    price: 2999, originalPrice: 3999,
    specs: ['High Quality', 'Modern Design'],
    description: 'A premium product featuring modern design aesthetics and high-quality build materials for lasting durability.',
    freeDelivery: true, isExpress: true, deliveryDate: '8 March', orderIn: '5h 00m',
  },
  {
    id: 902, brand: 'TopBrand', rating: 4.8, reviews: 320, stock: 25,
    name: 'Best Seller - Top Rated Item with Outstanding Customer Reviews',
    images: ['https://cdn.dummyjson.com/products/images/kitchen-accessories/Cleaning%20Spray/1.png'],
    image: 'https://cdn.dummyjson.com/products/images/kitchen-accessories/Cleaning%20Spray/1.png',
    price: 1499, originalPrice: 1999,
    specs: ['Top Rated', 'Best Seller'],
    description: 'Our best-selling product with outstanding customer reviews. Combines excellent quality with affordable pricing.',
    freeDelivery: true, isExpress: false, deliveryDate: '10 March',
  },
];

// ══════════════════════════════
// ── Product Detail View ──
// ══════════════════════════════
const ProductDetailView = ({ product, onBack }: { product: any; onBack: () => void }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);

  const images = product.images || [product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <View style={dStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={dStyles.header}>
        <TouchableOpacity onPress={onBack} style={dStyles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={dStyles.headerSearch}>
          <Ionicons name="search" size={18} color="#999" />
          <Text style={dStyles.headerSearchText}>Search</Text>
        </View>
        <TouchableOpacity onPress={() => setIsFav(!isFav)} style={dStyles.headerBtn}>
          <Ionicons name={isFav ? "heart" : "heart-outline"} size={22} color={isFav ? "#E53935" : "#1A1A1A"} />
        </TouchableOpacity>
        <TouchableOpacity style={dStyles.headerBtn}>
          <Ionicons name="share-outline" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Image Carousel */}
        <View style={dStyles.imageCarousel}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32));
              setActiveImage(index);
            }}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={dStyles.imageSlide}>
                <Image source={{ uri: item }} style={dStyles.productMainImage} resizeMode="contain" />
              </View>
            )}
          />
          {/* Dots */}
          <View style={dStyles.dotRow}>
            {images.map((_: any, i: number) => (
              <View key={i} style={[dStyles.dot, activeImage === i && dStyles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Brand Row */}
        <View style={dStyles.brandRow}>
          <Text style={dStyles.brandName}>{product.brand}</Text>
          <TouchableOpacity style={dStyles.viewProducts}>
            <Text style={dStyles.viewProductsText}>View Products</Text>
            <Ionicons name="chevron-forward" size={16} color="#1565C0" />
          </TouchableOpacity>
        </View>

        {/* Product Name */}
        <View style={dStyles.nameSection}>
          <Text style={dStyles.productName}>{product.name}</Text>
        </View>

        {/* Rating */}
        <View style={dStyles.ratingRow}>
          <Text style={dStyles.ratingScore}>{product.rating}</Text>
          <Ionicons name="star" size={14} color="#4CAF50" />
          <View style={dStyles.ratingDivider} />
          <Text style={dStyles.ratingLabel}>Brand Rating</Text>
          <Text style={dStyles.reviewCount}>({product.reviews} reviews)</Text>
        </View>

        {/* Price */}
        <View style={dStyles.priceSection}>
          <View style={dStyles.priceRow}>
            <Text style={dStyles.priceCurrency}>EGP </Text>
            <Text style={dStyles.priceValue}>{product.price.toLocaleString()}</Text>
          </View>
          {product.originalPrice && (
            <View style={dStyles.discountRow}>
              <Text style={dStyles.originalPrice}>EGP {product.originalPrice.toLocaleString()}</Text>
              <View style={dStyles.discountBadge}>
                <Text style={dStyles.discountText}>{discount}% OFF</Text>
              </View>
            </View>
          )}
          <Text style={dStyles.vatNote}>Inclusive of VAT</Text>
        </View>

        {/* Stock */}
        {product.stock <= 10 && (
          <View style={dStyles.stockRow}>
            <Ionicons name="lock-closed" size={14} color="#E65100" />
            <Text style={dStyles.stockText}>Only {product.stock} left in stock</Text>
          </View>
        )}

        {/* Coupon */}
        {product.coupon && (
          <View style={dStyles.couponSection}>
            <View style={dStyles.couponBadge}>
              <Ionicons name="pricetag" size={14} color="#F57F17" />
              <Text style={dStyles.couponText}>{product.coupon}</Text>
            </View>
          </View>
        )}

        {/* Divider */}
        <View style={dStyles.divider} />

        {/* Delivery Information */}
        <View style={dStyles.deliverySection}>
          <Text style={dStyles.sectionTitle}>Delivery Information</Text>
          {product.isExpress && (
            <View style={dStyles.expressDelivery}>
              <View style={dStyles.expressBadge}>
                <Text style={dStyles.expressText}>express</Text>
              </View>
              <Text style={dStyles.deliveryDate}>Get it by <Text style={{ fontWeight: '700' }}>{product.deliveryDate}</Text></Text>
              {product.orderIn && (
                <Text style={dStyles.orderIn}>Order in {product.orderIn}</Text>
              )}
            </View>
          )}
          {product.freeDelivery && (
            <View style={dStyles.freeDeliveryRow}>
              <MaterialCommunityIcons name="truck-fast" size={16} color="#00796B" />
              <Text style={dStyles.freeDeliveryText}>Free Delivery</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={dStyles.divider} />

        {/* Specs */}
        <View style={dStyles.specsSection}>
          <Text style={dStyles.sectionTitle}>Specifications</Text>
          {product.specs?.map((spec: string, i: number) => (
            <View key={i} style={dStyles.specRow}>
              <View style={dStyles.specDot} />
              <Text style={dStyles.specText}>{spec}</Text>
            </View>
          ))}
        </View>

        {/* Divider */}
        <View style={dStyles.divider} />

        {/* Description */}
        <View style={dStyles.descSection}>
          <Text style={dStyles.sectionTitle}>Description</Text>
          <Text style={dStyles.descText}>{product.description}</Text>
        </View>

      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={dStyles.bottomBar}>
        <View style={dStyles.qtyBox}>
          <Text style={dStyles.qtyLabel}>QTY</Text>
          <View style={dStyles.qtyControls}>
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={dStyles.qtyBtn}>
              <Ionicons name="remove" size={16} color="#666" />
            </TouchableOpacity>
            <Text style={dStyles.qtyValue}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={dStyles.qtyBtn}>
              <Ionicons name="add" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={dStyles.addToCartBtn} activeOpacity={0.85}>
          <Text style={dStyles.addToCartText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ══════════════════════════════
// ── Product Card Component ──
// ══════════════════════════════
const ProductCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <TouchableOpacity style={pStyles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={pStyles.imageSection}>
        <Image source={{ uri: item.image }} style={pStyles.productImage} resizeMode="contain" />
        <TouchableOpacity style={pStyles.heartBtn}>
          <Ionicons name="heart-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>
      <View style={pStyles.infoSection}>
        <Text style={pStyles.productName} numberOfLines={2}>{item.name}</Text>
        {item.specs && (
          <View style={pStyles.specsRow}>
            {item.specs.map((spec: string, i: number) => (
              <Text key={i} style={pStyles.specText}>{spec}</Text>
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
        {item.freeDelivery && (
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
            <Text style={pStyles.deliveryDateText}>Get it by <Text style={{ fontWeight: '700' }}>{item.deliveryDate}</Text></Text>
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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Handle categoryId param from HomeScreen navigation
  useEffect(() => {
    if (route.params?.categoryId) {
      setSelectedCategory(route.params.categoryId);
      // Clear the param so it doesn't persist on tab re-focus
      navigation.setParams({ categoryId: undefined });
    }
  }, [route.params?.categoryId]);

  const getProducts = () => {
    if (!selectedCategory) return [];
    return CATEGORY_PRODUCTS[selectedCategory] || DEFAULT_PRODUCTS;
  };

  const getCategoryName = () => {
    const cat = CATEGORIES_DATA.find(c => c.id === selectedCategory);
    return cat ? cat.name.replace('\n', ' ') : '';
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', { product });
  };

  // ── Product List View ──
  if (selectedCategory) {
    const products = getProducts();
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.header}>
          <View style={styles.headerInnerProducts}>
            <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerSearchWrap}>
              <SearchBar placeholder="Search" />
            </View>
          </View>
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.expressFilterTag}>
            <View style={styles.filterCheckbox} />
            <Text style={styles.expressFilterText}>express</Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <TouchableOpacity style={styles.filterPill}>
              <Text style={styles.filterPillText}>Price</Text>
              <Ionicons name="chevron-down" size={14} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterPill}>
              <Text style={styles.filterPillText}>Brand</Text>
              <Ionicons name="chevron-down" size={14} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterPill}>
              <Text style={styles.filterPillText}>Rating</Text>
              <Ionicons name="chevron-down" size={14} color="#666" />
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.categoryLabel}>
          <Text style={styles.categoryLabelText}>{getCategoryName()}</Text>
          <Text style={styles.resultCount}>{products.length} results</Text>
        </View>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard item={item} onPress={() => handleProductPress(item)} />
          )}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={{ height: 80 }} />}
        />
        <View style={styles.floatingBar}>
          <TouchableOpacity style={styles.floatingButton}>
            <Text style={styles.floatingText}>Sort</Text>
            <Ionicons name="swap-vertical" size={16} color={COLORS.white} />
            <View style={styles.floatingDivider} />
            <Text style={styles.floatingText}>Filter</Text>
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
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Ionicons name="bag-handle" size={22} color="#FFF" />
          <Text style={styles.brandNameHeader}>Safqa</Text>
        </View>
      </View>
      <View style={styles.searchWrap}>
        <SearchBar placeholder="What are you looking for?" />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Categories</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContent}>
        <View style={styles.grid}>
          {CATEGORIES_DATA.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard} activeOpacity={0.8} onPress={() => setSelectedCategory(category.id)}>
              <View style={styles.categoryImageWrapper}>
                <Image source={{ uri: category.image }} style={styles.categoryImage} resizeMode="contain" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  header: { backgroundColor: COLORS.primary },
  headerInner: { paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 0) + 12, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' },
  headerInnerProducts: { paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 0) + 12, paddingHorizontal: 8, paddingBottom: 8, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  headerSearchWrap: { flex: 1, marginLeft: 4 },
  brandNameHeader: { fontSize: 26, fontWeight: '900', color: '#FFF', marginLeft: 8, letterSpacing: 1.5 },
  searchWrap: { backgroundColor: COLORS.white, paddingBottom: 4 },
  titleContainer: { paddingHorizontal: 16, paddingBottom: 10, paddingTop: 4 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  scrollView: { flex: 1 },
  gridContent: { paddingHorizontal: CARD_PADDING },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: { width: CARD_WIDTH, marginBottom: 14, alignItems: 'center' },
  categoryImageWrapper: { width: CARD_WIDTH, height: CARD_WIDTH, borderRadius: 16, backgroundColor: '#EEEDF5', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  categoryImage: { width: '70%', height: '70%' },
  categoryName: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '600', textAlign: 'center', marginTop: 8, lineHeight: 16 },
  filterRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, gap: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  expressFilterTag: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  filterCheckbox: { width: 14, height: 14, borderRadius: 3, borderWidth: 1.5, borderColor: '#CCC', marginRight: 6 },
  expressFilterText: { fontSize: 13, fontWeight: '700', fontStyle: 'italic', color: COLORS.textPrimary },
  filterPill: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, gap: 4 },
  filterPillText: { fontSize: 12, color: '#666', fontWeight: '500' },
  categoryLabel: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryLabelText: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  resultCount: { fontSize: 12, color: '#999', fontWeight: '500' },
  productList: { paddingHorizontal: 16 },
  separator: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },
  floatingBar: { position: 'absolute', bottom: 20, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' },
  floatingButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 30, paddingHorizontal: 24, paddingVertical: 12, gap: 6, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  floatingText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  floatingDivider: { width: 1, height: 16, backgroundColor: '#555', marginHorizontal: 4 },
});

// ── Product Card Styles ──
const pStyles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 14, gap: 12 },
  imageSection: { width: 130, height: 140, borderRadius: 12, backgroundColor: '#F8F8F8', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  productImage: { width: '80%', height: '80%' },
  heartBtn: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2 },
  infoSection: { flex: 1, justifyContent: 'flex-start' },
  productName: { fontSize: 14, fontWeight: '500', color: '#1A1A1A', lineHeight: 20, marginBottom: 6 },
  specsRow: { gap: 2, marginBottom: 8 },
  specText: { fontSize: 12, color: '#888', fontWeight: '400' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  currency: { fontSize: 12, color: '#1A1A1A', fontWeight: '500' },
  price: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  discountRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  originalPrice: { fontSize: 12, color: '#AAA', textDecorationLine: 'line-through' },
  discountBadgeText: { fontSize: 12, fontWeight: '700', color: '#4CAF50' },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  freeDeliveryText: { fontSize: 12, color: '#00796B', fontWeight: '600' },
  couponBadge: { marginTop: 6, alignSelf: 'flex-start', borderWidth: 1.5, borderColor: '#FFC107', borderStyle: 'dashed', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#FFFDE7' },
  couponText: { fontSize: 11, fontWeight: '700', color: '#F57F17' },
  expressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  expressBadge: { backgroundColor: COLORS.primary, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  expressTextSmall: { fontSize: 11, fontWeight: '800', color: '#FFF', fontStyle: 'italic' },
  deliveryDateText: { fontSize: 12, color: '#444', fontWeight: '400' },
});

// ── Product Detail Styles ──
const dStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 0) + 12, paddingHorizontal: 8, paddingBottom: 8, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerSearch: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 24, paddingHorizontal: 14, paddingVertical: 8, marginHorizontal: 4, gap: 8 },
  headerSearchText: { fontSize: 14, color: '#999', fontWeight: '400' },
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
  ratingLabel: { fontSize: 13, color: '#888', fontWeight: '400' },
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
  deliveryDate: { fontSize: 14, color: '#1A1A1A', fontWeight: '400' },
  orderIn: { fontSize: 12, fontWeight: '600', color: '#4CAF50' },
  freeDeliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  freeDeliveryText: { fontSize: 13, color: '#00796B', fontWeight: '600' },
  specsSection: { paddingHorizontal: 16, paddingVertical: 14 },
  specRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  specDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  specText: { fontSize: 14, color: '#444', fontWeight: '400' },
  descSection: { paddingHorizontal: 16, paddingVertical: 14 },
  descText: { fontSize: 14, color: '#555', lineHeight: 22, fontWeight: '400' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#F0F0F0', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 6, gap: 12 },
  qtyBox: { alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 4 },
  qtyLabel: { fontSize: 10, fontWeight: '600', color: '#AAA' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', minWidth: 20, textAlign: 'center' },
  addToCartBtn: { flex: 1, backgroundColor: '#3F6CDF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  addToCartText: { fontSize: 16, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
});

export default CategoriesScreen;
