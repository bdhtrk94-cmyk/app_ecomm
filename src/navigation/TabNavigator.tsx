import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useCartStore } from '../store/cartStore';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import DealsScreen from '../screens/DealsScreen';
import AccountScreen from '../screens/AccountScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.tabActive,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
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
          tabBarIcon: ({ color, focused }) => (
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
          tabBarIcon: ({ focused }) => (
            <View style={styles.dealsIconContainer}>
              <MaterialCommunityIcons
                name="gift"
                size={22}
                color={focused ? COLORS.dealsTab : COLORS.tabInactive}
              />
            </View>
          ),
          tabBarActiveTintColor: COLORS.dealsTab,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
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
          tabBarIcon: ({ color, focused }) => (
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
};

const styles = StyleSheet.create({
  tabBar: {
    height: SIZES.tabBarHeight + 20,
    paddingTop: 6,
    paddingBottom: 18,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabLabel: {
    fontSize: 10,
    ...FONTS.medium,
    marginTop: 2,
  },
  dealsIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    color: COLORS.white,
    fontSize: 9,
    ...FONTS.bold,
  },
});

export default TabNavigator;
