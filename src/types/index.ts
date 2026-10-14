/**
 * src/types/index.ts
 * Tap hop TypeScript interface dung chung cho toan ung dung.
 * Nghiem cam su dung 'any' (TypeScript strict mode - PROG3002).
 */
import type { Ionicons } from '@expo/vector-icons';
import type { NavigatorScreenParams } from '@react-navigation/native';

/** Don vi tinh cua vat lieu xay dung */
export type UnitOfMeasure = 'm2' | 'viên' | 'bao' | 'thùng' | 'lít' | 'tấn';

/** Ten glyph hop le cua bo icon Ionicons */
export type IoniconName = keyof typeof Ionicons.glyphMap;

/** Nhom vat lieu - dung cho bo loc o man Catalog */
export type ProductCategory =
  | 'Gạch ốp lát'
  | 'Sơn nước'
  | 'Xi măng'
  | 'Keo & Phụ gia'
  | 'Gạch trang trí';

/** Be mat vat lieu co the ap len (phuc vu Virtual Visualizer sau nay) */
export type SurfaceType = 'floor' | 'wall' | 'both';

/** San pham vat lieu xay dung (Catalog / Trending) */
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number; // don vi: VND
  unit: UnitOfMeasure;
  imageUrl: string; // URL anh san pham
  category: ProductCategory;
  /* ---------- Thong tin bo sung cho man Chi tiet ---------- */
  description: string; // mo ta ngan gon
  origin: string; // xuat xu
  warranty: string; // bao hanh
  inStock: boolean; // con hang hay khong
  /* ---------- Thong tin phuc vu Virtual Visualizer ---------- */
  surfaceType: SurfaceType; // ap duoc cho san / tuong / ca hai
  tileWidth: number; // chieu rong 1 vien (cm), 0 neu khong phai dang vien
  tileHeight: number; // chieu dai 1 vien (cm), 0 neu khong phai dang vien
  colorHex: string; // mau chu dao (dung cho son / loc mau)
}

/** Item Quick Actions (4 icon tron tren man Home) */
export interface QuickAction {
  id: string;
  label: string;
  iconName: IoniconName;
  /** Chi cho phep cac route co that trong Navigator (type-safe) */
  routeName: keyof RootTabParamList;
}

/** Du an / cong trinh tieu bieu (Reference Projects) */
export interface Project {
  id: string;
  name: string; // Ten cong trinh
  location: string; // Dia diem
  imageUrl: string;
  area: string; // Dien tich thi cong, VD: '120 m2'
}

/* ================== NAVIGATION ================== */

/** Params cua bottom tab "Catalog" (Stack Navigator long ben trong) */
export type CatalogStackParamList = {
  CatalogList: undefined;
  ProductDetail: { productId: string };
};

/**
 * Params cua tab "Simulate" (Virtual Visualizer - Tinh nang 4).
 * Luong: SimulateHome -> SurfacePicker -> MaterialPicker -> Visualize -> Result
 */
export type SimulateStackParamList = {
  SimulateHome: undefined;
  /** Buoc 2: keo 4 diem neo xac dinh mat phang be mat */
  SurfacePicker: { imageUri: string };
  /** Buoc 3: chon vat lieu de ap len be mat */
  MaterialPicker: {
    imageUri: string;
    /** 4 diem neo theo toa do pixel tren anh goc */
    corners: ImageCorners;
    /** Kich thuoc anh goc (de tinh ty le hien thi) */
    imageSize: ImageSize;
  };
  /** Buoc 4: xem truoc ket qua + chinh do phong / do dam */
  Visualize: {
    imageUri: string;
    corners: ImageCorners;
    imageSize: ImageSize;
    productId: string;
  };
  /** Buoc 5: ket qua cuoi + du toan + them vao gio */
  Result: {
    imageUri: string;
    corners: ImageCorners;
    imageSize: ImageSize;
    productId: string;
    /** Do phong da chon (0..1) */
    opacity: number;
  };
};

/** Mot diem toa do tren anh (don vi: pixel cua anh goc) */
export interface Point {
  x: number;
  y: number;
}

/** Kich thuoc anh goc */
export interface ImageSize {
  width: number;
  height: number;
}

/**
 * 4 diem neo cua mat phang be mat, theo thu tu:
 * topLeft -> topRight -> bottomRight -> bottomLeft
 */
export interface ImageCorners {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
}

/** Ban ghi 1 lan mo phong - dung cho Tinh nang 5 (lich su) */
export interface SimulationRecord {
  id: string;
  /** Duong dan anh goc (da luu trong bo nho app) */
  originalUri: string;
  /** Duong dan anh ket qua (da luu) */
  resultUri: string | null;
  productId: string;
  productName: string;
  opacity: number;
  /** Dien tich be mat uoc luong (m2) */
  estimatedArea: number;
  createdAt: string; // ISO date string
  isFavorite: boolean;
}

/**
 * Params cua Bottom Tab Navigator.
 * Cac tab dung Stack dung NavigatorScreenParams de ho tro navigate long:
 *   navigation.navigate('Catalog', { screen: 'ProductDetail', params: {...} })
 */
export type RootTabParamList = {
  Home: { greeting?: string } | undefined;
  /** Tab Catalog chua Stack (danh sach -> chi tiet) */
  Catalog: NavigatorScreenParams<CatalogStackParamList> | undefined;
  /** May tinh vat tu (Tinh nang 2) */
  Calculate: undefined;
  /** Bao gia tron goi cong trinh */
  Pricing: undefined;
  /** Gio hang & bao gia (Tinh nang 3) */
  Quote: undefined;
  /** Ho so - lich su mo phong (Tinh nang 5) */
  Profile: undefined;
  /** Virtual Visualizer (Tinh nang 4) */
  Simulate: NavigatorScreenParams<SimulateStackParamList> | undefined;
};
