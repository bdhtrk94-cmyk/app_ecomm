import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { addressesApi } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '../store/settingsStore';
import { t } from '../constants/i18n';

const AddressesScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { language } = useSettingsStore();
    const tr = t(language);
    const isAr = language === 'ar';

    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAddresses = useCallback(async () => {
        try {
            const res = await addressesApi.list();
            const data = res.data?.data || res.data || [];
            setAddresses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Failed to fetch addresses:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

    const renderAddress = ({ item }: { item: any }) => (
        <View style={styles.addressCard}>
            <View style={[styles.addressHeader, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <View style={styles.addressTypeBadge}>
                    <Text style={styles.addressTypeText}>{item.type || (isAr ? 'منزل' : 'Home')}</Text>
                </View>
                {item.is_default && (
                    <Text style={styles.defaultText}>{isAr ? 'افتراضي' : 'Default'}</Text>
                )}
            </View>

            <Text style={[styles.recipientName, { textAlign: isAr ? 'right' : 'left' }]}>{item.recipient_name}</Text>
            <Text style={[styles.phoneNumber, { textAlign: isAr ? 'right' : 'left' }]}>{item.phone}</Text>

            <Text style={[styles.fullAddress, { textAlign: isAr ? 'right' : 'left' }]}>
                {item.street_address}{item.building_no ? `, ${isAr ? 'مبنى' : 'Bldg'} ${item.building_no}` : ''}
                {item.floor_no ? `, ${isAr ? 'طابق' : 'Fl'} ${item.floor_no}` : ''}{item.apartment_no ? `, ${isAr ? 'شقة' : 'Apt'} ${item.apartment_no}` : ''}
                {item.landmark ? `\n${isAr ? 'علامة مميزة' : 'Landmark'}: ${item.landmark}` : ''}
                {`\n${item.city || ''}, ${item.governorate || ''}`}
            </Text>

            <View style={[styles.actionsRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert(isAr ? 'تعديل' : 'Edit', isAr ? 'وظيفة التعديل' : 'Edit Address functionality')}>
                    <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.actionBtnText}>{isAr ? 'تعديل' : 'Edit'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert(isAr ? 'حذف' : 'Delete', isAr ? 'وظيفة الحذف' : 'Delete Address functionality')}>
                    <Ionicons name="trash-outline" size={16} color={COLORS.error || '#D32F2F'} />
                    <Text style={[styles.actionBtnText, { color: COLORS.error || '#D32F2F' }]}>{isAr ? 'حذف' : 'Delete'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            <View style={[styles.header, { paddingTop: insets.top + 10, flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name={isAr ? 'arrow-forward' : 'arrow-back'} size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{tr('myAddresses')}</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={addresses}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    renderItem={renderAddress}
                    refreshing={refreshing}
                    onRefresh={() => { setRefreshing(true); fetchAddresses(); }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="location-outline" size={60} color="#DDD" />
                            <Text style={styles.emptyTitle}>{isAr ? 'لا توجد عناوين بعد' : 'No Addresses Yet'}</Text>
                            <Text style={styles.emptySub}>{isAr ? 'أضف عنوان شحن جديد.' : 'Add a new shipping address.'}</Text>
                        </View>
                    }
                />
            )}

            {!loading && (
                <TouchableOpacity style={[styles.addBtn, { [isAr ? 'left' : 'right']: 24 }]} onPress={() => Alert.alert(isAr ? 'إضافة' : 'Add', isAr ? 'شاشة إضافة عنوان' : 'Add Address Screen')}>
                    <Ionicons name="add" size={24} color={COLORS.white} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    headerTitle: { color: COLORS.white, fontSize: SIZES.fontLg, ...FONTS.bold },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 16, paddingBottom: 100 },
    addressCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 16, ...SHADOWS.medium },
    addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    addressTypeBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    addressTypeText: { color: '#1976D2', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
    defaultText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },
    recipientName: { fontSize: SIZES.fontMd, ...FONTS.bold, color: COLORS.textPrimary },
    phoneNumber: { fontSize: SIZES.fontSm, color: '#666', marginTop: 2, marginBottom: 8 },
    fullAddress: { fontSize: SIZES.fontMd, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 16 },
    actionsRow: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12, gap: 16 },
    actionBtn: { flexDirection: 'row', alignItems: 'center' },
    actionBtnText: { color: COLORS.primary, fontWeight: '600', marginLeft: 4 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
    emptyTitle: { fontSize: SIZES.fontLg, ...FONTS.bold, color: COLORS.textPrimary, marginTop: 16 },
    emptySub: { fontSize: SIZES.fontMd, color: COLORS.textSecondary, marginTop: 8 },
    addBtn: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', ...SHADOWS.large },
});

export default AddressesScreen;
