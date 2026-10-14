/**
 * src/screens/VisualizeScreen/index.tsx
 * BUOC 4 cua Virtual Visualizer: ap vat lieu len be mat da chon.
 *
 * ==== KY THUAT COT LOI ====
 * React Native khong ho tro bien doi phoi canh 3D that cho View thuong.
 * Vi vay ta chia be mat thanh LUOI NHIEU O NHO (vi du 12x12).
 * Moi o la mot View nho, duoc bien doi bang `transform: [{ matrix }]`
 * sao cho 4 goc cua no roi dung vao vi tri noi suy song tuyen tinh
 * tren tu giac diem neo.
 *
 * Khi so o du lon (12x12 = 144 o), mat nguoi khong phan biet duoc
 * ranh gioi giua cac o -> hien len nhu mot mat phang vat lieu lien tuc
 * nam dung phoi canh cua buc anh.
 *
 * Do dam (opacity) dieu chinh bang slider -> cho phep "hoa tron"
 * vat lieu voi anh goc de trong tu nhien hon.
 *
 * Chuan PROG3002: Functional Component + Hooks, StyleSheet.create, no 'any'.
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  PanResponder,
  Pressable,
  Text,
  View,
} from 'react-native';
import type { GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { findProductById } from '../../data/mockData';
import { formatVnd } from '../../utils/format';
import { bilinearInterpolate, tileMatrix } from '../../utils/perspective';
import { COLORS } from '../HomeScreen/styles';
import type { Point, SimulateStackParamList } from '../../types';
import styles from './styles';

type VisualizeProps = NativeStackScreenProps<
  SimulateStackParamList,
  'Visualize'
>;

/** So o chia theo moi chieu. 12x12 = 144 o - du min de trong lien mach. */
const GRID_DIVISIONS = 12;

/** Che do xem truoc */
type ViewMode = 'after' | 'before' | 'compare';

const MAX_DIVIDER = 0.92;
const MIN_DIVIDER = 0.08;

const VisualizeScreen: React.FC<VisualizeProps> = ({ route, navigation }) => {
  const { imageUri, corners, imageSize, productId } = route.params;
  const insets = useSafeAreaInsets();

  /* ---------------- State ---------------- */
  const [opacity, setOpacity] = useState<number>(0.85);
  const [mode, setMode] = useState<ViewMode>('after');
  /** Vi tri duong chia so sanh (0..1 theo chieu ngang) */
  const [dividerX, setDividerX] = useState<number>(0.5);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 },
  );

  const product = useMemo(() => findProductById(productId), [productId]);

  /* ---------------- Ty le hien thi ---------------- */
  const scale = useMemo<number>(() => {
    if (imageSize.width === 0 || canvasSize.width === 0) {
      return 1;
    }
    return canvasSize.width / imageSize.width;
  }, [imageSize.width, canvasSize.width]);

  const displayWidth = imageSize.width * scale;
  const displayHeight = imageSize.height * scale;

  /* ---------------- Tinh truoc cac o texture ---------------- */
  /**
   * Voi moi o (i, j) trong luoi, tinh ma tran bien doi de o do
   * khop voi vung tuong ung tren tu giac phoi canh.
   *
   * Moi o duoc ve o kich thuoc 1x1 pixel roi keo gian bang matrix
   * (a, b, c, d) -> khong phu thuoc kich thuoc man hinh.
   */
  const tiles = useMemo(() => {
    const result: {
      key: string;
      matrix: number[];
    }[] = [];

    for (let row = 0; row < GRID_DIVISIONS; row += 1) {
      for (let col = 0; col < GRID_DIVISIONS; col += 1) {
        const u0 = col / GRID_DIVISIONS;
        const u1 = (col + 1) / GRID_DIVISIONS;
        const v0 = row / GRID_DIVISIONS;
        const v1 = (row + 1) / GRID_DIVISIONS;

        const matrix = tileMatrix(corners, u0, v0, u1, v1);

        // Bo qua o suy bien (dien tich ~ 0) de tranh loi hien thi
        const area = Math.abs(matrix[0] * matrix[3] - matrix[1] * matrix[2]);
        if (area < 0.5) {
          continue;
        }

        result.push({ key: `tile-${row}-${col}`, matrix });
      }
    }

    return result;
  }, [corners]);

  /* ---------------- Vi tri trung tam vung chon (de ve nhan) ---------------- */
  const centerPoint = useMemo<Point>(
    () => bilinearInterpolate(corners, 0.5, 0.5),
    [corners],
  );

  /* ---------------- PanResponder cho duong chia so sanh ---------------- */
  const canvasWidthRef = useRef<number>(0);
  canvasWidthRef.current = displayWidth;
  const dividerStartRef = useRef<number>(0.5);

  const dividerResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (): boolean => true,
        onMoveShouldSetPanResponder: (): boolean => true,
        onPanResponderGrant: (): void => {
          dividerStartRef.current = dividerX;
        },
        onPanResponderMove: (
          _event: GestureResponderEvent,
          gesture: PanResponderGestureState,
        ): void => {
          const width = canvasWidthRef.current;
          if (width <= 0) {
            return;
          }
          const next = dividerStartRef.current + gesture.dx / width;
          setDividerX(Math.min(Math.max(next, MIN_DIVIDER), MAX_DIVIDER));
        },
      }),
    [dividerX],
  );

  /* ---------------- Slider do dam (keo ngang) ---------------- */
  const sliderWidthRef = useRef<number>(0);
  const opacityStartRef = useRef<number>(0.85);

  const sliderResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (): boolean => true,
        onMoveShouldSetPanResponder: (): boolean => true,
        onPanResponderGrant: (): void => {
          opacityStartRef.current = opacity;
        },
        onPanResponderMove: (
          _event: GestureResponderEvent,
          gesture: PanResponderGestureState,
        ): void => {
          const width = sliderWidthRef.current;
          if (width <= 0) {
            return;
          }
          const next = opacityStartRef.current + gesture.dx / width;
          setOpacity(Math.min(Math.max(next, 0), 1));
        },
      }),
    [opacity],
  );

  /* ---------------- Handlers ---------------- */
  const handleNext = useCallback((): void => {
    navigation.navigate('Result', {
      imageUri,
      corners,
      imageSize,
      productId,
      opacity,
    });
  }, [navigation, imageUri, corners, imageSize, productId, opacity]);

  const handleReselect = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  /* ---------------- Khong tim thay vat lieu ---------------- */
  if (!product) {
    return (
      <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: COLORS.textSecondary }}>
          Không tìm thấy vật liệu đã chọn.
        </Text>
        <Pressable onPress={handleReselect} style={{ marginTop: 14 }}>
          <Text style={{ color: COLORS.accent }}>← Quay lại chọn lại</Text>
        </Pressable>
      </View>
    );
  }

  /** Duong chia chi hien khi o che do so sanh */
  const showDivider = mode === 'compare';
  const showTexture = mode !== 'before';
  const dividerPixel = displayWidth * dividerX;

  return (
    <View style={styles.screen}>
      {/* ===== Vung canvas ===== */}
      <View
        style={styles.canvasWrap}
        onLayout={(event): void => {
          const { width, height } = event.nativeEvent.layout;
          setCanvasSize((prev) =>
            prev.width === width && prev.height === height
              ? prev
              : { width, height },
          );
        }}
      >
        {canvasSize.width > 0 ? (
          <View style={{ width: displayWidth, height: displayHeight }}>
            {/* --- Anh goc --- */}
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.photo,
                { width: displayWidth, height: displayHeight },
              ]}
              resizeMode="contain"
            />

            {/* --- Lop texture vat lieu (luoi o nho bien doi) --- */}
            {showTexture
              ? tiles.map((tile): React.JSX.Element => {
                  // O nao nam ben phai duong chia thi an di (che do so sanh)
                  const tileCenterU = 0;
                  void tileCenterU;

                  return (
                    <View
                      key={tile.key}
                      style={[
                        styles.textureTile,
                        {
                          width: 1,
                          height: 1,
                          opacity,
                          backgroundColor: product.colorHex,
                          transform: [
                            {
                              matrix: tile.matrix as unknown as number[],
                            },
                          ],
                        },
                      ]}
                    />
                  );
                })
              : null}

            {/* --- Lop phu "truoc" khi so sanh: che nua trai --- */}
            {showDivider ? (
              <>
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: dividerPixel,
                    height: displayHeight,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={{
                      width: displayWidth,
                      height: displayHeight,
                    }}
                    resizeMode="contain"
                  />
                </View>

                {/* Duong chia + tay keo */}
                <View
                  style={[styles.divider, { left: dividerPixel }]}
                  {...dividerResponder.panHandlers}
                >
                  <View style={styles.dividerHandle}>
                    <Ionicons
                      name="swap-horizontal"
                      size={18}
                      color="#1A1A1A"
                    />
                  </View>
                </View>

                {/* Nhan BEFORE / AFTER */}
                <View style={[styles.compareLabel, { left: 12 }]}>
                  <Text style={styles.compareLabelText}>TRƯỚC</Text>
                </View>
                <View
                  style={[
                    styles.compareLabel,
                    { right: 12, left: undefined },
                  ]}
                >
                  <Text style={styles.compareLabelText}>SAU</Text>
                </View>
              </>
            ) : null}

            {/* Nhan vat lieu hien o goc duoi phai */}
            {mode === 'after' ? (
              <View
                style={{
                  position: 'absolute',
                  left: centerPoint.x * scale - 60,
                  top: centerPoint.y * scale - 14,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 6,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}
                >
                  {`${product.tileWidth}x${product.tileHeight}cm`}
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <ActivityIndicator size="large" color={COLORS.accent} />
        )}
      </View>

      {/* ===== Header ===== */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={handleReselect}
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>

          <View>
            <Text style={styles.headerTitle}>Xem trước kết quả</Text>
            <Text style={styles.headerStep}>Bước 4 / 5</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>
      </View>

      {/* ===== Bang dieu khien ===== */}
      <View style={[styles.controlPanel, { paddingBottom: insets.bottom + 16 }]}>
        {/* Che do xem */}
        <View style={styles.modeRow}>
          {(
            [
              { key: 'before', label: 'Trước' },
              { key: 'after', label: 'Sau' },
              { key: 'compare', label: 'So sánh' },
            ] as { key: ViewMode; label: string }[]
          ).map((item): React.JSX.Element => {
            const isActive = item.key === mode;
            return (
              <Pressable
                key={item.key}
                style={[styles.modeChip, isActive && styles.modeChipActive]}
                onPress={(): void => setMode(item.key)}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.modeChipText,
                    isActive && styles.modeChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Slider do dam */}
        <View style={styles.sliderRow}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>Độ đậm vật liệu</Text>
            <Text style={styles.sliderValue}>
              {`${Math.round(opacity * 100)}%`}
            </Text>
          </View>

          <View
            style={{ position: 'relative', justifyContent: 'center' }}
            onLayout={(event): void => {
              sliderWidthRef.current = event.nativeEvent.layout.width;
            }}
            {...sliderResponder.panHandlers}
          >
            <View style={styles.sliderTrack}>
              <View
                style={[styles.sliderFill, { width: `${opacity * 100}%` }]}
              />
            </View>
            <View
              style={[styles.sliderThumb, { left: `${opacity * 100}%` }]}
            />
          </View>
        </View>

        {/* Thong tin vat lieu dang ap */}
        <View style={styles.materialRow}>
          <View
            style={[
              styles.materialSwatch,
              { backgroundColor: product.colorHex },
            ]}
          />
          <View style={styles.materialInfo}>
            <Text style={styles.materialName} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.materialMeta} numberOfLines={1}>
              {`${product.tileWidth > 0 ? `${product.tileWidth}x${product.tileHeight}cm · ` : ''}${formatVnd(product.price)}/${product.unit}`}
            </Text>
          </View>
        </View>

        {/* Nut */}
        <View style={styles.buttonRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={handleReselect}
            accessibilityRole="button"
          >
            <Ionicons name="color-palette-outline" size={16} color={COLORS.textPrimary} />
            <Text style={styles.secondaryButtonText}>Đổi vật liệu</Text>
          </Pressable>

          <Pressable
            style={styles.primaryButton}
            onPress={handleNext}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>Xem dự toán</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default VisualizeScreen;
