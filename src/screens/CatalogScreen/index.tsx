/**
 * src/screens/CatalogScreen/index.tsx
 * Man hinh CATALOG - danh sach toan bo vat lieu xay dung.
 *   Header | Search | Category chips | Luoi 2 cot san pham
 * Tinh nang 1 cua do an VLXD Sales.
 * Chuan PROG3002: Functional Component + Hooks, StyleSheet.create, no 'any'.
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CATEGORIES, TRENDING_PRODUCTS } from '../../data/mockData';
import { formatVnd } from '../../utils/format';
import { COLORS } from '../HomeScreen/styles';
import type { CatalogStackParamList, Product } from '../../types';
import styles from './styles';

type CatalogScreenProps = NativeStackScreenProps<
  CatalogStackParamList,
  'CatalogList'
>;

/** Kieu cho mot nhom danh muc (lay tu hang CATEGORIES) */
type CategoryFilter = (typeof CATEGORIES)[number];

const CatalogScreen: React.FC<CatalogScreenProps> = ({ navigation }) => {
  /* ---------------- State ---------------- */
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Tất cả');

  /* ---------------- Derived state: loc san pham ---------------- */
  const filteredProducts = useMemo<Product[]>(() => {
    const q = searchQuery.trim().toLowerCase();

    return TRENDING_PRODUCTS.filter((p: Product): boolean => {
      // 1. Loc theo danh muc
      const matchCategory =
        activeCategory === 'Tất cả' || p.category === activeCategory;
      if (!matchCategory) {
        return false;
      }
      // 2. Loc theo tu khoa (ten + thuong hieu + xuat xu)
      if (q.length === 0) {
        return true;
      }
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory]);

  /* ---------------- Handlers ---------------- */
  const handleProductPress = useCallback(
    (productId: string): void => {
      navigation.navigate('ProductDetail', { productId });
    },
    [navigation],
  );

  const handleClearSearch = useCallback((): void => {
    setSearchQuery('');
  }, []);

  const keyExtractor = useCallback((item: Product): string => item.id, []);

  /* ---------------- Render 1 the san pham ---------------- */
  const renderProduct = useCallback(
    ({ item }: { item: Product }): React.JSX.Element => (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={(): void => handleProductPress(item.id)}
        accessibilityRole="button"
        accessibilityLabel={item.name}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {!item.inStock ? (
          <View style={styles.badgeOutOfStock}>
            <Text style={styles.badgeOutOfStockText}>HẾT HÀNG</Text>
          </View>
        ) : null}

        {item.tileWidth > 0 ? (
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>
              {`${item.tileWidth}x${item.tileHeight}`}
            </Text>
          </View>
        ) : null}

        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.cardBrand} numberOfLines={1}>
            {item.brand}
          </Text>
          <Text style={styles.cardPrice} numberOfLines={1}>
            {formatVnd(item.price)}
            <Text style={styles.cardUnit}>{` / ${item.unit}`}</Text>
          </Text>
        </View>
      </Pressable>
    ),
    [handleProductPress],
  );

  /* ---------------- Render ---------------- */
  return (
    <View style={styles.screen}>
      {/* ===== Header ===== */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catalog vật liệu</Text>
        <Text style={styles.headerSubtitle}>
          {`${filteredProducts.length} / ${TRENDING_PRODUCTS.length} sản phẩm`}
        </Text>
      </View>

      {/* ===== Search ===== */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={COLORS.inactive} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm gạch, sơn, xi măng..."
          placeholderTextColor={COLORS.inactive}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 ? (
          <Pressable
            style={styles.clearButton}
            onPress={handleClearSearch}
            accessibilityLabel="Xóa tìm kiếm"
          >
            <Ionicons name="close-circle" size={18} color={COLORS.inactive} />
          </Pressable>
        ) : null}
      </View>

      {/* ===== Category chips ===== */}
      <FlatList
        horizontal
        data={[...CATEGORIES]}
        keyExtractor={(item: CategoryFilter): string => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        renderItem={({ item }: { item: CategoryFilter }): React.JSX.Element => {
          const isActive = item === activeCategory;
          return (
            <Pressable
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={(): void => setActiveCategory(item)}
              accessibilityRole="button"
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {item}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* ===== Luoi san pham 2 cot ===== */}
      <FlatList
        data={filteredProducts}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderProduct}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={48} color={COLORS.inactive} />
            <Text style={styles.emptyText}>
              Không tìm thấy vật liệu phù hợp
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default CatalogScreen;
