/**
 * App.tsx - Root component.
 * NavigationContainer + Bottom Tab Navigator (Home | Simulate | Quote | Profile).
 * Theme dark toan ung dung theo layout Hypic.
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';

import AppTabs from './src/navigation';
import { COLORS } from './src/screens/HomeScreen/styles';

/** Custom dark theme khop mau nen tong the #1A1A1A */
const AppTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.background,
    primary: COLORS.accent,
    text: COLORS.textPrimary,
    border: 'rgba(255,255,255,0.08)',
  },
};

const App: React.FC = () => (
  <NavigationContainer theme={AppTheme}>
    <StatusBar style="light" />
    <AppTabs />
  </NavigationContainer>
);

export default App;
