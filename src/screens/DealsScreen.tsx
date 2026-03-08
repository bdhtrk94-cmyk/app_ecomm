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
import { bannersApi, productsApi } from '../services/api';
import { useSettingsStore } from '../store/settingsStore';
import { t } from '../constants/i18n';

const BG_COLORS = ['#F5F0EB', '#FCE4EC', '#E8F5E9', '#E3F2FD', '#FFF3E0'];
const LABEL_COLORS = ['#2E7D32', '#C2185B', '#2E7D32', '#1565C0', '#EF6C00'];

const API_STORAGE_URL = 'http://10.0.2.2:8000/storage/';

const mapApiBanner = (b: any) => ({
  id: b.id,
  image: b.image_url || b.image || (b.image_path ? `${API_STORAGE_URL}${b.image_path}` : null),
  backgroundColor: '#1B5E20',
  title: b.title_en || b.title,
  link: b.link_url || b.link,
});

const DealsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [expressEnabled, setExpressEnabled] = useState(false);
  const { language } = useSettingsStore();
  const tr = t(language);
  const isAr = language === 'ar';

  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, catsRes, dealsRes] = await Promise.allSettled([
          bannersApi.list(),
          productsApi.categories(),
          productsApi.list({ page: 1 })
        ]);

        if (bannersRes.status === 'fulfilled') {
          const data = bannersRes.value.data?.data || bannersRes.value.data || [];
          const mapped = Array.isArray(data) ? data.map(mapApiBanner).filter((b: any) => !!b.image) : [];
          setBanners(mapped);
        }

        if (catsRes.status === 'fulfilled') {
          const data = catsRes.value.data?.data || catsRes.value.data || [];
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data.slice(0, 10).map((c: any) => ({
              id: c.id,
              name: c.name_en || c.name || 'Category',
              nameAr: c.name_ar || c.name_en || c.name || 'فئة',
              image: c.image_url || c.image || 'https://picsum.photos/id/1/120/120',
            })));
          }
        }

        if (dealsRes.status === 'fulfilled') {
          const raw = dealsRes.value.data;
          const items = raw?.data?.data || raw?.data || [];
          if (Array.isArray(items)) {
            setDeals(items.slice(0, 8).map((p: any, i: number) => ({
              id: p.id,
              title: (p.name_en || p.name || 'Deal').split(' ').slice(0, 2).join(' '),
              titleAr: (p.name_ar || p.name_en || p.name || 'عرض').split(' ').slice(0, 2).join(' '),
              image: p.primary_image?.url || p.images?.[0]?.url || 'https://picsum.photos/id/1/200/200',
              bgColor: BG_COLORS[i % BG_COLORS.length],
              labelColor: LABEL_COLORS[i % LABEL_COLORS.length],
              discount: p.discount_percentage
                ? (isAr ? `خصم ${p.discount_percentage}%` : `Up to ${p.discount_percentage}% off`)
                : (isAr ? 'عرض خاص' : 'Special Offer'),
            })));
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [language]); // refetch when language changes

  const handleCategoryPress = (cat: any) => {
    navigation.navigate('Categories', { categoryId: cat.id });
  };

  const handleMegaDealPress = (deal: any) => {
    // Navigate to categories since deals doesn't have a direct product mapping in this simplified mock
    navigation.navigate('Categories', { categoryId: undefined });
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
        <SearchBar placeholder={isAr ? 'بحث...' : 'Search'} />
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
            {isAr ? 'إكسبريس' : 'express'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="settings-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.filterButtonText}>{isAr ? 'عروض' : 'Deals'}</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="tag-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.filterButtonText}>{isAr ? 'الماركة' : 'Brand'}</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        {banners.length > 0 && <BannerCarousel banners={banners} height={180} />}

        {/* Categories - up to 2 rows */}
        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            <View style={styles.categoriesColumn}>
              <View style={styles.categoriesRow}>
                {categories.slice(0, 5).map((cat) => (
                  <CategoryIcon
                    key={cat.id}
                    name={isAr ? (cat.nameAr || cat.name) : cat.name}
                    image={cat.image}
                    isDome
                    onPress={() => handleCategoryPress(cat)}
                  />
                ))}
              </View>
              {categories.length > 5 && (
                <View style={styles.categoriesRow}>
                  {categories.slice(5, 10).map((cat) => (
                    <CategoryIcon
                      key={cat.id}
                      name={isAr ? (cat.nameAr || cat.name) : cat.name}
                      image={cat.image}
                      onPress={() => handleCategoryPress(cat)}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        )}

        {/* ── Mega Deals Section ── */}
        <View style={styles.megaDealsContainer}>
          <View style={styles.megaDealsHeader}>
            <Text style={styles.megaDealsStars}>✦  ✦  ✦</Text>
            <Text style={styles.megaDealsTitle}>{isAr ? 'عروض مميزة' : 'Mega Deals'}</Text>
            <Text style={styles.megaDealsSubtitle}>{isAr ? 'عروض لفترة محدودة' : 'Limited time offers'}</Text>
          </View>

          <View style={styles.megaDealsBody}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.megaDealsScroll}
            >
              {deals.map((deal) => (
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
