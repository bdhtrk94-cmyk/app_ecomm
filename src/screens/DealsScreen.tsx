import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import SearchBar from '../components/SearchBar';
import BannerCarousel from '../components/BannerCarousel';
import CategoryIcon from '../components/CategoryIcon';

const DEALS_BANNERS = [
  { id: 1, image: 'https://picsum.photos/id/119/600/250', backgroundColor: '#7B1FA2' },
  { id: 2, image: 'https://picsum.photos/id/244/600/250', backgroundColor: '#F58634' },
];

const DEAL_CATEGORIES = [
  { id: 1, name: 'Coupon\nSavings', image: 'https://picsum.photos/id/60/120/120' },
  { id: 2, name: 'Home &\nKitchen', image: 'https://picsum.photos/id/225/120/120' },
  { id: 3, name: 'Beauty', image: 'https://picsum.photos/id/152/120/120' },
  { id: 4, name: "Women's\nFashion", image: 'https://picsum.photos/id/177/120/120' },
  { id: 5, name: 'Mobiles', image: 'https://picsum.photos/id/160/120/120' },
];

const DEAL_CATEGORIES_2 = [
  { id: 6, name: 'Supermarket', image: 'https://picsum.photos/id/292/120/120' },
  { id: 7, name: 'Appliances', image: 'https://picsum.photos/id/202/120/120' },
  { id: 8, name: "Men's\nFashion", image: 'https://picsum.photos/id/64/120/120' },
  { id: 9, name: "Kids'\nFashion", image: 'https://picsum.photos/id/198/120/120' },
  { id: 10, name: 'Electronics', image: 'https://picsum.photos/id/201/120/120' },
];

const MEGA_DEALS = [
  {
    id: 1,
    title: 'Fashion deals',
    image: 'https://cdn.dummyjson.com/products/images/tops/Blue%20Women\'s%20Handbag/1.png',
    bgColor: '#F5F0EB',
    labelColor: '#2E7D32',
    discount: 'Up to 80% off',
  },
  {
    id: 2,
    title: 'Health deals',
    image: 'https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Helmet/1.png',
    bgColor: '#E8174E',
    labelColor: '#5C35A8',
    discount: 'Up to 10% off',
  },
  {
    id: 3,
    title: 'Home deals',
    image: 'https://cdn.dummyjson.com/products/images/furniture/Knoll%20Saarinen%20Executive%20Conference%20Chair/1.png',
    bgColor: '#E0F2F1',
    labelColor: '#00695C',
    discount: 'Up to 20% off',
  },
  {
    id: 4,
    title: 'TVs deals',
    image: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png',
    bgColor: '#0D1B2A',
    labelColor: '#1A237E',
    discount: 'Up to 40% off',
  },
];

// Map deal category names to CategoriesScreen category IDs
const DEAL_CAT_MAP: Record<string, number> = {
  'Coupon\nSavings': 1,
  'Home &\nKitchen': 8,
  'Beauty': 3,
  "Women's\nFashion": 5,
  'Mobiles': 7,
  'Supermarket': 10,
  'Appliances': 2,
  "Men's\nFashion": 4,
  "Kids'\nFashion": 6,
  'Electronics': 1,
};

const MEGA_DEAL_MAP: Record<string, number> = {
  'Fashion deals': 5,
  'Health deals': 3,
  'Home deals': 8,
  'TVs deals': 1,
};

const DealsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [expressEnabled, setExpressEnabled] = useState(false);

  const handleCategoryPress = (cat: any) => {
    const categoryId = DEAL_CAT_MAP[cat.name] || 1;
    navigation.navigate('Categories', { categoryId });
  };

  const handleMegaDealPress = (deal: any) => {
    const categoryId = MEGA_DEAL_MAP[deal.title] || 1;
    navigation.navigate('Categories', { categoryId });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Ionicons name="bag-handle" size={22} color="#FFF" />
          <Text style={styles.brandName}>Safqa</Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar placeholder="Search" />
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.expressTag, expressEnabled && styles.expressTagActive]}
          onPress={() => setExpressEnabled(!expressEnabled)}
        >
          <View style={[styles.checkbox, expressEnabled && styles.checkboxActive]}>
            {expressEnabled && <Ionicons name="checkmark" size={12} color={COLORS.white} />}
          </View>
          <Text style={[styles.expressText, expressEnabled && styles.expressTextActive]}>
            express
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="settings-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.filterButtonText}>Deals</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="tag-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.filterButtonText}>Brand</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <BannerCarousel banners={DEALS_BANNERS} height={180} />

        {/* Categories - 2 rows, scroll together */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <View style={styles.categoriesColumn}>
            {/* Row 1 */}
            <View style={styles.categoriesRow}>
              {DEAL_CATEGORIES.map((cat) => (
                <CategoryIcon
                  key={cat.id}
                  name={cat.name}
                  image={cat.image}
                  isDome
                  onPress={() => handleCategoryPress(cat)}
                />
              ))}
            </View>
            {/* Row 2 */}
            <View style={styles.categoriesRow}>
              {DEAL_CATEGORIES_2.map((cat) => (
                <CategoryIcon
                  key={cat.id}
                  name={cat.name}
                  image={cat.image}
                  onPress={() => handleCategoryPress(cat)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* ── Mega Deals Section ── */}
        <View style={styles.megaDealsContainer}>
          <View style={styles.megaDealsHeader}>
            <Text style={styles.megaDealsStars}>✦  ✦  ✦</Text>
            <Text style={styles.megaDealsTitle}>Mega Deals</Text>
            <Text style={styles.megaDealsSubtitle}>Limited time offers</Text>
          </View>

          <View style={styles.megaDealsBody}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.megaDealsScroll}
            >
              {MEGA_DEALS.map((deal) => (
                <TouchableOpacity key={deal.id} activeOpacity={0.9} style={styles.megaDealCardOuter} onPress={() => handleMegaDealPress(deal)}>
                  <View style={styles.megaDealCard}>
                    <View style={[styles.megaDealImageArea, { backgroundColor: deal.bgColor }]}>
                      <View style={[styles.megaDealLabel, { backgroundColor: deal.labelColor }]}>
                        <Text style={styles.megaDealLabelText}>{deal.title}</Text>
                      </View>
                      <Image source={{ uri: deal.image }} style={styles.megaDealImage} resizeMode="contain" />
                    </View>
                    <View style={styles.megaDealInfoArea}>
                      <Text style={styles.megaDealDiscount}>{deal.discount}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Floating Sort / Filter Button */}
      <View style={styles.floatingBar}>
        <TouchableOpacity style={styles.floatingButton}>
          <Text style={styles.floatingText}>Sort</Text>
          <Ionicons name="swap-vertical" size={16} color={COLORS.white} />
          <View style={styles.floatingDivider} />
          <Text style={styles.floatingText}>Filter</Text>
          <Ionicons name="filter" size={16} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  searchWrap: {
    backgroundColor: COLORS.white,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  expressTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  expressTagActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  expressText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    fontStyle: 'italic',
  },
  expressTextActive: {
    color: COLORS.primary,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  filterButtonText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  scrollView: {
    flex: 1,
  },
  categoryScroll: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoriesColumn: {
    flexDirection: 'column',
  },
  categoriesRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  // ── Mega Deals ──
  megaDealsContainer: {
    marginTop: 10,
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  megaDealsHeader: {
    backgroundColor: COLORS.primary,
    paddingTop: 14,
    paddingBottom: 10,
    alignItems: 'center',
  },
  megaDealsStars: {
    color: '#FFD700',
    fontSize: 10,
    letterSpacing: 6,
    marginBottom: 4,
  },
  megaDealsTitle: {
    fontSize: 20,
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
  megaDealCardOuter: {
    width: 140,
    marginRight: 8,
  },
  megaDealCard: {
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
  megaDealImageArea: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  megaDealLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  megaDealLabelText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  megaDealImage: {
    width: 85,
    height: 85,
  },
  megaDealInfoArea: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
  },
  megaDealDiscount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  floatingBar: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.textPrimary,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
    ...SHADOWS.large,
  },
  floatingText: {
    color: COLORS.white,
    fontSize: SIZES.fontMd,
    ...FONTS.bold,
  },
  floatingDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  shareButton: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusFull,
    padding: 10,
    ...SHADOWS.medium,
  },
});

export default DealsScreen;
