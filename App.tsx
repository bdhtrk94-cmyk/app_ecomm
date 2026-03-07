import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from './src/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import DealsScreen from './src/screens/DealsScreen';
import AccountScreen from './src/screens/AccountScreen';
import CartScreen from './src/screens/CartScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import { useCartStore } from './src/store/cartStore';

const PERSISTENCE_KEY = 'SAFQA_NAV_STATE';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabBarIcon({ name, focused, color, size = 22 }: { name: string; focused: boolean; color: string; size?: number }) {
  return <Ionicons name={name as any} size={size} color={color} />;
}

function TabNavigator() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 110,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 45,
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

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY);
        if (savedState) {
          setInitialState(JSON.parse(savedState));
        }
      } catch (e) {
        // ignore
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  const onStateChange = useCallback((state: any) => {
    AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
  }, []);

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer initialState={initialState} onStateChange={onStateChange}>
        <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
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
