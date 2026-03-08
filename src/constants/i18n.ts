/**
 * Centralized app strings for English / Arabic localization.
 * Usage: const t = useT(); then t.greetings, etc.
 */

export type Lang = 'en' | 'ar';

export const strings = {
    // ── Common ─────────────────────────────────────────────
    appName: { en: 'Safqa', ar: 'صفقة' },
    ok: { en: 'OK', ar: 'حسنًا' },
    cancel: { en: 'Cancel', ar: 'إلغاء' },
    viewCart: { en: 'View Cart', ar: 'عرض السلة' },
    addedToCart: { en: 'Added to Cart', ar: 'أضيف إلى السلة' },
    search: { en: 'Search', ar: 'بحث' },
    loading: { en: 'Loading…', ar: 'جارٍ التحميل…' },
    noData: { en: 'No data found', ar: 'لا توجد بيانات' },

    // ── HomeScreen ─────────────────────────────────────────
    flashDeals: { en: '⚡ Flash Deals', ar: '⚡ عروض خاطفة' },
    recommended: { en: '🛍 Recommended', ar: '🛍 مُوصى به' },
    seeAll: { en: 'See All', ar: 'عرض الكل' },
    categories: { en: 'Categories', ar: 'الفئات' },

    // ── AccountScreen ──────────────────────────────────────
    greeting: { en: 'Ahlan!', ar: 'أهلاً!' },
    myOrders: { en: 'My Orders', ar: 'طلباتي' },
    logout: { en: 'Logout', ar: 'تسجيل خروج' },
    settings: { en: 'Settings', ar: 'الإعدادات' },
    addresses: { en: 'Addresses', ar: 'العناوين' },
    country: { en: 'Country', ar: 'الدولة' },
    language: { en: 'Language', ar: 'اللغة' },
    preferences: { en: 'Preferences', ar: 'التفضيلات' },
    sellWithUs: { en: 'Sell with us', ar: 'بيع معنا' },
    termsOfUse: { en: 'Terms Of Use', ar: 'شروط الاستخدام' },
    termsOfSale: { en: 'Terms Of Sale', ar: 'شروط البيع' },
    privacyPolicy: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
    applyNow: { en: 'APPLY NOW', ar: 'قدّم الآن' },

    // ── CartScreen ─────────────────────────────────────────
    yourCart: { en: 'Your Cart', ar: 'سلتك' },
    cartEmpty: { en: 'Your shopping cart\nlooks empty.', ar: 'سلة مشترياتك\nفارغة.' },
    cartEmptySub: { en: 'What are you waiting for?', ar: 'ماذا تنتظر؟' },
    startShopping: { en: 'Start Shopping', ar: 'تسوق الآن' },
    orderSummary: { en: 'Order Summary', ar: 'ملخص الطلب' },
    subtotal: { en: 'Subtotal', ar: 'المجموع الفرعي' },
    savings: { en: 'Savings', ar: 'التوفير' },
    total: { en: 'Total', ar: 'الإجمالي' },
    checkout: { en: 'Checkout', ar: 'إتمام الشراء' },
    processing: { en: 'Processing…', ar: 'جارٍ المعالجة…' },
    getItBy: { en: 'Get it by', ar: 'استلمه بحلول' },
    items: { en: 'items', ar: 'عناصر' },

    // ── WishlistScreen ─────────────────────────────────────
    wishlist: { en: 'My Wishlist', ar: 'قائمة أمنياتي' },
    wishlistEmpty: { en: 'Your wishlist is empty', ar: 'قائمة أمنياتك فارغة' },
    wishlistEmptySub: { en: 'Save items you love here', ar: 'احفظ المنتجات التي تحبها هنا' },

    // ── OrdersScreen ───────────────────────────────────────
    myOrdersTitle: { en: 'My Orders', ar: 'طلباتي' },
    ordersEmpty: { en: 'No orders yet', ar: 'لا توجد طلبات بعد' },
    orderStatus: { en: 'Status', ar: 'الحالة' },

    // ── AddressesScreen ────────────────────────────────────
    myAddresses: { en: 'My Addresses', ar: 'عناوينً' },
    addressesEmpty: { en: 'No addresses saved', ar: 'لا توجد عناوين محفوظة' },
    addAddress: { en: 'Add Address', ar: 'إضافة عنوان' },

    // ── NotificationsScreen ────────────────────────────────
    notifications: { en: 'Notifications', ar: 'الإشعارات' },
    noNotifications: { en: 'No notifications yet', ar: 'لا توجد إشعارات بعد' },
};

export type StringKey = keyof typeof strings;

/** Returns a translator function based on the given language. */
export const t = (lang: Lang) =>
    (key: StringKey): string => strings[key][lang] ?? strings[key]['en'];
