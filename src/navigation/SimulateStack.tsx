/**
 * src/navigation/SimulateStack.tsx
 * Stack Navigator long trong tab "Simulate" (Virtual Visualizer - Tinh nang 4).
 *   SimulateHome (chon anh) -> SurfacePicker (keo 4 diem neo) -> Visualize (ap vat lieu)
 *
 * Hien tai moi co man hinh chon anh; cac man con lai se bo sung o Tinh nang 4.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SimulateScreen from '../screens/SimulateScreen';
import type { SimulateStackParamList } from '../types';

const Stack = createNativeStackNavigator<SimulateStackParamList>();

const SimulateStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SimulateHome" component={SimulateScreen} />
  </Stack.Navigator>
);

export default SimulateStack;
