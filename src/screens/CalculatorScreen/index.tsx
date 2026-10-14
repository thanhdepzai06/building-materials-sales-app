/**
 * src/screens/CalculatorScreen/index.tsx
 * Man hinh MAY TINH VAT TU (Tinh nang 2).
 *   Nhap chieu dai x chieu rong -> chon vat lieu -> chon hao hut
 *   -> Ket qua: dien tich, so luong can mua, tong chi phi -> Them vao gio
 *
 * Logic tinh toan nam trong src/utils/format.ts (ham thuan, de test).
 * Chuan PROG3002: Functional Component + Hooks, StyleSheet.create, no 'any'.
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { TRENDING_PRODUCTS } from '../../data/mockData';
import {
  calcArea,
  calcMaterialQuantity,
  calcTotalPrice,
  formatVnd,
} from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../HomeScreen/styles';
import type { Product, RootTabParamList } from '../../types';
import styles from './styles';

/** Cac muc hao hut cho phep chon (%) */
const WASTE_OPTIONS = [0, 5, 10, 15] as const;
type WasteOption = (typeof WASTE_OPTIONS)[number];

const CalculatorScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { addToCart } = useCart();

  /* ---------------- State ---------------- */
  const [widthText, setWidthText] = useState<string>('');
  const [heightText, setHeightText] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>(TRENDING_PRODUCTS[0].id);
  const [waste, setWaste] = useState<WasteOption>(5);

  /* ---------------- Derived: vat lieu dang chon ---------------- */
  const selectedProduct = useMemo<Product>(
    () =>
      TRENDING_PRODUCTS.find((p: Product): boolean => p.id === selectedId) ??
      TRENDING_PRODUCTS[0],
    [selectedId],
  );

  /* ---------------- Derived: parse so nguoi dung nhap ---------------- */
  const width = useMemo<number>(() => {
    // Chap nhan ca dau phay va dau cham thap phan
    const n = Number.parseFloat(widthText.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [widthText]);

  const height = useMemo<number>(() => {
    const n = Number.parseFloat(heightText.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [heightText]);

  /* ---------------- Derived: ket qua tinh toan ---------------- */
  const area = useMemo<number>(() => calcArea(width, height), [width, height]);

  const quantity = useMemo<number>(
    () => calcMaterialQuantity(area, selectedProduct, waste),
    [area, selectedProduct, waste],
  );

  const totalPrice = useMemo<number>(
    () => calcTotalPrice(quantity, selectedProduct.price),
    [quantity, selectedProduct.price],
  );

  const isValid = area > 0 && quantity > 0;

  /** So luong truoc khi cong hao hut - de hien thi doi chieu */
  const baseQuantity = useMemo<number>(
    () => calcMaterialQuantity(area, selectedProduct, 0),
    [area, selectedProduct],
  );

  /* ---------------- Handlers ---------------- */
  const handleAddToCart = useCallback((): void => {
    if (!isValid) {
      return;
    }
    addToCart(selectedProduct, quantity);
    Alert.alert(
      'Đã thêm vào giỏ',
      `${selectedProduct.name}\nSố lượng: ${quantity} ${selectedProduct.unit}\nTạm tính: ${formatVnd(totalPrice)}`,
      [
        { text: 'Tính tiếp', style: 'cancel' },
        {
          text: 'Xem giỏ hàng',
          onPress: (): void => navigation.navigate('Quote'),
        },
      ],
    );
  }, [isValid, addToCart, selectedProduct, quantity, totalPrice, navigation]);

  /* ---------------- Render 1 lua chon vat lieu ---------------- */
  const renderMaterial = (product: Product): React.JSX.Element => {
    const isActive = product.id === selectedId;
    return (
      <Pressable
        key={product.id}
        style={[styles.materialOption, isActive && styles.materialOptionActive]}
        onPress={(): void => setSelectedId(product.id)}
        accessibilityRole="button"
      >
        <View
          style={[styles.materialSwatch, { backgroundColor: product.colorHex }]}
        />
        <View style={styles.materialInfo}>
          <Text style={styles.materialName} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.materialMeta} numberOfLines={1}>
            {product.tileWidth > 0
              ? `${product.tileWidth}x${product.tileHeight}cm · ${formatVnd(product.price)}/${product.unit}`
              : `${formatVnd(product.price)}/${product.unit}`}
          </Text>
        </View>
        {isActive ? (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={COLORS.accent}
            style={styles.checkIcon}
          />
        ) : null}
      </Pressable>
    );
  };

  /* ---------------- Render ---------------- */
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Máy tính vật tư</Text>
          <Text style={styles.headerSubtitle}>
            Nhập diện tích để tính số lượng cần mua
          </Text>
        </View>

        {/* ===== Nhap kich thuoc ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Kích thước khu vực</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Chiều rộng (m)</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: 4"
                placeholderTextColor={COLORS.inactive}
                keyboardType="numeric"
                value={widthText}
                onChangeText={setWidthText}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Chiều dài (m)</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: 5"
                placeholderTextColor={COLORS.inactive}
                keyboardType="numeric"
                value={heightText}
                onChangeText={setHeightText}
              />
            </View>
          </View>
        </View>

        {/* ===== Chon vat lieu ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Chọn vật liệu</Text>
          <View style={styles.materialList}>
            {TRENDING_PRODUCTS.map(renderMaterial)}
          </View>
        </View>

        {/* ===== Hao hut ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>3. Tỷ lệ hao hụt</Text>
          <View style={styles.wasteRow}>
            <Text style={styles.wasteLabel}>
              Hao hụt khi cắt / vỡ / dự phòng
            </Text>
            <View style={styles.wasteButtons}>
              {WASTE_OPTIONS.map((option: WasteOption): React.JSX.Element => {
                const isActive = option === waste;
                return (
                  <Pressable
                    key={option}
                    style={[styles.wasteChip, isActive && styles.wasteChipActive]}
                    onPress={(): void => setWaste(option)}
                  >
                    <Text
                      style={[
                        styles.wasteChipText,
                        isActive && styles.wasteChipTextActive,
                      ]}
                    >
                      {`${option}%`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* ===== Ket qua ===== */}
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Kết quả tính toán</Text>

          {isValid ? (
            <>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Diện tích</Text>
                <Text style={styles.resultValue}>
                  {`${area.toFixed(2)} m²`}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>
                  {`Số lượng chưa hao hụt`}
                </Text>
                <Text style={styles.resultValue}>
                  {`${baseQuantity} ${selectedProduct.unit}`}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>
                  {waste > 0
                    ? `Cần mua (+${waste}% hao hụt)`
                    : 'Cần mua (không hao hụt)'}
                </Text>
                <Text style={[styles.resultValue, styles.resultHighlight]}>
                  {`${quantity} ${selectedProduct.unit}`}
                </Text>
              </View>

              <View style={[styles.resultRow, styles.resultRowLast]}>
                <Text style={styles.resultLabel}>Tạm tính</Text>
                <Text style={[styles.resultValue, styles.resultHighlight]}>
                  {formatVnd(totalPrice)}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.emptyResult}>
              Nhập chiều rộng và chiều dài để xem kết quả
            </Text>
          )}
        </View>

        {/* ===== Nut them vao gio ===== */}
        <Pressable
          style={[styles.addButton, !isValid && styles.addButtonDisabled]}
          onPress={handleAddToCart}
          disabled={!isValid}
          accessibilityRole="button"
        >
          <Ionicons
            name="cart-outline"
            size={20}
            color={isValid ? '#FFFFFF' : COLORS.inactive}
          />
          <Text
            style={[
              styles.addButtonText,
              !isValid && styles.addButtonTextDisabled,
            ]}
          >
            {isValid
              ? `Thêm ${quantity} ${selectedProduct.unit} vào giỏ`
              : 'Thêm vào giỏ'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default CalculatorScreen;
