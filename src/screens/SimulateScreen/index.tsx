/**
 * src/screens/SimulateScreen/index.tsx
 * Man hinh MO PHONG (Virtual Visualizer - Tinh nang 4) - buoc 1: chon anh.
 *
 * Hien tai: cho phep chon anh tu thu vien hoac chup anh moi, hien thi xem truoc.
 * Buoc tiep theo (keo 4 diem neo + ap vat lieu) se lam o giai doan sau.
 *
 * Chuan PROG3002: Functional Component + Hooks, StyleSheet.create, no 'any'.
 */
import React, { useCallback, useState } from 'react';
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
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { COLORS } from '../HomeScreen/styles';
import type { RootTabParamList } from '../../types';
import styles from './styles';

const GRADIENT_GREEN = ['#27AE60', '#2ECC71'] as const;
const GRADIENT_SLATE = ['#34495E', '#2C3E50'] as const;

/** Cac buoc cua quy trinh mo phong - hien thi de nguoi dung biet truoc */
const STEPS: { label: string; desc: string }[] = [
  {
    label: 'Chụp / chọn ảnh không gian',
    desc: 'Hướng camera vào bức tường hoặc sàn nhà cần thay vật liệu.',
  },
  {
    label: 'Xác định vùng bề mặt',
    desc: 'Kéo 4 điểm neo vào 4 góc của mảng tường/sàn để app hiểu mặt phẳng.',
  },
  {
    label: 'Chọn vật liệu',
    desc: 'Chọn gạch, gỗ, đá hoặc sơn từ Catalog của cửa hàng.',
  },
  {
    label: 'Xem trước & chốt đơn',
    desc: 'So sánh trước/sau, tính khối lượng và thêm thẳng vào giỏ hàng.',
  },
];

const SimulateScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [imageUri, setImageUri] = useState<string | null>(null);

  /* ---------------- Chup anh bang camera ---------------- */
  const handleTakePhoto = useCallback(async (): Promise<void> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Cần quyền camera',
        'Vui lòng cho phép truy cập camera trong Cài đặt để chụp ảnh không gian.',
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  /* ---------------- Chon anh tu thu vien ---------------- */
  const handlePickImage = useCallback(async (): Promise<void> => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Cần quyền thư viện ảnh',
        'Vui lòng cho phép truy cập thư viện ảnh trong Cài đặt.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const handleReset = useCallback((): void => {
    setImageUri(null);
  }, []);

  const handleContinue = useCallback((): void => {
    Alert.alert(
      'Bước tiếp theo',
      'Bước kéo 4 điểm neo và áp vật liệu sẽ được bổ sung ở giai đoạn tiếp theo của đồ án.',
      [{ text: 'Đã hiểu' }],
    );
  }, []);

  const handleOpenCatalog = useCallback((): void => {
    navigation.navigate('Catalog');
  }, [navigation]);

  /* ---------------- Render ---------------- */
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mô phỏng không gian</Text>
          <Text style={styles.headerSubtitle}>
            Chụp góc nhà của bạn rồi thử áp vật liệu lên tường hoặc sàn trước
            khi quyết định mua.
          </Text>
        </View>

        {/* ===== Chon nguon anh ===== */}
        {imageUri === null ? (
          <View style={styles.actionRow}>
            <Pressable onPress={handleTakePhoto} accessibilityRole="button">
              <LinearGradient
                colors={[...GRADIENT_GREEN]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionBox}
              >
                <Ionicons name="camera" size={36} color="#FFFFFF" />
                <Text style={styles.actionBoxText}>Chụp phòng mới</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={handlePickImage} accessibilityRole="button">
              <LinearGradient
                colors={[...GRADIENT_SLATE]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionBox}
              >
                <Ionicons name="images" size={36} color="#FFFFFF" />
                <Text style={styles.actionBoxText}>Chọn ảnh có sẵn</Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          /* ===== Xem truoc anh da chon ===== */
          <View style={styles.previewWrap}>
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.previewActions}>
              <Pressable
                style={styles.previewButton}
                onPress={handleReset}
                accessibilityRole="button"
              >
                <Ionicons name="refresh" size={16} color={COLORS.textPrimary} />
                <Text style={styles.previewButtonText}>Chọn lại</Text>
              </Pressable>

              <Pressable
                style={[styles.previewButton, styles.previewButtonPrimary]}
                onPress={handleContinue}
                accessibilityRole="button"
              >
                <Ionicons name="color-wand" size={16} color="#FFFFFF" />
                <Text
                  style={[
                    styles.previewButtonText,
                    styles.previewButtonTextPrimary,
                  ]}
                >
                  Chọn vùng bề mặt
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ===== Huong dan quy trinh ===== */}
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>Quy trình mô phỏng</Text>
          {STEPS.map((step, idx: number): React.JSX.Element => (
            <View key={step.label} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{`${idx + 1}`}</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ===== Canh bao trang thai phat trien ===== */}
        <View style={styles.noticeCard}>
          <Ionicons
            name="construct-outline"
            size={18}
            color={COLORS.accent}
          />
          <Text style={styles.noticeText}>
            Bước chọn ảnh đã hoạt động. Phần kéo điểm neo và áp vật liệu đang
            được phát triển. Trong lúc chờ, bạn có thể xem vật liệu tại Catalog.
          </Text>
        </View>

        <Pressable
          style={[styles.previewButton, { marginTop: 14 }]}
          onPress={handleOpenCatalog}
          accessibilityRole="button"
        >
          <Ionicons name="grid-outline" size={16} color={COLORS.textPrimary} />
          <Text style={styles.previewButtonText}>Xem Catalog vật liệu</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default SimulateScreen;
