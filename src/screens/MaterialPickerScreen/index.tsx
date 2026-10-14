/**
 * src/screens/MaterialPickerScreen/index.tsx
 * BUOC 3 cua Virtual Visualizer: chon vat lieu de ap len be mat da chon.
 *
 * Loc theo be mat (san / tuong / ca hai) dua tren truong `surfaceType`
 * cua Product - de chi hien thi vat lieu phu hop voi vi tri thi cong.
 *
 * Chuan PROG3002: Functional Component + Hooks, StyleSheet.create, no 'any'.
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TRENDING_PRODUCTS } from '../../data/mockData';
import { formatVnd } from '../../utils/format';
import { estimateRealArea } from '../../utils/perspective';
import { COLORS } from '../HomeScreen/styles';
import type { Product, SimulateStackParamList, SurfaceType } from '../../types';
import styles from './styles';

type MaterialPickerProps = NativeStackScreenProps<
  SimulateStackParamList,
  'MaterialPicker'
>;

/** Lua chon vi tri thi cong */
type SurfaceFilter = 'all' | SurfaceType;

const FILTERS: { key: SurfaceFilter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'floor', label: 'Lát sàn' },
  { key: 'wall', label: 'Ốp tường' },
];

/** So duong ke o mo phong texture */
const GRID_LINES = 3;

const MaterialPickerScreen: React.FC<MaterialPickerProps> = ({
  route,
  navigation,
}) => {
  const { imageUri, corners, imageSize } = route.params;

  const [filter, setFilter] = useState<SurfaceFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* ---------------- Loc vat lieu theo be mat ---------------- */
  const materials = useMemo<Product[]>(() => {
    if (filter === 'all') {
      return TRENDING_PRODUCTS;
    }
    // Vat lieu dung duoc cho ca hai (both) luon hien thi
    return TRENDING_PRODUCTS.filter(
      (p: Product): boolean =>
        p.surfaceType === filter || p.surfaceType === 'both',
    );
  }, [filter]);

  /** Diem neo thu nho de hien thi xem truoc */
  const previewScale = useMemo<number>(() => {
    if (imageSize.width === 0) {
      return 1;
    }
    return 1;
  }, [imageSize.width]);

  const estimatedArea = useMemo<number>(
    () => estimateRealArea(corners),
    [corners],
  );

  /* ---------------- Handlers ---------------- */
  const handleSelect = useCallback((productId: string): void => {
    setSelectedId((prev: string | null): string | null =>
      prev === productId ? null : productId,
    );
  }, []);

  const handleNext = useCallback((): void => {
    if (!selectedId) {
      return;
    }
    navigation.navigate('Visualize', {
      imageUri,
      corners,
      imageSize,
      productId: selectedId,
    });
  }, [selectedId, navigation, imageUri, corners, imageSize]);

  const selectedProduct = useMemo<Product | null>(
    () =>
      materials.find((p: Product): boolean => p.id === selectedId) ?? null,
    [materials, selectedId],
  );

  /* ---------------- Render 1 the vat lieu ---------------- */
  const renderMaterial = useCallback(
    ({ item }: { item: Product }): React.JSX.Element => {
      const isActive = item.id === selectedId;
      return (
        <Pressable
          style={[
            styles.materialCard,
            isActive && styles.materialCardActive,
          ]}
          onPress={(): void => handleSelect(item.id)}
          accessibilityRole="button"
          accessibilityLabel={item.name}
        >
          {/* O mau mo phong van vat lieu (dung colorHex tu mockData) */}
          <View style={[styles.swatchFill, { backgroundColor: item.colorHex }]}>
            {Array.from({ length: GRID_LINES }).map(
              (_unused: unknown, idx: number): React.JSX.Element => (
                <View
                  key={`v-${idx}`}
                  style={[
                    styles.swatchGridLine,
                    {
                      left: `${((idx + 1) * 100) / (GRID_LINES + 1)}%`,
                      top: 0,
                      bottom: 0,
                      width: 1,
                    },
                  ]}
                />
              ),
            )}
            {Array.from({ length: GRID_LINES }).map(
              (_unused: unknown, idx: number): React.JSX.Element => (
                <View
                  key={`h-${idx}`}
                  style={[
                    styles.swatchGridLine,
                    {
                      top: `${((idx + 1) * 100) / (GRID_LINES + 1)}%`,
                      left: 0,
                      right: 0,
                      height: 1,
                    },
                  ]}
                />
              ),
            )}
          </View>

          {isActive ? (
            <View style={styles.selectedBadge}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
          ) : null}

          <View style={styles.materialBody}>
            <Text style={styles.materialName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.materialMeta} numberOfLines={1}>
              {item.tileWidth > 0
                ? `${item.tileWidth}x${item.tileHeight}cm`
                : item.brand}
            </Text>
            <Text style={styles.materialPrice} numberOfLines={1}>
              {`${formatVnd(item.price)}/${item.unit}`}
            </Text>
          </View>
        </Pressable>
      );
    },
    [selectedId, handleSelect],
  );

  const keyExtractor = useCallback((item: Product): string => item.id, []);

  /* ---------------- Render ---------------- */
  return (
    <View style={styles.screen}>
      {/* ===== Header ===== */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={(): void => navigation.goBack()}
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Chọn vật liệu</Text>
            <Text style={styles.headerStep}>Bước 3 / 5</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== Xem truoc vung da chon ===== */}
        <View style={styles.previewWrap}>
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <Text style={styles.previewCaption}>
            {`Vùng đã chọn: ${estimatedArea.toFixed(2)} m² · ${materials.length} vật liệu phù hợp`}
          </Text>
        </View>

        {/* ===== Chip loc theo be mat ===== */}
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(item): string => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          renderItem={({
            item,
          }: {
            item: { key: SurfaceFilter; label: string };
          }): React.JSX.Element => {
            const isActive = item.key === filter;
            return (
              <Pressable
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={(): void => setFilter(item.key)}
                accessibilityRole="button"
              >
                <Text
                  style={[styles.chipText, isActive && styles.chipTextActive]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />

        {/* ===== Luoi vat lieu ===== */}
        <FlatList
          data={materials}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          renderItem={renderMaterial}
        />
      </ScrollView>

      {/* ===== Thanh duoi ===== */}
      <View style={styles.bottomBar}>
        <Text style={styles.selectedInfo} numberOfLines={1}>
          {selectedProduct ? (
            <>
              {'Đã chọn: '}
              <Text style={styles.selectedName}>{selectedProduct.name}</Text>
            </>
          ) : (
            'Chưa chọn vật liệu — hãy bấm vào một vật liệu bên trên'
          )}
        </Text>

        <Pressable
          style={[styles.nextButton, !selectedId && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedId}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.nextButtonText,
              !selectedId && styles.nextButtonTextDisabled,
            ]}
          >
            Xem trước kết quả
          </Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={selectedId ? '#FFFFFF' : COLORS.inactive}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default MaterialPickerScreen;
