/**
 * src/navigation/CatalogStack.tsx
 * Stack Navigator long trong tab "Catalog":
 *   CatalogList (danh sach) -> ProductDetail (chi tiet)
 * Dung @react-navigation/native-stack (da cai san trong package.json).
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CatalogScreen from '../screens/CatalogScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import type { CatalogStackParamList } from '../types';

const Stack = createNativeStackNavigator<CatalogStackParamList>();

const CatalogStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CatalogList" component={CatalogScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
  </Stack.Navigator>
);

export default CatalogStack;
