import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, StatusBar, Platform, ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { COLORS, SIZES, FONTS } from '../constants/theme';

export default function LoginScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }
        try {
            await login(email.trim(), password);
            // Navigation handled by App.tsx based on isLoggedIn state
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Login failed. Check your credentials.';
            Alert.alert('Login Failed', msg);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo */}
                <View style={styles.logoRow}>
                    <Ionicons name="bag-handle" size={36} color={COLORS.primary} />
                    <Text style={styles.logoText}>Safqa</Text>
                </View>

                <Text style={styles.title}>Welcome back!</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>

                {/* Email */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputBox}>
                        <Ionicons name="mail-outline" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="your@email.com"
                            placeholderTextColor="#BBB"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                {/* Password */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputBox}>
                        <Ionicons name="lock-closed-outline" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="••••••••"
                            placeholderTextColor="#BBB"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPw}
                        />
                        <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                            <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.loginBtn, isLoading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.85}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.loginBtnText}>Log In</Text>
                    )}
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerRow}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.divider} />
                </View>

                {/* Register Link */}
                <TouchableOpacity style={styles.registerRow} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>Don't have an account? </Text>
                    <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA' },
    content: { paddingHorizontal: 24 },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 },
    logoText: { fontSize: 32, fontWeight: '900', color: COLORS.primary, letterSpacing: 1.5 },
    title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
    subtitle: { fontSize: 15, color: '#888', marginBottom: 32 },
    inputWrapper: { marginBottom: 18 },
    label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 8 },
    inputBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1.5, borderColor: '#E8E8E8',
        paddingHorizontal: 14, height: 52,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15, color: '#1A1A1A' },
    eyeBtn: { padding: 4 },
    loginBtn: {
        backgroundColor: COLORS.primary, borderRadius: 14, height: 54,
        alignItems: 'center', justifyContent: 'center', marginTop: 8,
    },
    loginBtnText: { fontSize: 16, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, gap: 12 },
    divider: { flex: 1, height: 1, backgroundColor: '#E8E8E8' },
    dividerText: { color: '#AAA', fontSize: 13, fontWeight: '500' },
    registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    registerText: { fontSize: 14, color: '#888' },
    registerLink: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
