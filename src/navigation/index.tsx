/**
 * src/navigation/index.tsx
 * Bottom Tab Navigator 5 tab: Home | Catalog | Simulate | Quote | Profile.
 * Active color #E67E22 (cam dat), Inactive #808080, background #1A1A1A.
 *
 * - Home    : da hoan thien (man hinh chinh)
 * - Catalog : Stack Navigator that (CatalogList -> ProductDetail)
 * - Simulate/Quote/Profile : placeholder, se implement o cac tinh nang sau
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import CatalogStack from './CatalogStack';
import type { IoniconName, RootTabParamList } from '../types';
import { COLORS } from '../screens/HomeScreen/styles';

const Tab = createBottomTabNavigator<RootTabParamList>();

/** Placeholder icon cho cac tab chua implement */
const renderPlaceholder =
  (icon: IoniconName): React.FC =>
  () =>
    <Ionicons name={icon} size={48} color={COLORS.inactive} />;

const SimulatePlaceholder: React.FC = renderPlaceholder('sparkles-outline');
const QuotePlaceholder: React.FC = renderPlaceholder('calculator-outline');
const ProfilePlaceholder: React.FC = renderPlaceholder('person-circle-outline');

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
  Simulate: { active: 'sparkles', inactive: 'sparkles-outline' },
  Quote: { active: 'document-text', inactive: 'document-text-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

const AppTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
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
          renderTabIcon(focused ? icons.active : icons.inactive)({ color, size });
      })(),
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Catalog" component={CatalogStack} />
    <Tab.Screen name="Simulate" component={SimulatePlaceholder} />
    <Tab.Screen name="Quote" component={QuotePlaceholder} />
    <Tab.Screen name="Profile" component={ProfilePlaceholder} />
  </Tab.Navigator>
);

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
});

export default AppTabs;
