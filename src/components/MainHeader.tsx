import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { t } from '../constants/i18n';
import { useSettingsStore } from '../store/settingsStore';

const MainHeader: React.FC = () => {
    const navigation = useNavigation<any>();
    const { language } = useSettingsStore();
    const tr = t(language);

    return (
        <View style={styles.header}>
            <View style={styles.headerInner}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
                    <Ionicons name="bag-handle" size={22} color="#FFF" />
                    <Text style={styles.brandName}>{tr('appName')}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.navigate('Wishlist')}>
                        <Ionicons name="heart-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.navigate('Notifications')}>
                        <Ionicons name="notifications-outline" size={24} color="#FFF" />
                        {/* If we need dynamic notification badge, we can add it back here later */}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
        letterSpacing: 1.5,
    },
});

export default MainHeader;
