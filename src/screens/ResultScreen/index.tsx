/**
 * src/screens/ResultScreen/index.tsx
 * BUOC 5 cua Virtual Visualizer: ket qua cuoi + du toan + them vao gio.
 *
 * Hien thi lai anh voi vat lieu da ap, kem bang du toan:
 *   dien tich -> so luong can mua (co hao hut) -> chi phi du kien
 * Cho phep them thang vao gio hang voi so luong da tinh.
 *
 * Chuan PROG3002: Functional Component + Hooks, StyleSheet.create, no 'any'.
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { findProductById } from '../../data/mockData';
import {
  calcMaterialQuantity,
  calcTotalPrice,
  formatVnd,
} from '../../utils/format';
import {
  bilinearInterpolate,
  estimateRealArea,
  tileMatrix,
} from '../../utils/perspective';
import { useCart } from '../../context/CartContext';
import { useSimulationHistory } from '../../hooks/useSimulationHistory';
import { COLORS } from '../HomeScreen/styles';
import type { RootTabParamList, SimulateStackParamList } from '../../types';
import styles from './styles';

type ResultProps = NativeStackScreenProps<SimulateStackParamList, 'Result'>;

/** Cac muc hao hut cho phep chon (%) */
const WASTE_OPTIONS = [5, 10, 15] as const;
type WasteOption = (typeof WASTE_OPTIONS)[number];

/** So o chia de ve lai texture (khop voi VisualizeScreen) */
const GRID_DIVISIONS = 12;

const ResultScreen: React.FC<ResultProps> = ({ route, navigation }) => {
  const { imageUri, corners, productId, opacity } = route.params;
  const insets = useSafeAreaInsets();

  const tabNavigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { addToCart } = useCart();
  const { addRecord } = useSimulationHistory();

  const [waste, setWaste] = useState<WasteOption>(10);
  const [saved, setSaved] = useState<boolean>(false);

  const product = useMemo(() => findProductById(productId), [productId]);

  /* ---------------- Tinh dien tich & so luong ---------------- */
  const estimatedArea = useMemo<number>(
    () => estimateRealArea(corners),
    [corners],
  );

  const quantity = useMemo<number>(
    () =>
      product ? calcMaterialQuantity(estimatedArea, product, waste) : 0,
    [estimatedArea, product, waste],
  );

  const totalPrice = useMemo<number>(
    () => (product ? calcTotalPrice(quantity, product.price) : 0),
    [quantity, product],
  );

  /** So luong neu khong tinh hao hut - de doi chieu */
  const baseQuantity = useMemo<number>(
    () => (product ? calcMaterialQuantity(estimatedArea, product, 0) : 0),
    [estimatedArea, product],
  );

  /* ---------------- Tinh lai cac o texture de ve anh ket qua ---------------- */
  const tiles = useMemo(() => {
    const result: { key: string; matrix: number[] }[] = [];
    for (let row = 0; row < GRID_DIVISIONS; row += 1) {
      for (let col = 0; col < GRID_DIVISIONS; col += 1) {
        const matrix = tileMatrix(
          corners,
          col / GRID_DIVISIONS,
          row / GRID_DIVISIONS,
          (col + 1) / GRID_DIVISIONS,
          (row + 1) / GRID_DIVISIONS,
        );
        const area = Math.abs(matrix[0] * matrix[3] - matrix[1] * matrix[2]);
        if (area < 0.5) {
          continue;
        }
        result.push({ key: `rtile-${row}-${col}`, matrix });
      }
    }
    return result;
  }, [corners]);

  /** Ty le hien thi xem truoc (theo chieu rong man hinh tru 32 padding) */
  const previewScale = useMemo<number>(() => 1, []);
  void previewScale;

  const centerPoint = useMemo(
    () => bilinearInterpolate(corners, 0.5, 0.5),
    [corners],
  );
  void centerPoint;

  /* ---------------- Handlers ---------------- */
  const handleAddToCart = useCallback((): void => {
    if (!product || quantity <= 0) {
      return;
    }
    addToCart(product, quantity);
    Alert.alert(
      'Đã thêm vào giỏ',
      `${product.name}\nSố lượng: ${quantity} ${product.unit}\nTạm tính: ${formatVnd(totalPrice)}`,
      [
        { text: 'Ở lại', style: 'cancel' },
        {
          text: 'Xem giỏ hàng',
          onPress: (): void => tabNavigation.navigate('Quote'),
        },
      ],
    );
  }, [product, quantity, addToCart, totalPrice, tabNavigation]);

  const handleSave = useCallback((): void => {
    if (!product || saved) {
      return;
    }
    addRecord({
      originalUri: imageUri,
      resultUri: null,
      productId: product.id,
      productName: product.name,
      opacity,
      estimatedArea,
    });
    setSaved(true);
    Alert.alert(
      'Đã lưu',
      'Lần mô phỏng này đã được lưu vào lịch sử. Bạn xem lại ở tab Hồ sơ.',
      [{ text: 'OK' }],
    );
  }, [product, saved, addRecord, imageUri, opacity, estimatedArea]);

  const handleRestart = useCallback((): void => {
    navigation.popToTop();
  }, [navigation]);

  /* ---------------- Khong tim thay vat lieu ---------------- */
  if (!product) {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={(): void => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Kết quả</Text>
        </View>
        <Text
          style={[
            styles.tableLabel,
            { marginTop: 40, textAlign: 'center' },
          ]}
        >
          Không tìm thấy vật liệu.
        </Text>
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
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={(): void => navigation.goBack()}
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Kết quả mô phỏng</Text>
            <Text style={styles.headerStep}>Bước 5 / 5</Text>
          </View>
        </View>

        {/* ===== Anh da ap vat lieu ===== */}
        <View style={styles.previewWrap}>
          {/*
            Anh nay duoc ve lai bang chinh cach cua VisualizeScreen.
            Dung ty le 1:1 theo pixel anh goc, khung chua tu co gian
            nho `resizeMode="contain"` cua Image + lop texture ben tren.
          */}
          <View style={{ width: '100%', aspectRatio: 0.85 }}>
            <Image
              source={{ uri: imageUri }}
              style={StyleSheetAbsoluteFill}
              resizeMode="cover"
            />

            {/* Lop texture: dung transform theo ty le khung xem truoc */}
            <View style={StyleSheetAbsoluteFill} pointerEvents="none">
              {tiles.map((tile): React.JSX.Element => (
                <View
                  key={tile.key}
                  style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    opacity,
                    backgroundColor: product.colorHex,
                    transform: [
                      { matrix: tile.matrix as unknown as number[] },
                    ],
                  }}
                />
              ))}
            </View>

            <View style={styles.previewBadge}>
              <Text style={styles.previewBadgeText}>ĐÃ MÔ PHỎNG</Text>
            </View>
          </View>
        </View>

        {/* ===== Vat lieu da ap ===== */}
        <View style={styles.materialCard}>
          <View
            style={[
              styles.materialSwatch,
              { backgroundColor: product.colorHex },
            ]}
          />
          <View style={styles.materialInfo}>
            <Text style={styles.materialName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.materialMeta} numberOfLines={1}>
              {`${product.brand}${product.tileWidth > 0 ? ` · ${product.tileWidth}x${product.tileHeight}cm` : ''}`}
            </Text>
            <Text style={styles.materialPrice}>
              {`${formatVnd(product.price)} / ${product.unit}`}
            </Text>
          </View>
        </View>

        {/* ===== Du toan ===== */}
        <Text style={styles.sectionTitle}>Dự toán vật tư</Text>

        <View style={styles.tableCard}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Diện tích bề mặt</Text>
            <Text style={styles.tableValue}>
              {`${estimatedArea.toFixed(2)} m²`}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Số lượng chưa hao hụt</Text>
            <Text style={styles.tableValue}>
              {`${baseQuantity} ${product.unit}`}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>
              {`Cần mua (+${waste}% hao hụt)`}
            </Text>
            <Text style={[styles.tableValue, styles.tableValueBig]}>
              {`${quantity} ${product.unit}`}
            </Text>
          </View>

          <View style={[styles.tableRow, styles.tableRowLast]}>
            <Text style={styles.tableLabel}>Chi phí dự kiến</Text>
            <Text style={[styles.tableValue, styles.tableValueBig]}>
              {formatVnd(totalPrice)}
            </Text>
          </View>
        </View>

        {/* ===== Chon hao hut ===== */}
        <View style={styles.wasteRow}>
          <Text style={styles.wasteLabel}>Tỷ lệ hao hụt</Text>
          <View style={styles.wasteButtons}>
            {WASTE_OPTIONS.map((option: WasteOption): React.JSX.Element => {
              const isActive = option === waste;
              return (
                <Pressable
                  key={option}
                  style={[styles.wasteChip, isActive && styles.wasteChipActive]}
                  onPress={(): void => setWaste(option)}
                  accessibilityRole="button"
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

        {/* ===== Ghi chu ve do chinh xac ===== */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.accent} />
          <Text style={styles.noteText}>
            Diện tích được ước lượng từ vùng bạn chọn trên ảnh, giả định chiều
            cao bề mặt khoảng 2,8 m. Nên xác nhận lại số đo thực tế trước khi
            đặt hàng.
          </Text>
        </View>
      </ScrollView>

      {/* ===== Thanh nut ===== */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.buttonRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={handleSave}
            accessibilityRole="button"
          >
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={16}
              color={COLORS.textPrimary}
            />
            <Text style={styles.secondaryButtonText}>
              {saved ? 'Đã lưu' : 'Lưu lại'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.primaryButton}
            onPress={handleAddToCart}
            accessibilityRole="button"
          >
            <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>
              {`Thêm ${quantity} ${product.unit}`}
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.secondaryButton, { marginTop: 10, flex: 0 }]}
          onPress={handleRestart}
          accessibilityRole="button"
        >
          <Ionicons name="refresh" size={16} color={COLORS.textPrimary} />
          <Text style={styles.secondaryButtonText}>Mô phỏng ảnh khác</Text>
        </Pressable>
      </View>
    </View>
  );
};

/** Style tuyet doi cho lop phu anh - tranh tao StyleSheet trong render */
const StyleSheetAbsoluteFill = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export default ResultScreen;
