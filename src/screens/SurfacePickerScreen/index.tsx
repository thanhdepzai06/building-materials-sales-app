/**
 * src/screens/SurfacePickerScreen/index.tsx
 * BUOC 2 cua Virtual Visualizer: keo 4 diem neo vao 4 goc cua mang tuong/san.
 *
 * Ky thuat: dung PanResponder de bat thao tac keo, luu toa do theo PIXEL ANH GOC
 * (khong phai pixel man hinh) -> khi hien thi thi nhan voi ty le hien thi.
 * Nho vay toa do luu lai doc lap voi kich thuoc thiet bi.
 *
 * Chuan PROG3002: Functional Component + Hooks, StyleSheet.create, no 'any'.
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Image,
  PanResponder,
  Pressable,
  Text,
  View,
} from 'react-native';
import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponderGestureState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  clampPoint,
  defaultCorners,
  estimateRealArea,
  isValidQuad,
  perspectiveSkew,
} from '../../utils/perspective';
import { COLORS } from '../HomeScreen/styles';
import type {
  ImageCorners,
  Point,
  SimulateStackParamList,
} from '../../types';
import styles, { HANDLE_RADIUS } from './styles';

type SurfacePickerProps = NativeStackScreenProps<
  SimulateStackParamList,
  'SurfacePicker'
>;

/** Ten 4 diem neo - dung lam key va label */
type CornerKey = keyof ImageCorners;

const CORNER_KEYS: CornerKey[] = [
  'topLeft',
  'topRight',
  'bottomRight',
  'bottomLeft',
];

/** Nhan hien thi cho tung diem neo */
const CORNER_LABELS: Record<CornerKey, string> = {
  topLeft: 'Trên trái',
  topRight: 'Trên phải',
  bottomRight: 'Dưới phải',
  bottomLeft: 'Dưới trái',
};

/** Nguong canh bao khi tu giac bi meo qua */
const SKEW_WARNING_THRESHOLD = 1.6;

const SurfacePickerScreen: React.FC<SurfacePickerProps> = ({
  route,
  navigation,
}) => {
  const { imageUri } = route.params;
  const insets = useSafeAreaInsets();

  /* ---------------- State ---------------- */
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [corners, setCorners] = useState<ImageCorners | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 },
  );

  /**
   * Ref giu gia tri moi nhat cua corners va ty le hien thi.
   * PanResponder duoc tao 1 lan nen closure se "nho" gia tri cu ->
   * phai doc qua ref de luon lay gia tri hien tai.
   */
  const cornersRef = useRef<ImageCorners | null>(null);
  const scaleRef = useRef<number>(1);

  /** Diem nao dang duoc keo */
  const draggingRef = useRef<CornerKey | null>(null);

  /* ---------------- Ty le hien thi anh ---------------- */
  const scale = useMemo<number>(() => {
    if (imageSize.width === 0 || canvasSize.width === 0) {
      return 1;
    }
    return canvasSize.width / imageSize.width;
  }, [imageSize.width, canvasSize.width]);

  const displayWidth = imageSize.width * scale;
  const displayHeight = imageSize.height * scale;

  /* ---------------- Cap nhat ref khi state doi ---------------- */
  cornersRef.current = corners;
  scaleRef.current = scale;

  /* ---------------- Do kich thuoc vung canvas ---------------- */
  const handleCanvasLayout = useCallback(
    (event: LayoutChangeEvent): void => {
      const { width, height } = event.nativeEvent.layout;
      setCanvasSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
    },
    [],
  );

  /* ---------------- Khi anh load xong: tao 4 diem neo mac dinh ---------------- */
  const handleImageLoad = useCallback(
    (width: number, height: number): void => {
      setImageSize({ width, height });
      setCorners((prev) => prev ?? defaultCorners(width, height));
    },
    [],
  );

  /* ---------------- PanResponder: bat dau keo 1 diem neo ---------------- */
  const startDrag = useCallback((key: CornerKey): void => {
    draggingRef.current = key;
  }, []);

  /**
   * Cap nhat vi tri diem neo dang keo.
   * Toa do tu gesture la pixel MAN HINH -> chia ty le de ra pixel ANH GOC.
   */
  const updateDrag = useCallback(
    (dx: number, dy: number, startPoint: Point): void => {
      const key = draggingRef.current;
      const currentCorners = cornersRef.current;
      if (!key || !currentCorners) {
        return;
      }

      const currentScale = scaleRef.current;
      const nextPoint: Point = {
        x: startPoint.x + dx / currentScale,
        y: startPoint.y + dy / currentScale,
      };

      const clamped = clampPoint(nextPoint, imageSize.width, imageSize.height);

      setCorners({
        ...currentCorners,
        [key]: clamped,
      });
    },
    [imageSize.width, imageSize.height],
  );

  const endDrag = useCallback((): void => {
    draggingRef.current = null;
  }, []);

  /** Toa do diem neo luc bat dau keo - de tinh delta */
  const dragStartRef = useRef<Point>({ x: 0, y: 0 });

  /** Tao PanResponder rieng cho tung diem neo */
  const responders = useMemo(() => {
    const map = {} as Record<CornerKey, ReturnType<typeof PanResponder.create>>;

    CORNER_KEYS.forEach((key: CornerKey): void => {
      map[key] = PanResponder.create({
        onStartShouldSetPanResponder: (): boolean => true,
        onMoveShouldSetPanResponder: (): boolean => true,
        onPanResponderGrant: (): void => {
          const current = cornersRef.current;
          if (current) {
            dragStartRef.current = current[key];
          }
          startDrag(key);
        },
        onPanResponderMove: (
          _event: GestureResponderEvent,
          gesture: PanResponderGestureState,
        ): void => {
          updateDrag(gesture.dx, gesture.dy, dragStartRef.current);
        },
        onPanResponderRelease: endDrag,
        onPanResponderTerminate: endDrag,
      });
    });

    return map;
  }, [startDrag, updateDrag, endDrag]);

  /* ---------------- Derived: thong tin tu giac ---------------- */
  const skew = useMemo<number>(
    () => (corners ? perspectiveSkew(corners) : 1),
    [corners],
  );

  const quadValid = useMemo<boolean>(
    () => (corners ? isValidQuad(corners) : false),
    [corners],
  );

  const estimatedArea = useMemo<number>(
    () => (corners ? estimateRealArea(corners) : 0),
    [corners],
  );

  const canContinue = corners !== null && quadValid && estimatedArea > 0;

  /* ---------------- Handlers ---------------- */
  const handleReset = useCallback((): void => {
    if (imageSize.width > 0) {
      setCorners(defaultCorners(imageSize.width, imageSize.height));
    }
  }, [imageSize.width, imageSize.height]);

  const handleNext = useCallback((): void => {
    if (!corners || !canContinue) {
      return;
    }
    navigation.navigate('MaterialPicker', {
      imageUri,
      corners,
      imageSize,
    });
  }, [corners, canContinue, navigation, imageUri, imageSize]);

  /* ---------------- Ve 4 canh cua tu giac ---------------- */
  const renderEdges = (): React.JSX.Element[] | null => {
    if (!corners) {
      return null;
    }

    const edges: React.JSX.Element[] = [];
    for (let i = 0; i < CORNER_KEYS.length; i += 1) {
      const from = corners[CORNER_KEYS[i]];
      const to = corners[CORNER_KEYS[(i + 1) % CORNER_KEYS.length]];

      const p1 = { x: from.x * scale, y: from.y * scale };
      const p2 = { x: to.x * scale, y: to.y * scale };

      const length = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

      edges.push(
        <View
          key={`edge-${CORNER_KEYS[i]}`}
          style={[
            styles.edge,
            {
              left: p1.x,
              top: p1.y,
              width: length,
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: 'left center',
            },
          ]}
        />,
      );
    }
    return edges;
  };

  /* ---------------- Render ---------------- */
  return (
    <View style={styles.screen}>
      {/* ===== Vung anh + diem neo ===== */}
      <View style={styles.canvasWrap} onLayout={handleCanvasLayout}>
        {canvasSize.width > 0 ? (
          <View
            style={[styles.canvas, { width: displayWidth, height: displayHeight }]}
          >
            <Image
              source={{ uri: imageUri }}
              style={[styles.photo, { width: displayWidth, height: displayHeight }]}
              resizeMode="contain"
              onLoad={(event): void => {
                const source = event.nativeEvent.source;
                handleImageLoad(source.width, source.height);
              }}
            />

            {renderEdges()}

            {/* 4 diem neo */}
            {corners
              ? CORNER_KEYS.map((key: CornerKey): React.JSX.Element => {
                  const point = corners[key];
                  const left = point.x * scale - HANDLE_RADIUS;
                  const top = point.y * scale - HANDLE_RADIUS;
                  return (
                    <View
                      key={key}
                      style={[styles.handle, { left, top }]}
                      {...responders[key].panHandlers}
                      accessibilityLabel={`Điểm neo ${CORNER_LABELS[key]}`}
                    >
                      <View style={styles.handleInner} />
                    </View>
                  );
                })
              : null}
          </View>
        ) : null}
      </View>

      {/* ===== Header noi tren anh ===== */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={(): void => navigation.goBack()}
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>

          <View>
            <Text style={styles.headerTitle}>Chọn vùng bề mặt</Text>
            <Text style={styles.headerStep}>Bước 2 / 5</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.hint}>
          Kéo 4 điểm cam vào 4 góc của mảng tường hoặc sàn cần thay vật liệu.
        </Text>
      </View>

      {/* ===== Thanh duoi ===== */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 18 }]}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Diện tích ước lượng</Text>
          <Text style={styles.infoValue}>
            {estimatedArea > 0 ? `${estimatedArea.toFixed(2)} m²` : '—'}
          </Text>
        </View>

        {!quadValid ? (
          <Text style={styles.warningText}>
            ⚠ Các điểm neo đang giao nhau. Hãy kéo lại để tạo thành hình tứ giác.
          </Text>
        ) : skew > SKEW_WARNING_THRESHOLD ? (
          <Text style={styles.warningText}>
            ⚠ Vùng chọn khá méo, kết quả mô phỏng có thể chưa chính xác.
          </Text>
        ) : null}

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.resetButton}
            onPress={handleReset}
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={16} color={COLORS.textPrimary} />
            <Text style={styles.resetButtonText}>Đặt lại</Text>
          </Pressable>

          <Pressable
            style={[
              styles.nextButton,
              !canContinue && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canContinue}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.nextButtonText,
                !canContinue && styles.nextButtonTextDisabled,
              ]}
            >
              Chọn vật liệu
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={canContinue ? '#FFFFFF' : COLORS.inactive}
              style={{ marginLeft: 6 }}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SurfacePickerScreen;
