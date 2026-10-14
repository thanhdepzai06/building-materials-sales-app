/**
 * src/navigation/SimulateStack.tsx
 * Stack Navigator long trong tab "Simulate" (Virtual Visualizer - Tinh nang 4).
 *
 * Luong 5 buoc:
 *   SimulateHome   (chon/chup anh)
 *     -> SurfacePicker  (keo 4 diem neo xac dinh mat phang)
 *     -> MaterialPicker (chon vat lieu de ap)
 *     -> Visualize      (xem truoc + chinh do dam + so sanh truoc/sau)
 *     -> Result         (du toan + them vao gio + luu lich su)
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SimulateScreen from '../screens/SimulateScreen';
import SurfacePickerScreen from '../screens/SurfacePickerScreen';
import MaterialPickerScreen from '../screens/MaterialPickerScreen';
import VisualizeScreen from '../screens/VisualizeScreen';
import ResultScreen from '../screens/ResultScreen';
import type { SimulateStackParamList } from '../types';

const Stack = createNativeStackNavigator<SimulateStackParamList>();

const SimulateStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="SimulateHome" component={SimulateScreen} />
    <Stack.Screen name="SurfacePicker" component={SurfacePickerScreen} />
    <Stack.Screen name="MaterialPicker" component={MaterialPickerScreen} />
    <Stack.Screen name="Visualize" component={VisualizeScreen} />
    <Stack.Screen name="Result" component={ResultScreen} />
  </Stack.Navigator>
);

export default SimulateStack;
