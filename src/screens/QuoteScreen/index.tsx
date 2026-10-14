/**
 * src/screens/QuoteScreen/index.tsx
 * Man hinh GIO HANG & BAO GIA (Tinh nang 3).
 *   Danh sach mon | Tang/giam so luong | Xoa | Tong ket | Xuat bao gia
 *
 * Du lieu lay tu CartContext (da luu AsyncStorage).
 * Chuan PROG3002: Functional Component + Hooks, StyleSheet.create, no 'any'.
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../context/CartContext';
import { calcTotalPrice, formatVnd } from '../../utils/format';
import { COLORS } from '../HomeScreen/styles';
import type { RootTabParamList } from '../../types';
import styles from './styles';

/** Don gia van chuyen mac dinh (VND) - mien phi cho don tren 5 trieu */
const SHIPPING_FEE = 200000;
const FREE_SHIPPING_THRESHOLD = 5000000;
/** VAT 10% theo quy dinh */
const VAT_RATE = 0.1;

const QuoteScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { items, totalCount, removeFromCart, setQuantity, clearCart } =
    useCart();

  const [quoteVisible, setQuoteVisible] = useState<boolean>(false);

  /* ---------------- Derived: tong tien ---------------- */
  const subtotal = useMemo<number>(
    () =>
      items.reduce(
        (sum: number, it: CartItem): number =>
          sum + calcTotalPrice(it.quantity, it.product.price),
        0,
      ),
    [items],
  );

  const shippingFee = useMemo<number>(
    () => (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE),
    [subtotal],
  );

  const vatAmount = useMemo<number>(
    () => Math.round((subtotal + shippingFee) * VAT_RATE),
    [subtotal, shippingFee],
  );

  const grandTotal = subtotal + shippingFee + vatAmount;

  /* ---------------- Handlers ---------------- */
  const handleClearCart = useCallback((): void => {
    Alert.alert('Xóa giỏ hàng', 'Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa hết',
        style: 'destructive',
        onPress: clearCart,
      },
    ]);
  }, [clearCart]);

  const handleRemoveItem = useCallback(
    (productId: string, name: string): void => {
      Alert.alert('Xóa sản phẩm', `Xóa "${name}" khỏi giỏ hàng?`, [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: (): void => removeFromCart(productId),
        },
      ]);
    },
    [removeFromCart],
  );

  const handleBrowse = useCallback((): void => {
    navigation.navigate('Catalog');
  }, [navigation]);

  /* ---------------- Tao noi dung bao gia (text) ---------------- */
  const quoteText = useMemo<string>(() => {
    const lines: string[] = [
      'BÁO GIÁ VẬT LIỆU XÂY DỰNG',
      'Công ty VLXD Sales',
      `Ngày: ${new Date().toLocaleDateString('vi-VN')}`,
      '--------------------------------',
    ];

    items.forEach((it: CartItem, idx: number): void => {
      lines.push(
        `${idx + 1}. ${it.product.name}`,
        `   ${it.quantity} ${it.product.unit} x ${formatVnd(it.product.price)} = ${formatVnd(calcTotalPrice(it.quantity, it.product.price))}`,
      );
    });

    lines.push(
      '--------------------------------',
      `Tạm tính:      ${formatVnd(subtotal)}`,
      `Vận chuyển:    ${shippingFee === 0 ? 'Miễn phí' : formatVnd(shippingFee)}`,
      `VAT 10%:       ${formatVnd(vatAmount)}`,
      '--------------------------------',
      `TỔNG CỘNG:     ${formatVnd(grandTotal)}`,
      '',
      `Tổng số lượng: ${totalCount} đơn vị`,
    );

    return lines.join('\n');
  }, [items, subtotal, shippingFee, vatAmount, grandTotal, totalCount]);

  const handleExportQuote = useCallback((): void => {
    setQuoteVisible(true);
  }, []);

  /* ---------------- Render 1 dong gio hang ---------------- */
  const renderItem = useCallback(
    ({ item }: { item: CartItem }): React.JSX.Element => (
      <View style={styles.itemRow}>
        <Image
          source={{ uri: item.product.imageUrl }}
          style={styles.itemImage}
          resizeMode="cover"
        />

        <View style={styles.itemBody}>
          <View>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.product.name}
            </Text>
            <Text style={styles.itemBrand} numberOfLines={1}>
              {`${item.product.brand} · ${formatVnd(item.product.price)}/${item.product.unit}`}
            </Text>
          </View>

          <View style={styles.stepperRow}>
            {/* Bo dem so luong */}
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepperButton}
                onPress={(): void =>
                  setQuantity(item.product.id, item.quantity - 1)
                }
                accessibilityLabel="Giảm số lượng"
              >
                <Ionicons name="remove" size={16} color={COLORS.textPrimary} />
              </Pressable>

              <Text style={styles.stepperValue}>
                {`${item.quantity} ${item.product.unit}`}
              </Text>

              <Pressable
                style={styles.stepperButton}
                onPress={(): void =>
                  setQuantity(item.product.id, item.quantity + 1)
                }
                accessibilityLabel="Tăng số lượng"
              >
                <Ionicons name="add" size={16} color={COLORS.textPrimary} />
              </Pressable>
            </View>

            {/* Thanh tien + xoa */}
            <View style={styles.stepper}>
              <Text style={styles.itemSubtotal}>
                {formatVnd(
                  calcTotalPrice(item.quantity, item.product.price),
                )}
              </Text>
              <Pressable
                style={styles.removeButton}
                onPress={(): void =>
                  handleRemoveItem(item.product.id, item.product.name)
                }
                accessibilityLabel="Xóa sản phẩm"
              >
                <Ionicons name="trash-outline" size={18} color="#E74C3C" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    ),
    [setQuantity, handleRemoveItem],
  );

  const keyExtractor = useCallback((item: CartItem): string => item.product.id, []);

  /* ---------------- Gio hang trong ---------------- */
  if (items.length === 0) {
    return (
      <View style={styles.screen}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
        </View>

        <View style={styles.emptyWrap}>
          <Ionicons name="cart-outline" size={64} color={COLORS.inactive} />
          <Text style={styles.emptyText}>Giỏ hàng đang trống</Text>
          <Text style={styles.emptyHint}>
            Dùng Máy tính vật tư hoặc duyệt Catalog để thêm sản phẩm
          </Text>
          <Pressable
            style={styles.browseButton}
            onPress={handleBrowse}
            accessibilityRole="button"
          >
            <Text style={styles.browseButtonText}>Duyệt Catalog</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  /* ---------------- Render ---------------- */
  return (
    <View style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Giỏ hàng</Text>
              <Text style={styles.itemBrand}>
                {`${totalCount} sản phẩm`}
              </Text>
            </View>
            <Pressable
              style={styles.clearButton}
              onPress={handleClearCart}
              accessibilityRole="button"
            >
              <Text style={styles.clearButtonText}>Xóa hết</Text>
            </Pressable>
          </View>
        }
      />

      {/* ===== Thanh tong ket ===== */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tạm tính</Text>
          <Text style={styles.summaryValue}>{formatVnd(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Vận chuyển</Text>
          <Text style={styles.summaryValue}>
            {shippingFee === 0 ? 'Miễn phí' : formatVnd(shippingFee)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>VAT 10%</Text>
          <Text style={styles.summaryValue}>{formatVnd(vatAmount)}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{formatVnd(grandTotal)}</Text>
        </View>

        <Pressable
          style={styles.quoteButton}
          onPress={handleExportQuote}
          accessibilityRole="button"
        >
          <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
          <Text style={styles.quoteButtonText}>Xuất báo giá</Text>
        </Pressable>
      </View>

      {/* ===== Modal bao gia ===== */}
      <Modal
        visible={quoteVisible}
        transparent
        animationType="slide"
        onRequestClose={(): void => setQuoteVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Báo giá</Text>
            <Text style={styles.modalSubtitle}>
              Nội dung bên dưới có thể copy để gửi cho khách
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.quoteText}>{quoteText}</Text>
            </ScrollView>

            <Pressable
              style={styles.modalCloseButton}
              onPress={(): void => setQuoteVisible(false)}
              accessibilityRole="button"
            >
              <Text style={styles.modalCloseText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default QuoteScreen;
