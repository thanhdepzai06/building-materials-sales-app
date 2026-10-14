/**
 * src/screens/PricingScreen/index.tsx
 * MAN HINH BAO GIA TRON GOI CONG TRINH.
 *
 * Khac voi man QuoteScreen (gio hang don gian), man nay tinh bao gia day du:
 *   vat tu + keo dan + mach vua + chong tham + nhan cong
 *   + van chuyen + phu phi tang - chiet khau + VAT
 *
 * Thuat toan nam trong src/utils/pricing.ts (ham thuan, da kiem chung).
 * Tham so o src/data/pricingConfig.ts (moi so deu ghi nguon).
 *
 * Chuan PROG3002: Functional Component + Hooks, StyleSheet.create, no 'any'.
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TRENDING_PRODUCTS } from '../../data/mockData';
import { formatVnd, formatVndShort } from '../../utils/format';
import { calculateQuote } from '../../utils/pricing';
import type { QuoteResult } from '../../utils/pricing';
import { COLORS } from '../HomeScreen/styles';
import type { Product } from '../../types';
import styles from './styles';

/** Lua chon kieu thi cong */
type LayoutChoice = 'straight' | 'diagonal' | 'wallWithCorners';
/** Lua chon be mat */
type SurfaceChoice = 'floor' | 'wall';

const LAYOUT_OPTIONS: { key: LayoutChoice; label: string }[] = [
  { key: 'straight', label: 'Lát thẳng (5%)' },
  { key: 'diagonal', label: 'Lát chéo (10%)' },
  { key: 'wallWithCorners', label: 'Nhiều góc (15%)' },
];

const SURFACE_OPTIONS: { key: SurfaceChoice; label: string }[] = [
  { key: 'floor', label: 'Lát sàn' },
  { key: 'wall', label: 'Ốp tường' },
];

const PricingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  /* ---------------- State: nhap lieu ---------------- */
  const [areaText, setAreaText] = useState<string>('25');
  const [distanceText, setDistanceText] = useState<string>('5');
  const [floorText, setFloorText] = useState<string>('1');
  const [skirtingText, setSkirtingText] = useState<string>('0');

  const [productId, setProductId] = useState<string>(TRENDING_PRODUCTS[0].id);
  const [surface, setSurface] = useState<SurfaceChoice>('floor');
  const [layout, setLayout] = useState<LayoutChoice>('straight');
  const [needWaterproofing, setNeedWaterproofing] = useState<boolean>(false);
  const [needSkirting, setNeedSkirting] = useState<boolean>(false);
  const [showQuote, setShowQuote] = useState<boolean>(true);

  /* ---------------- Derived: parse so nhap ---------------- */
  const area = useMemo<number>(() => {
    const n = Number.parseFloat(areaText.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [areaText]);

  const distanceKm = useMemo<number>(() => {
    const n = Number.parseFloat(distanceText.replace(',', '.'));
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }, [distanceText]);

  const floor = useMemo<number>(() => {
    const n = Number.parseInt(floorText, 10);
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }, [floorText]);

  const skirtingLengthM = useMemo<number>(() => {
    const n = Number.parseFloat(skirtingText.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [skirtingText]);

  const product = useMemo<Product>(
    () =>
      TRENDING_PRODUCTS.find((p: Product): boolean => p.id === productId) ??
      TRENDING_PRODUCTS[0],
    [productId],
  );

  /* ---------------- Derived: ket qua bao gia ---------------- */
  const quote = useMemo<QuoteResult | null>(() => {
    if (area <= 0) {
      return null;
    }
    return calculateQuote({
      area,
      product,
      surface,
      layout,
      floor,
      distanceKm,
      needWaterproofing,
      needSkirting,
      skirtingLengthM,
    });
  }, [
    area,
    product,
    surface,
    layout,
    floor,
    distanceKm,
    needWaterproofing,
    needSkirting,
    skirtingLengthM,
  ]);

  /* ---------------- Handlers ---------------- */
  const handleReset = useCallback((): void => {
    setAreaText('25');
    setDistanceText('5');
    setFloorText('1');
    setSkirtingText('0');
    setNeedWaterproofing(false);
    setNeedSkirting(false);
  }, []);

  /* ---------------- Render 1 the vat lieu ---------------- */
  const renderMaterial = useCallback(
    ({ item }: { item: Product }): React.JSX.Element => {
      const isActive = item.id === productId;
      return (
        <Pressable
          style={[styles.materialChip, isActive && styles.materialChipActive]}
          onPress={(): void => setProductId(item.id)}
          accessibilityRole="button"
        >
          <View
            style={[styles.materialSwatch, { backgroundColor: item.colorHex }]}
          />
          <Text style={styles.materialChipName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.materialChipPrice} numberOfLines={1}>
            {formatVndShort(item.price)}
          </Text>
        </Pressable>
      );
    },
    [productId],
  );

  const keyExtractor = useCallback((item: Product): string => item.id, []);

  /* ---------------- Render ---------------- */
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8 },
        ]}
      >
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Báo giá trọn gói</Text>
          <Text style={styles.headerSubtitle}>
            Tính đầy đủ vật tư, nhân công, vận chuyển và thuế cho công trình
          </Text>
        </View>

        {/* ===== Bước 1: Kích thước ===== */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Diện tích & vị trí</Text>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Diện tích (m²)</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: 25"
                placeholderTextColor={COLORS.inactive}
                keyboardType="numeric"
                value={areaText}
                onChangeText={setAreaText}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tầng thi công</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: 1"
                placeholderTextColor={COLORS.inactive}
                keyboardType="numeric"
                value={floorText}
                onChangeText={setFloorText}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Bề mặt thi công</Text>
          <View style={styles.chipRow}>
            {SURFACE_OPTIONS.map((opt): React.JSX.Element => {
              const isActive = opt.key === surface;
              return (
                <Pressable
                  key={opt.key}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={(): void => setSurface(opt.key)}
                  accessibilityRole="button"
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ===== Bước 2: Chọn vật liệu ===== */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Chọn vật liệu</Text>
          </View>

          <FlatList
            horizontal
            data={TRENDING_PRODUCTS}
            keyExtractor={keyExtractor}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.materialScroll}
            renderItem={renderMaterial}
          />
        </View>

        {/* ===== Bước 3: Kiểu thi công ===== */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Kiểu thi công (hao hụt)</Text>
          </View>

          <View style={styles.chipRow}>
            {LAYOUT_OPTIONS.map((opt): React.JSX.Element => {
              const isActive = opt.key === layout;
              return (
                <Pressable
                  key={opt.key}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={(): void => setLayout(opt.key)}
                  accessibilityRole="button"
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ===== Bước 4: Tùy chọn thêm ===== */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>4</Text>
            </View>
            <Text style={styles.stepTitle}>Tùy chọn & vận chuyển</Text>
          </View>

          {/* Khoảng cách */}
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Khoảng cách vận chuyển (km)</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: 5"
                placeholderTextColor={COLORS.inactive}
                keyboardType="numeric"
                value={distanceText}
                onChangeText={setDistanceText}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Len chân tường (m dài)</Text>
              <TextInput
                style={[styles.input, !needSkirting && { opacity: 0.4 }]}
                placeholder="VD: 20"
                placeholderTextColor={COLORS.inactive}
                keyboardType="numeric"
                value={skirtingText}
                onChangeText={setSkirtingText}
                editable={needSkirting}
              />
            </View>
          </View>

          {/* Toggle chống thấm */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Chống thấm</Text>
              <Text style={styles.toggleHint}>
                Cần cho sàn WC, ban công, sân thượng
              </Text>
            </View>
            <Pressable
              style={[
                styles.toggleButton,
                needWaterproofing && styles.toggleButtonOn,
              ]}
              onPress={(): void => setNeedWaterproofing((v) => !v)}
              accessibilityRole="switch"
              accessibilityState={{ checked: needWaterproofing }}
            >
              <View
                style={[
                  styles.toggleKnob,
                  needWaterproofing && styles.toggleKnobOn,
                ]}
              />
            </Pressable>
          </View>

          {/* Toggle len chan tuong */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Len chân tường</Text>
              <Text style={styles.toggleHint}>
                Viền gạch cao 10cm dọc chân tường
              </Text>
            </View>
            <Pressable
              style={[
                styles.toggleButton,
                needSkirting && styles.toggleButtonOn,
              ]}
              onPress={(): void => setNeedSkirting((v) => !v)}
              accessibilityRole="switch"
              accessibilityState={{ checked: needSkirting }}
            >
              <View
                style={[
                  styles.toggleKnob,
                  needSkirting && styles.toggleKnobOn,
                ]}
              />
            </Pressable>
          </View>
        </View>

        {/* ===== Bảng báo giá ===== */}
        {quote ? (
          <>
            <View style={styles.quoteCard}>
              <View style={styles.quoteHeader}>
                <Text style={styles.quoteHeaderText}>
                  {`BẢNG BÁO GIÁ · ${area} m² · ${product.name.slice(0, 24)}${product.name.length > 24 ? '…' : ''}`}
                </Text>
              </View>

              {quote.lines.map((line, idx: number): React.JSX.Element => {
                const isLast = idx === quote.lines.length - 1;
                const isNegative = line.amount < 0;
                return (
                  <View
                    key={line.label}
                    style={[styles.quoteRow, isLast && styles.quoteRowLast]}
                  >
                    <View style={styles.quoteLeft}>
                      <Text style={styles.quoteLabel}>{line.label}</Text>
                      <Text style={styles.quoteDetail}>{line.detail}</Text>
                    </View>
                    <Text
                      style={[
                        styles.quoteAmount,
                        isNegative && styles.quoteAmountNegative,
                      ]}
                    >
                      {isNegative
                        ? `-${formatVnd(Math.abs(line.amount))}`
                        : formatVnd(line.amount)}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Tổng cộng */}
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>TỔNG CỘNG (đã gồm VAT)</Text>
              <Text style={styles.totalValue}>
                {formatVnd(quote.grandTotal)}
              </Text>
              <Text style={styles.totalUnitPrice}>
                {`≈ ${formatVnd(Math.round(quote.grandTotal / Math.max(area, 1)))}/m²`}
                {quote.isTile
                  ? ` · ${quote.boxesNeeded} hộp (${quote.tilesNeeded} viên)`
                  : ` · ${quote.tilesNeeded} ${product.unit}`}
              </Text>
            </View>

            {/* Cảnh báo */}
            <View style={styles.warningCard}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#F39C12"
              />
              <Text style={styles.warningText}>
                Báo giá mang tính tham khảo, dựa trên định mức và mặt bằng giá
                đã khảo sát. Giá thực tế có thể thay đổi theo thời điểm và khối
                lượng thi công. Xem chi tiết nguồn số liệu trong
                src/data/pricingConfig.ts.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.stepCard}>
            <Text style={styles.inputLabel}>
              Nhập diện tích lớn hơn 0 để xem báo giá
            </Text>
          </View>
        )}

        {/* ===== Nút ===== */}
        <View style={styles.buttonRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={handleReset}
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={16} color={COLORS.textPrimary} />
            <Text style={styles.secondaryButtonText}>Đặt lại</Text>
          </Pressable>

          <Pressable
            style={styles.primaryButton}
            onPress={(): void => setShowQuote((v) => !v)}
            accessibilityRole="button"
          >
            <Ionicons
              name={showQuote ? 'eye-off-outline' : 'eye-outline'}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.primaryButtonText}>
              {showQuote ? 'Ẩn bảng giá' : 'Xem bảng giá'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default PricingScreen;
