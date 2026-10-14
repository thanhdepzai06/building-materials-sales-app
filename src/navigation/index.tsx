/**
 * src/navigation/index.tsx
 * Bottom Tab Navigator 5 tab: Home | Catalog | Calculate | Quote | Simulate.
 * Active color #E67E22 (cam dat), Inactive #808080, background #1A1A1A.
 *
 * - Home      : man hinh chinh (da hoan thien)
 * - Catalog   : Stack Navigator that (CatalogList -> ProductDetail)
 * - Calculate : May tinh vat tu (Tinh nang 2)
 * - Quote     : Gio hang & Bao gia (Tinh nang 3) - co badge so luong
 * - Simulate  : placeholder, se implement o Tinh nang 4 (Virtual Visualizer)
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import QuoteScreen from '../screens/QuoteScreen';
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
  Quote: { active: 'document-text', inactive: 'document-text-outline' },
  Simulate: { active: 'sparkles', inactive: 'sparkles-outline' },
};

/** Badge hien so luong mon trong gio hang tren tab Quote */
const CartBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count <= 0) {
    return null;
  }
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : `${count}`}</Text>
    </View>
  );
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
      <Tab.Screen
        name="Quote"
        component={QuoteScreen}
        options={{
          tabBarBadge: totalCount > 0 ? totalCount : undefined,
          tabBarBadgeStyle: styles.tabBadge,
        }}
      />
      <Tab.Screen name="Simulate" component={SimulateStack} />
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
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default AppTabs;
