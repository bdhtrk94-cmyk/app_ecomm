import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { ordersApi } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '../store/settingsStore';
import { t } from '../constants/i18n';

const statusAr: Record<string, string> = {
    delivered: 'تم التسليم',
    shipped: 'تم الشحن',
    processing: 'قيد المعالجة',
    cancelled: 'ملغي',
    pending: 'قيد الانتظار',
};

const OrdersScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { language } = useSettingsStore();
    const tr = t(language);
    const isAr = language === 'ar';

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await ordersApi.list();
            const data = res.data?.data || res.data || [];
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return '#2E7D32';
            case 'shipped': return '#1976D2';
            case 'processing': return '#F57C00';
            case 'cancelled': return '#D32F2F';
            default: return '#757575';
        }
    };

    const renderOrder = ({ item }: { item: any }) => (
        <View style={styles.orderCard}>
            <View style={[styles.orderHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <View>
                    <Text style={[styles.orderId, { textAlign: isAr ? 'right' : 'left' }]}>
                        {isAr ? `طلب #${item.id}` : `Order #${item.id}`}
                    </Text>
                    <Text style={[styles.orderDate, { textAlign: isAr ? 'right' : 'left' }]}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : (isAr ? 'حديث' : 'Recent')}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {isAr ? (statusAr[item.status?.toLowerCase()] || item.status) : (item.status || 'Processing')}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={[styles.orderDetails, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <Text style={styles.detailLabel}>{isAr ? 'العناصر:' : 'Items:'}</Text>
                <Text style={styles.detailValue}>{item.items_count || (item.items ? item.items.length : 0)} {isAr ? 'عنصر' : 'items'}</Text>
            </View>
            <View style={[styles.orderDetails, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <Text style={styles.detailLabel}>{isAr ? 'الإجمالي:' : 'Total:'}</Text>
                <Text style={styles.totalValue}>EGP {parseFloat(item.total_amount || 0).toLocaleString()}</Text>
            </View>

            <TouchableOpacity style={[styles.detailsBtn, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <Text style={styles.detailsBtnText}>{isAr ? 'عرض التفاصيل' : 'View Details'}</Text>
                <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={16} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            <View style={[styles.header, { paddingTop: insets.top + 10, flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name={isAr ? 'arrow-forward' : 'arrow-back'} size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{tr('myOrdersTitle')}</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    renderItem={renderOrder}
                    refreshing={refreshing}
                    onRefresh={() => { setRefreshing(true); fetchOrders(); }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cube-outline" size={60} color="#DDD" />
                            <Text style={styles.emptyTitle}>{isAr ? 'لا توجد طلبات بعد' : 'No Orders Yet'}</Text>
                            <Text style={styles.emptySub}>{isAr ? 'لم تقم بأي طلب حتى الآن.' : "You haven't placed any orders."}</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    headerTitle: { color: COLORS.white, fontSize: SIZES.fontLg, ...FONTS.bold },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 16, paddingBottom: 40 },
    orderCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 16, ...SHADOWS.medium },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    orderId: { fontSize: SIZES.fontMd, ...FONTS.bold, color: COLORS.textPrimary },
    orderDate: { fontSize: SIZES.fontSm, color: '#999', marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 12, fontWeight: '700' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
    orderDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    detailLabel: { fontSize: SIZES.fontSm, color: '#777' },
    detailValue: { fontSize: SIZES.fontSm, color: COLORS.textPrimary, fontWeight: '500' },
    totalValue: { fontSize: SIZES.fontMd, color: COLORS.primary, ...FONTS.bold },
    detailsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    detailsBtnText: { color: COLORS.primary, fontWeight: '600', marginRight: 4 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
    emptyTitle: { fontSize: SIZES.fontLg, ...FONTS.bold, color: COLORS.textPrimary, marginTop: 16 },
    emptySub: { fontSize: SIZES.fontMd, color: COLORS.textSecondary, marginTop: 8 },
});

export default OrdersScreen;
