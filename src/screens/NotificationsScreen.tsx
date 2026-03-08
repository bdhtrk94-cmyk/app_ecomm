import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { t } from '../constants/i18n';
// In a real app we would use an notifications API
import api from '../services/api';

const NotificationsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { language } = useSettingsStore();
    const tr = t(language);
    const isAr = language === 'ar';
    const isLoggedIn = useAuthStore(s => s.isLoggedIn);

    const fetchNotifications = async () => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            // Fallback for notifications if backend doesn't have an endpoint for it yet
            // const res = await api.get('/customer/notifications');
            // setNotifications(res.data?.data || []);

            // Temporary stub data
            setNotifications([
                {
                    id: 1,
                    title: isAr ? 'مرحباً بك في صفقة!' : 'Welcome to Safqa',
                    message: isAr ? 'استمتع بالتسوق بأفضل الأسعار!' : 'Enjoy buying with the best prices!',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    title: isAr ? 'تنبيه خصم' : 'Discount Alert',
                    message: isAr ? 'احصل على خصم 50% على الإلكترونيات هذا الأسبوع.' : 'Get 50% off electronics this weekend.',
                    created_at: new Date(Date.now() - 86400000).toISOString()
                },
            ]);

        } catch (err) {
            console.warn('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [isLoggedIn]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!isLoggedIn) {
        return (
            <View style={styles.center}>
                <Ionicons name="notifications-off-outline" size={60} color="#CCC" />
                <Text style={styles.emptyText}>Please log in to view notifications.</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginBtnText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { marginRight: isAr ? 0 : 15, marginLeft: isAr ? 15 : 0 }]}>
                    <Ionicons name={isAr ? 'arrow-forward' : 'arrow-back'} size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{tr('notifications')}</Text>
            </View>

            {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="notifications-outline" size={64} color="#CCC" />
                    <Text style={styles.emptyText}>{tr('noNotifications')}</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => `notif-${item.id}`}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <View style={[styles.notificationCard, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.iconCircle, { marginRight: isAr ? 0 : 12, marginLeft: isAr ? 12 : 0 }]}>
                                <Ionicons name="notifications" size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.details}>
                                <Text style={[styles.title, { textAlign: isAr ? 'right' : 'left' }]}>{item.title}</Text>
                                <Text style={[styles.message, { textAlign: isAr ? 'right' : 'left' }]}>{item.message}</Text>
                                <Text style={[styles.time, { textAlign: isAr ? 'right' : 'left' }]}>{new Date(item.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    backBtn: { marginRight: 15 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
    emptyText: { marginTop: 15, fontSize: 16, color: '#888' },
    loginBtn: {
        marginTop: 20,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    loginBtnText: { color: '#FFF', fontWeight: 'bold' },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        ...SHADOWS.small,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e6f4ea',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    details: { flex: 1 },
    title: { fontSize: 15, color: '#333', fontWeight: 'bold', marginBottom: 4 },
    message: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 8 },
    time: { fontSize: 12, color: '#999' },
});

export default NotificationsScreen;
