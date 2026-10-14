/**
 * src/screens/ProfileScreen/index.tsx
 * MAN HINH HO SO - LICH SU MO PHONG (Tinh nang 5).
 *
 * Hien thi:
 *   - Thong ke: tong so lan mo phong, so yeu thich
 *   - Bo loc: Tat ca / Yeu thich
 *   - Danh sach ban ghi: anh goc, ten vat lieu, dien tich, thoi gian
 *   - Thao tac: danh dau yeu thich, xoa, xem chi tiet
 *
 * Du lieu lay tu hook useSimulationHistory (AsyncStorage).
 * Chuan PROG3002: Functional Component + Hooks, StyleSheet.create, no 'any'.
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import {
  useSimulationHistory,
} from '../../hooks/useSimulationHistory';
import { COLORS } from '../HomeScreen/styles';
import type { RootTabParamList, SimulationRecord } from '../../types';
import styles from './styles';

/** Bo loc danh sach */
type HistoryFilter = 'all' | 'favorite';

const FILTERS: { key: HistoryFilter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'favorite', label: 'Yêu thích' },
];

/** Dinh dang thoi gian tuong doi: "2 giờ trước" */
const formatRelativeTime = (isoDate: string): string => {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) {
    return '';
  }
  const diffMs = Date.now() - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) {
    return 'Vừa xong';
  }
  if (diffMin < 60) {
    return `${diffMin} phút trước`;
  }
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return `${diffHour} giờ trước`;
  }
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) {
    return `${diffDay} ngày trước`;
  }
  return new Date(isoDate).toLocaleDateString('vi-VN');
};

const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const {
    records,
    favoriteCount,
    hydrated,
    removeRecord,
    toggleFavorite,
    clearHistory,
  } = useSimulationHistory();

  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [detailRecord, setDetailRecord] = useState<SimulationRecord | null>(null);

  /* ---------------- Derived: danh sach da loc ---------------- */
  const visibleRecords = useMemo<SimulationRecord[]>(() => {
    if (filter === 'favorite') {
      return records.filter(
        (r: SimulationRecord): boolean => r.isFavorite,
      );
    }
    return records;
  }, [records, filter]);

  /* ---------------- Handlers ---------------- */
  const handleRemove = useCallback(
    (record: SimulationRecord): void => {
      Alert.alert(
        'Xóa bản ghi',
        `Xóa lần mô phỏng "${record.productName}"?`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: (): void => removeRecord(record.id),
          },
        ],
      );
    },
    [removeRecord],
  );

  const handleClearAll = useCallback((): void => {
    Alert.alert(
      'Xóa toàn bộ lịch sử',
      `Xóa tất cả ${records.length} bản ghi? Thao tác này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa hết',
          style: 'destructive',
          onPress: clearHistory,
        },
      ],
    );
  }, [records.length, clearHistory]);

  const handleSimulate = useCallback((): void => {
    navigation.navigate('Simulate');
  }, [navigation]);

  /* ---------------- Render 1 ban ghi ---------------- */
  const renderRecord = useCallback(
    ({ item }: { item: SimulationRecord }): React.JSX.Element => (
      <Pressable
        style={styles.recordCard}
        onPress={(): void => setDetailRecord(item)}
        accessibilityRole="button"
      >
        <View style={styles.recordImageWrap}>
          <Image
            source={{ uri: item.originalUri }}
            style={styles.recordImage}
            resizeMode="cover"
          />
          {item.isFavorite ? (
            <View style={styles.favoriteBadge}>
              <Ionicons name="heart" size={11} color="#FFFFFF" />
            </View>
          ) : null}
        </View>

        <View style={styles.recordBody}>
          <View>
            <Text style={styles.recordName} numberOfLines={2}>
              {item.productName}
            </Text>
            <Text style={styles.recordMeta} numberOfLines={1}>
              {`Độ đậm ${Math.round(item.opacity * 100)}% · ${formatRelativeTime(item.createdAt)}`}
            </Text>
          </View>

          <View style={styles.recordBottomRow}>
            <Text style={styles.recordArea}>
              {`${item.estimatedArea.toFixed(1)} m²`}
            </Text>

            <View style={styles.recordActions}>
              <Pressable
                style={styles.iconButton}
                onPress={(): void => toggleFavorite(item.id)}
                accessibilityLabel="Đánh dấu yêu thích"
              >
                <Ionicons
                  name={item.isFavorite ? 'heart' : 'heart-outline'}
                  size={19}
                  color={item.isFavorite ? '#E74C3C' : COLORS.inactive}
                />
              </Pressable>

              <Pressable
                style={styles.iconButton}
                onPress={(): void => handleRemove(item)}
                accessibilityLabel="Xóa bản ghi"
              >
                <Ionicons name="trash-outline" size={18} color={COLORS.inactive} />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    ),
    [toggleFavorite, handleRemove],
  );

  const keyExtractor = useCallback((item: SimulationRecord): string => item.id, []);

  /* ---------------- Render ---------------- */
  return (
    <View style={styles.screen}>
      <FlatList
        data={visibleRecords}
        keyExtractor={keyExtractor}
        renderItem={renderRecord}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Hồ sơ của tôi</Text>
              <Text style={styles.headerSubtitle}>
                Lịch sử các lần mô phỏng vật liệu
              </Text>
            </View>

            {/* Thống kê */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{records.length}</Text>
                <Text style={styles.statLabel}>Lần mô phỏng</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{favoriteCount}</Text>
                <Text style={styles.statLabel}>Yêu thích</Text>
              </View>
            </View>

            {/* Bộ lọc */}
            <View style={styles.filterRow}>
              {FILTERS.map((item): React.JSX.Element => {
                const isActive = item.key === filter;
                return (
                  <Pressable
                    key={item.key}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                    ]}
                    onPress={(): void => setFilter(item.key)}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.filterChipTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {visibleRecords.length > 0 ? (
              <Text style={styles.sectionTitle}>
                {filter === 'favorite'
                  ? `Đã yêu thích (${visibleRecords.length})`
                  : `Tất cả lần mô phỏng (${visibleRecords.length})`}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons
              name={hydrated ? 'albums-outline' : 'hourglass-outline'}
              size={56}
              color={COLORS.inactive}
            />
            <Text style={styles.emptyText}>
              {!hydrated
                ? 'Đang tải lịch sử…'
                : filter === 'favorite'
                  ? 'Chưa có bản ghi yêu thích'
                  : 'Chưa có lần mô phỏng nào'}
            </Text>
            <Text style={styles.emptyHint}>
              {filter === 'favorite'
                ? 'Bấm biểu tượng trái tim trên bản ghi để đánh dấu yêu thích'
                : 'Vào tab Mô phỏng để chụp ảnh và thử vật liệu lên tường nhà bạn'}
            </Text>
            {filter === 'all' ? (
              <Pressable
                style={styles.browseButton}
                onPress={handleSimulate}
                accessibilityRole="button"
              >
                <Text style={styles.browseButtonText}>Bắt đầu mô phỏng</Text>
              </Pressable>
            ) : null}
          </View>
        }
        ListFooterComponent={
          records.length > 0 ? (
            <Pressable
              style={styles.clearButton}
              onPress={handleClearAll}
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={16} color="#E74C3C" />
              <Text style={styles.clearButtonText}>Xóa toàn bộ lịch sử</Text>
            </Pressable>
          ) : null
        }
      />

      {/* ===== Modal chi tiet ===== */}
      <Modal
        visible={detailRecord !== null}
        transparent
        animationType="fade"
        onRequestClose={(): void => setDetailRecord(null)}
      >
        <View style={styles.modalBackdrop}>
          {detailRecord ? (
            <View>
              <Image
                source={{ uri: detailRecord.originalUri }}
                style={styles.modalImage}
                resizeMode="cover"
              />
              <Text style={styles.modalTitle}>
                {detailRecord.productName}
              </Text>
              <Text style={styles.modalMeta}>
                {`Diện tích ước lượng: ${detailRecord.estimatedArea.toFixed(2)} m²\nĐộ đậm vật liệu: ${Math.round(detailRecord.opacity * 100)}%\nThời gian: ${new Date(detailRecord.createdAt).toLocaleString('vi-VN')}`}
              </Text>

              <Pressable
                style={styles.modalCloseButton}
                onPress={(): void => setDetailRecord(null)}
                accessibilityRole="button"
              >
                <Text style={styles.modalCloseText}>Đóng</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
