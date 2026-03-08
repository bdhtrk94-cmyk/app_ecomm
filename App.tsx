import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from './src/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from './src/store/authStore';
import { useSettingsStore } from './src/store/settingsStore';

import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import DealsScreen from './src/screens/DealsScreen';
import AccountScreen from './src/screens/AccountScreen';
import CartScreen from './src/screens/CartScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import AddressesScreen from './src/screens/AddressesScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import { useCartStore } from './src/store/cartStore';

const PERSISTENCE_KEY = 'SAFQA_NAV_STATE';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator id="AuthStack" screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function TabBarIcon({ name, focused, color, size = 22 }: { name: string; focused: boolean; color: string; size?: number }) {
  return <Ionicons name={name as any} size={size} color={color} />;
}

function TabNavigator() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const insets = useSafeAreaInsets();
  const { language } = useSettingsStore();
  const isAr = language === 'ar';

  const tabLabels = {
    Home: isAr ? 'الرئيسية' : 'Home',
    Categories: isAr ? 'الفئات' : 'Categories',
    Deals: isAr ? 'العروض' : 'Deals',
    Account: isAr ? 'حسابي' : 'Account',
    Cart: isAr ? 'السلة' : 'Cart',
  };

  const bottomInset = insets.bottom;

  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 56 + (bottomInset > 0 ? bottomInset : 16),
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          elevation: 10,
        },
        tabBarActiveTintColor: COLORS.tabActive,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: tabLabels.Home,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarLabel: tabLabels.Categories,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <MaterialCommunityIcons
              name={focused ? 'view-grid' : 'view-grid-outline'}
              size={22}
              color={focused ? COLORS.tabActive : color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Deals"
        component={DealsScreen}
        options={{
          tabBarLabel: tabLabels.Deals,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <MaterialCommunityIcons
              name="gift"
              size={22}
              color={focused ? COLORS.dealsTab : COLORS.tabInactive}
            />
          ),
          tabBarActiveTintColor: COLORS.dealsTab,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: tabLabels.Account,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: tabLabels.Cart,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <View>
              <MaterialCommunityIcons
                name={focused ? 'cart' : 'cart-outline'}
                size={22}
                color={color}
              />
              {itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(!__DEV__);
  const [initialState, setInitialState] = useState<any>();
  const { isLoggedIn, rehydrate } = useAuthStore();
  const { language } = useSettingsStore();

  useEffect(() => {
    const init = async () => {
      // Restore navigation state
      try {
        const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY);
        if (savedState) setInitialState(JSON.parse(savedState));
      } catch (_) { }

      // Restore auth token
      await rehydrate();
      setIsReady(true);
    };
    if (!isReady) init();
  }, [isReady]);

  const onStateChange = useCallback((state: any) => {
    AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
  }, []);

  if (!isReady) return null;

  const isAr = language === 'ar';

  return (
    <SafeAreaProvider>
      {/* Root direction wrapper — flips entire layout for Arabic */}
      <View style={{ flex: 1, direction: isAr ? 'rtl' : 'ltr' } as any}>
        <NavigationContainer initialState={isLoggedIn ? initialState : undefined} onStateChange={onStateChange}>
          {isLoggedIn ? (
            <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Tabs" component={TabNavigator} />
              <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{ animation: isAr ? 'slide_from_left' : 'slide_from_right' }}
              />
              <Stack.Screen
                name="Orders"
                component={OrdersScreen}
                options={{ animation: isAr ? 'slide_from_left' : 'slide_from_right' }}
              />
              <Stack.Screen
                name="Addresses"
                component={AddressesScreen}
                options={{ animation: isAr ? 'slide_from_left' : 'slide_from_right' }}
              />
              <Stack.Screen
                name="Wishlist"
                component={WishlistScreen}
                options={{ animation: isAr ? 'slide_from_left' : 'slide_from_right' }}
              />
              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ animation: isAr ? 'slide_from_left' : 'slide_from_right' }}
              />
            </Stack.Navigator>
          ) : (
            <AuthNavigator />
          )}
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
