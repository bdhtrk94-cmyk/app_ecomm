import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, StatusBar, Platform, ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../constants/theme';

export default function RegisterScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const { register, isLoading } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        try {
            await register(name.trim(), email.trim(), password);
        } catch (err: any) {
            const msg = err?.response?.data?.message
                || Object.values(err?.response?.data?.errors || {})[0]
                || 'Registration failed.';
            Alert.alert('Registration Failed', String(msg));
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

                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join the Safqa family today</Text>

                {/* Name */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputBox}>
                        <Ionicons name="person-outline" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#BBB" value={name} onChangeText={setName} />
                    </View>
                </View>

                {/* Email */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputBox}>
                        <Ionicons name="mail-outline" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input} placeholder="your@email.com" placeholderTextColor="#BBB"
                            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
                        />
                    </View>
                </View>

                {/* Password */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputBox}>
                        <Ionicons name="lock-closed-outline" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { flex: 1 }]} placeholder="Min. 6 characters" placeholderTextColor="#BBB"
                            value={password} onChangeText={setPassword} secureTextEntry={!showPw}
                        />
                        <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                            <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                    style={[styles.registerBtn, isLoading && { opacity: 0.7 }]}
                    onPress={handleRegister} disabled={isLoading} activeOpacity={0.85}
                >
                    {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.registerBtnText}>Create Account</Text>}
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.loginRow}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.loginLink}>Log In</Text>
                    </TouchableOpacity>
                </View>
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
    registerBtn: {
        backgroundColor: COLORS.primary, borderRadius: 14, height: 54,
        alignItems: 'center', justifyContent: 'center', marginTop: 8,
    },
    registerBtnText: { fontSize: 16, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
    loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
    loginText: { fontSize: 14, color: '#888' },
    loginLink: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
