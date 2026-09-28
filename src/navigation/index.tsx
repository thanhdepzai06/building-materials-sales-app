/**
 * src/navigation/index.tsx
 * Bottom Tab Navigator 4 tab: Home | Simulate | Quote | Profile.
 * Active color #E67E22 (cam dat), Inactive #808080, background #1A1A1A.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
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

const AppTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.accent,
      tabBarInactiveTintColor: COLORS.inactive,
      tabBarStyle: styles.tabBar,
      tabBarIcon: (() => {
        switch (route.name) {
          case 'Home':
            return renderTabIcon('home');
          case 'Simulate':
            return renderTabIcon('sparkles');
          case 'Quote':
            return renderTabIcon('document-text');
          default:
            return renderTabIcon('person');
        }
      })(),
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
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
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
});

export default AppTabs;
