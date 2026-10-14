/**
 * src/screens/ProductDetailScreen/index.tsx
 * Man hinh CHI TIET SAN PHAM.
 *   Anh lon | Ten + thuong hieu | Gia | Mo ta | Bang thong so | 2 nut hanh dong
 * Nhan productId tu CatalogStack, tra cuu qua findProductById().
 * Chuan PROG3002: Functional Component + Hooks, StyleSheet.create, no 'any'.
 */
import React, { useCallback, useMemo } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { findProductById } from '../../data/mockData';
import { formatVnd } from '../../utils/format';
import { COLORS } from '../HomeScreen/styles';
import type {
  CatalogStackParamList,
  RootTabParamList,
  SurfaceType,
} from '../../types';
import styles from './styles';

type ProductDetailProps = NativeStackScreenProps<
  CatalogStackParamList,
  'ProductDetail'
>;

/** Nhan hien thi cho tung loai be mat */
const SURFACE_LABEL: Record<SurfaceType, string> = {
  floor: 'Lát sàn',
  wall: 'Ốp tường',
  both: 'Sàn & tường',
};

const ProductDetailScreen: React.FC<ProductDetailProps> = ({
  route,
  navigation,
}) => {
  const { productId } = route.params;

  /** Navigation cua Bottom Tab - de nhay sang tab Simulate */
  const tabNavigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const product = useMemo(
    () => findProductById(productId),
    [productId],
  );

  /* ---------------- Handlers ---------------- */
  const handleSimulate = useCallback((): void => {
    // Chuyen sang tab Simulate (Virtual Visualizer - tinh nang 4, se lam sau)
    tabNavigation.navigate('Simulate');
  }, [tabNavigation]);

  const handleAddToCart = useCallback((): void => {
    if (!product) {
      return;
    }
    // TODO (Tinh nang 3): ghi vao CartContext + AsyncStorage
    Alert.alert(
      'Đã thêm vào giỏ',
      `${product.name}\n${formatVnd(product.price)} / ${product.unit}`,
      [{ text: 'OK' }],
    );
  }, [product]);

  /* ---------------- Khong tim thay san pham ---------------- */
  if (!product) {
    return (
      <View style={styles.notFoundWrap}>
        <Ionicons name="alert-circle-outline" size={56} color={COLORS.inactive} />
        <Text style={styles.notFoundText}>
          Không tìm thấy sản phẩm này.
        </Text>
        <Pressable onPress={(): void => navigation.goBack()}>
          <Text style={[styles.notFoundText, { color: COLORS.accent }]}>
            ← Quay lại Catalog
          </Text>
        </Pressable>
      </View>
    );
  }

  /* ---------------- Render ---------------- */
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== Anh lon + nut back ===== */}
        <View>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.55)', 'transparent']}
            style={styles.heroOverlay}
          />
          <Pressable
            style={styles.backButton}
            onPress={(): void => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.body}>
          {/* ===== Nhan danh muc ===== */}
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{product.category}</Text>
          </View>

          {/* ===== Ten + thuong hieu ===== */}
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.brandRow}>
            <Ionicons name="business-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.brandText}>{product.brand}</Text>
          </View>

          {/* ===== Gia ===== */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatVnd(product.price)}</Text>
            <Text style={styles.priceUnit}>{`/ ${product.unit}`}</Text>
          </View>

          {/* ===== Tinh trang kho ===== */}
          <View style={styles.stockRow}>
            <Ionicons
              name={product.inStock ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={product.inStock ? '#2ECC71' : '#E74C3C'}
            />
            <Text
              style={[
                styles.stockText,
                { color: product.inStock ? '#2ECC71' : '#E74C3C' },
              ]}
            >
              {product.inStock ? 'Còn hàng' : 'Tạm hết hàng'}
            </Text>
          </View>

          {/* ===== Mo ta ===== */}
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* ===== Bang thong so ===== */}
          <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
          <View style={styles.specTable}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Thương hiệu</Text>
              <Text style={styles.specValue}>{product.brand}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Xuất xứ</Text>
              <Text style={styles.specValue}>{product.origin}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Đơn vị tính</Text>
              <Text style={styles.specValue}>{product.unit}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Bề mặt sử dụng</Text>
              <Text style={styles.specValue}>
                {SURFACE_LABEL[product.surfaceType]}
              </Text>
            </View>
            {product.tileWidth > 0 ? (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Kích thước viên</Text>
                <Text style={styles.specValue}>
                  {`${product.tileWidth} x ${product.tileHeight} cm`}
                </Text>
              </View>
            ) : null}
            <View style={[styles.specRow, styles.specRowLast]}>
              <Text style={styles.specLabel}>Bảo hành</Text>
              <Text style={styles.specValue}>{product.warranty}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ===== Thanh hanh dong ===== */}
      <View style={styles.actionBar}>
        <Pressable
          style={styles.simulateButton}
          onPress={handleSimulate}
          accessibilityRole="button"
        >
          <Ionicons name="sparkles-outline" size={18} color={COLORS.accent} />
          <Text style={styles.simulateButtonText}>Thử lên tường</Text>
        </Pressable>

        <Pressable
          style={styles.cartButton}
          onPress={handleAddToCart}
          accessibilityRole="button"
        >
          <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
          <Text style={styles.cartButtonText}>Thêm vào giỏ</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ProductDetailScreen;
