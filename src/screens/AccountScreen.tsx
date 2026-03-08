import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { useNavigation } from '@react-navigation/native';
import { t } from '../constants/i18n';

const AccountScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { language, toggleLanguage } = useSettingsStore();
  const navigation = useNavigation<any>();
  const tr = t(language);
  const isAr = language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Ionicons name="bag-handle" size={22} color="#FFF" />
          <Text style={styles.brandName}>{tr('appName')}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting Card */}
        <View style={[styles.greetingCard, { direction: dir } as any]}>
          <Text style={[styles.greetingTitle, { textAlign: isAr ? 'right' : 'left' }]}>
            {tr('greeting')} {user?.name}
          </Text>
          <Text style={[styles.greetingSubtitle, { textAlign: isAr ? 'right' : 'left' }]}>
            {user?.email}
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <TouchableOpacity
              style={[styles.loginButton, { flex: 1, backgroundColor: COLORS.primary }]}
              onPress={() => navigation.navigate('Orders')}
            >
              <Ionicons name="cube-outline" size={16} color={COLORS.white} />
              <Text style={styles.loginText}>{tr('myOrders')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, { flex: 1, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E8E8E8' }]}
              onPress={logout}
            >
              <Ionicons name="log-out-outline" size={16} color={COLORS.textPrimary} />
              <Text style={[styles.loginText, { color: COLORS.textPrimary }]}>{tr('logout')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Credit Card Promo */}
        <View style={styles.promoCard}>
          <View style={styles.promoLeft}>
            <View style={styles.promoCardBrand}>
              <View style={styles.creditCardIcon}>
                <Text style={styles.visaText}>VISA</Text>
                <Text style={styles.platinumText}>Platinum</Text>
              </View>
              <View style={styles.safqaLogo}>
                <Text style={styles.safqaLogoText}>{tr('appName').toLowerCase()}</Text>
              </View>
            </View>
          </View>
          <View style={styles.promoRight}>
            <Text style={[styles.promoDiscount, { textAlign: 'left' }]}>
              {isAr ? 'خصم 5% حتى 150 جنيه' : '5% discount up to EGP\n150 with your CIB safqa\ncredit card'}
            </Text>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyText}>{tr('applyNow')}</Text>
              <Ionicons name={isAr ? 'arrow-back' : 'arrow-forward'} size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={[styles.settingsTitle, { textAlign: isAr ? 'right' : 'left' }]}>{tr('settings')}</Text>

        <View style={styles.settingsCard}>
          {/* Addresses */}
          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() => navigation.navigate('Addresses')}
          >
            <View style={styles.settingsRowLeft}>
              <Ionicons name="location-outline" size={22} color={COLORS.textSecondary} />
              <Text style={styles.settingsLabel}>{tr('addresses')}</Text>
            </View>
            <View style={styles.settingsRowRight}>
              <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={18} color={COLORS.textMuted} />
            </View>
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          {/* Country */}
          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <Ionicons name="globe-outline" size={22} color={COLORS.textSecondary} />
              <Text style={styles.settingsLabel}>{tr('country')}</Text>
            </View>
            <View style={styles.settingsRowRight}>
              <Text style={styles.settingsValue}>🇪🇬</Text>
              <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={18} color={COLORS.textMuted} />
            </View>
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          {/* Language */}
          <TouchableOpacity style={styles.settingsRow} onPress={toggleLanguage}>
            <View style={styles.settingsRowLeft}>
              <MaterialCommunityIcons name="translate" size={22} color={COLORS.textSecondary} />
              <Text style={styles.settingsLabel}>{tr('language')}</Text>
            </View>
            <View style={styles.settingsRowRight}>
              <Text style={styles.settingsValue}>{isAr ? 'العربية' : 'English'}</Text>
              <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={18} color={COLORS.textMuted} />
            </View>
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          {/* Preferences */}
          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <Ionicons name="options-outline" size={22} color={COLORS.textSecondary} />
              <Text style={styles.settingsLabel}>{tr('preferences')}</Text>
            </View>
            <View style={styles.settingsRowRight}>
              <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={18} color={COLORS.textMuted} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Sell With Us */}
        <TouchableOpacity style={styles.sellLink}>
          <Text style={styles.sellLinkText}>{tr('sellWithUs')}</Text>
        </TouchableOpacity>

        {/* Social Icons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-facebook" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome5 name="x-twitter" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-instagram" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-linkedin" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Footer Links */}
        <View style={[styles.footerLinks, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
          <Text style={styles.footerLink}>{tr('termsOfUse')}</Text>
          <Text style={styles.footerDot}>·</Text>
          <Text style={styles.footerLink}>{tr('termsOfSale')}</Text>
          <Text style={styles.footerDot}>·</Text>
          <Text style={styles.footerLink}>{tr('privacyPolicy')}</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 16 },
  header: { backgroundColor: COLORS.primary },
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

  // Greeting Card
  greetingCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: SIZES.radiusLg,
    padding: 20,
    ...SHADOWS.small,
  },
  greetingTitle: {
    fontSize: SIZES.fontXl,
    ...FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textPrimary,
    borderRadius: SIZES.radiusFull,
    paddingVertical: 12,
    gap: 8,
  },
  loginText: {
    color: COLORS.white,
    fontSize: SIZES.fontMd,
    ...FONTS.semiBold,
  },

  // Promo Card
  promoCard: {
    backgroundColor: '#1B5E20',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  promoLeft: { flex: 1, justifyContent: 'center' },
  promoRight: { flex: 2, paddingLeft: 12 },
  promoCardBrand: { gap: 6 },
  creditCardIcon: {
    backgroundColor: '#FFD700',
    borderRadius: 6,
    padding: 6,
    width: 64,
    alignItems: 'center',
  },
  visaText: { fontSize: 14, fontWeight: '900', color: '#1B3A5E', letterSpacing: 1 },
  platinumText: { fontSize: 8, color: '#1B3A5E' },
  safqaLogo: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: 4, width: 64, alignItems: 'center' },
  safqaLogoText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  promoDiscount: { color: '#FFF', fontSize: SIZES.fontSm, lineHeight: 20, marginBottom: 10 },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusFull,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  applyText: { color: '#FFF', fontSize: SIZES.fontSm, fontWeight: '700' },

  // Settings
  settingsTitle: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: SIZES.radiusLg,
    ...SHADOWS.small,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingsLabel: {
    fontSize: SIZES.fontMd,
    color: COLORS.textPrimary,
  },
  settingsValue: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },

  // Footer
  sellLink: { alignItems: 'center', marginTop: 20, marginBottom: 8 },
  sellLinkText: { fontSize: SIZES.fontMd, color: COLORS.primary, fontWeight: '600' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 8 },
  socialIcon: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  footerLink: { fontSize: SIZES.fontXs, color: COLORS.textSecondary },
  footerDot: { fontSize: SIZES.fontXs, color: COLORS.textMuted },
});

export default AccountScreen;
