import React from 'react';
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
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

const SOCIAL_ICONS = [
  { id: 'fb', name: 'facebook', icon: 'logo-facebook' },
  { id: 'tw', name: 'x', icon: 'close' },
  { id: 'ig', name: 'instagram', icon: 'logo-instagram' },
  { id: 'li', name: 'linkedin', icon: 'logo-linkedin' },
];

const AccountScreen: React.FC = () => {
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
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting Card */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingTitle}>Ahlan! Nice to meet you</Text>
          <Text style={styles.greetingSubtitle}>
            The region's favorite online marketplace
          </Text>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton}>
            <View style={styles.loginIconWrapper}>
              <Ionicons name="person-outline" size={16} color={COLORS.white} />
            </View>
            <Text style={styles.loginText}>Log in / Sign Up</Text>
          </TouchableOpacity>
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
                <Text style={styles.safqaLogoText}>safqa</Text>
              </View>
            </View>
          </View>
          <View style={styles.promoRight}>
            <Text style={styles.promoDiscount}>
              5% discount up to EGP{'\n'}
              <Text style={{ ...FONTS.bold }}>150</Text> with your CIB safqa{'\n'}credit card
            </Text>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyText}>APPLY NOW</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={styles.settingsTitle}>Settings</Text>

        <View style={styles.settingsCard}>
          {/* Country */}
          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <Ionicons name="globe-outline" size={22} color={COLORS.textSecondary} />
              <Text style={styles.settingsLabel}>Country</Text>
            </View>
            <View style={styles.settingsRowRight}>
              <Text style={styles.settingsValue}>🇪🇬</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </View>
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          {/* Language */}
          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <MaterialCommunityIcons name="translate" size={22} color={COLORS.textSecondary} />
              <Text style={styles.settingsLabel}>Language</Text>
            </View>
            <View style={styles.settingsRowRight}>
              <Text style={styles.settingsValue}>العربية</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </View>
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          {/* Preferences */}
          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <Ionicons name="options-outline" size={22} color={COLORS.textSecondary} />
              <Text style={styles.settingsLabel}>Preferences</Text>
            </View>
            <View style={styles.settingsRowRight}>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Sell With Us */}
        <TouchableOpacity style={styles.sellLink}>
          <Text style={styles.sellLinkText}>Sell with us</Text>
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
        <View style={styles.footerLinks}>
          <Text style={styles.footerLink}>Terms Of Use</Text>
          <Text style={styles.footerDot}>·</Text>
          <Text style={styles.footerLink}>Terms Of Sale</Text>
          <Text style={styles.footerDot}>·</Text>
          <Text style={styles.footerLink}>Privacy Policy</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
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
  loginIconWrapper: {
    backgroundColor: COLORS.textSecondary,
    borderRadius: SIZES.radiusFull,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: COLORS.white,
    fontSize: SIZES.fontMd,
    ...FONTS.semiBold,
  },

  // Credit Card Promo
  promoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  promoLeft: {
    width: '40%',
    backgroundColor: COLORS.primary,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoCardBrand: {
    alignItems: 'center',
  },
  creditCardIcon: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  visaText: {
    color: COLORS.white,
    fontSize: SIZES.fontMd,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  platinumText: {
    color: COLORS.white,
    fontSize: SIZES.fontXs,
    opacity: 0.8,
  },
  safqaLogo: {
    marginTop: 4,
  },
  safqaLogoText: {
    color: COLORS.white,
    fontSize: SIZES.fontTitle,
    ...FONTS.bold,
  },
  promoRight: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  promoDiscount: {
    fontSize: SIZES.fontSm,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.textPrimary,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 8,
  },
  applyText: {
    color: COLORS.white,
    fontSize: SIZES.fontSm,
    ...FONTS.bold,
  },

  // Settings
  settingsTitle: {
    fontSize: SIZES.fontLg,
    ...FONTS.bold,
    color: COLORS.textPrimary,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: SIZES.radiusLg,
    ...SHADOWS.small,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    ...FONTS.medium,
  },
  settingsValue: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: 16,
  },

  // Sell with us
  sellLink: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 16,
  },
  sellLinkText: {
    fontSize: SIZES.fontMd,
    color: COLORS.secondary,
    ...FONTS.semiBold,
  },

  // Social
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
  },
  footerLink: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
  },
  footerDot: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
  },
});

export default AccountScreen;
