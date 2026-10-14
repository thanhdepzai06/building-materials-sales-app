/**
 * src/navigation/index.tsx
 * Bottom Tab Navigator 6 tab:
 *   Home | Catalog | Calculate | Pricing | Quote | Profile
 *
 * - Home      : man hinh chinh, co badge gio hang
 * - Catalog   : Stack (CatalogList -> ProductDetail)
 * - Calculate : May tinh vat tu (Tinh nang 2)
 * - Pricing   : Bao gia tron goi cong trinh (Tinh nang 3 mo rong)
 * - Quote     : Gio hang & xuat bao gia, co badge so luong
 * - Profile   : Lich su mo phong & yeu thich (Tinh nang 5)
 *
 * Tab Simulate (Virtual Visualizer) duoc truy cap tu Home va tu ProductDetail
 * thay vi dat tren tab bar, de tranh qua nhieu tab gay roi.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import PricingScreen from '../screens/PricingScreen';
import QuoteScreen from '../screens/QuoteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CatalogStack from './CatalogStack';
import SimulateStack from './SimulateStack';
import { useCart } from '../context/CartContext';
import type { IoniconName, RootTabParamList } from '../types';
import { COLORS } from '../screens/HomeScreen/styles';

const Tab = createBottomTabNavigator<RootTabParamList>();

interface TabIconArgs {
  color: string;
  size: number;
}

const renderTabIcon =
  (name: IoniconName) =>
  ({ color, size }: TabIconArgs): React.ReactElement => (
    <Ionicons name={name} size={size} color={color} />
  );

/** Ban do icon cho tung tab (outline khi inactive, filled khi active) */
const TAB_ICONS: Record<
  keyof RootTabParamList,
  { active: IoniconName; inactive: IoniconName }
> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Catalog: { active: 'grid', inactive: 'grid-outline' },
  Calculate: { active: 'calculator', inactive: 'calculator-outline' },
  Pricing: { active: 'pricetags', inactive: 'pricetags-outline' },
  Quote: { active: 'cart', inactive: 'cart-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
  Simulate: { active: 'sparkles', inactive: 'sparkles-outline' },
};

/** Nhan hien thi ngan cho tab bar */
const TAB_LABELS: Record<keyof RootTabParamList, string> = {
  Home: 'Trang chủ',
  Catalog: 'Kho',
  Calculate: 'Tính',
  Pricing: 'Báo giá',
  Quote: 'Giỏ',
  Profile: 'Hồ sơ',
  Simulate: 'Mô phỏng',
};

const AppTabs: React.FC = () => {
  const { totalCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }): BottomTabNavigationOptions => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarLabel: TAB_LABELS[route.name],
        tabBarIcon: ((): ((
          args: TabIconArgs & { focused: boolean },
        ) => React.ReactElement) => {
          const icons = TAB_ICONS[route.name];
          return ({ color, size, focused }): React.ReactElement =>
            renderTabIcon(focused ? icons.active : icons.inactive)({
              color,
              size,
            });
        })(),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Catalog" component={CatalogStack} />
      <Tab.Screen name="Calculate" component={CalculatorScreen} />
      <Tab.Screen name="Pricing" component={PricingScreen} />
      <Tab.Screen
        name="Quote"
        component={QuoteScreen}
        options={{
          tabBarBadge: totalCount > 0 ? totalCount : undefined,
          tabBarBadgeStyle: styles.tabBadge,
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {/* Tab Simulate an khoi tab bar - truy cap qua Home / ProductDetail */}
      <Tab.Screen
        name="Simulate"
        component={SimulateStack}
        options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' } }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1A1A1A',
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 62,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
  },
  tabBadge: {
    backgroundColor: COLORS.accent,
    color: '#FFFFFF',
    fontSize: 10,
  },
});

export default AppTabs;
