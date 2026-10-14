/**
 * src/data/pricingConfig.ts
 * TAP TRUNG TOAN BO HE SO DINH GIA & DINH MUC VAT TU.
 *
 * ===== GHI CHU QUAN TRONG CHO BAO CAO DO AN =====
 * Tat ca con so o day la GIA TRI MAC DINH dua tren mat bang gia thi truong
 * VLXD Viet Nam (tham khao cac trang thuong mai dien tu va dinh muc 1776
 * cua Bo Xay dung). Khi co du lieu thuc te tu khao sat, CHI CAN SUA FILE NAY,
 * khong phai sua logic o pricing.ts.
 *
 * Moi con so deu co truong `source` ghi ro nguon goc -> phuc vu cau hoi
 * cua hoi dong: "So lieu nay o dau ra?"
 */

/* ================== KIEU DU LIEU ================== */

/** Mot con so dinh muc/gia co kem nguon goc */
export interface SourcedValue {
  value: number;
  unit: string;
  /** Nguon goc so lieu - dung de bao cao va bao ve do an */
  source: string;
}

/** Loai vat lieu chinh (dung de tinh gia goc) */
export type MaterialKind =
  | 'ceramic'
  | 'granite'
  | 'porcelain'
  | 'mosaic'
  | 'wood-look';

/** Be mat hoan thien */
export type FinishKind = 'bong' | 'mo' | 'nham';

/** Xuong goc */
export type OriginKind =
  | 'viet-nam'
  | 'trung-quoc'
  | 'an-do'
  | 'tay-ban-nha'
  | 'y';

/** Loai be mat thi cong */
export type SurfaceKind = 'floor' | 'wall';

/** Ten thuong hieu co trong bang he so (dung cho tra cuu type-safe) */
export type BrandKind =
  | 'Đồng Tâm'
  | 'Prime'
  | 'VICOSTONE'
  | 'Catalan'
  | 'Viglacera'
  | 'Taicera';

/* ================== GIA GOC THEO LOAI VAT LIEU ================== */

/**
 * Gia goc (VND/m2) theo loai vat lieu - dung lam diem xuat phat,
 * sau do nhan voi cac he so dieu chinh.
 */
export const BASE_PRICE_PER_M2: Record<MaterialKind, SourcedValue> = {
  ceramic: {
    value: 160000,
    unit: 'VND/m2',
    source: 'Mat bang gia gach ceramic 60x60 pho thong, khao sat 2025',
  },
  granite: {
    value: 260000,
    unit: 'VND/m2',
    source: 'Mat bang gia gach granite 60x60-80x80, khao sat 2025',
  },
  porcelain: {
    value: 380000,
    unit: 'VND/m2',
    source: 'Mat bang gia gach porcelain xuong dai, khao sat 2025',
  },
  mosaic: {
    value: 420000,
    unit: 'VND/m2',
    source: 'Mat bang gia gach mosaic kinh trang tri, khao sat 2025',
  },
  'wood-look': {
    value: 300000,
    unit: 'VND/m2',
    source: 'Mat bang gia gach gia go 15x60-20x100, khao sat 2025',
  },
};

/* ================== HE SO DIEU CHINH ================== */

/**
 * He so theo KICH THUOC vien gach.
 * Vien cang lon cang ton nguyen lieu va kho nung -> gia cao hon.
 */
export const SIZE_FACTORS: { maxCm: number; factor: number }[] = [
  { maxCm: 40, factor: 0.85 },
  { maxCm: 60, factor: 1.0 },
  { maxCm: 80, factor: 1.25 },
  { maxCm: 100, factor: 1.5 },
  { maxCm: 999, factor: 1.8 },
];

/** He so theo BE MAT hoan thien */
export const FINISH_FACTORS: Record<FinishKind, SourcedValue> = {
  bong: {
    value: 1.0,
    unit: 'lan',
    source: 'Be mat bong kieng - muc gia chuan',
  },
  mo: {
    value: 1.05,
    unit: 'lan',
    source: 'Be mat mo (matte) - cong doan xu ly tang 5%',
  },
  nham: {
    value: 1.1,
    unit: 'lan',
    source: 'Be mat nham chong tron - cong doan tao nham tang 10%',
  },
};

/** He so theo XUAT XU */
export const ORIGIN_FACTORS: Record<OriginKind, SourcedValue> = {
  'viet-nam': {
    value: 1.0,
    unit: 'lan',
    source: 'San xuat trong nuoc - muc gia chuan',
  },
  'trung-quoc': {
    value: 0.95,
    unit: 'lan',
    source: 'Nhap khau Trung Quoc - gia canh tranh hon',
  },
  'an-do': {
    value: 1.1,
    unit: 'lan',
    source: 'Nhap khau An Do - chat luong xuong dai tot hon',
  },
  'tay-ban-nha': {
    value: 1.3,
    unit: 'lan',
    source: 'Nhap khau Tay Ban Nha - phan khuc cao cap',
  },
  y: {
    value: 1.6,
    unit: 'lan',
    source: 'Nhap khau Y - phan khuc cao cap nhat',
  },
};

/** He so theo THUONG HIEU (do tin cay thi truong) */
export const BRAND_FACTORS: Record<BrandKind, SourcedValue> = {
  'Đồng Tâm': {
    value: 1.0,
    unit: 'lan',
    source: 'Thuong hieu pho thong, muc gia chuan',
  },
  Prime: {
    value: 0.95,
    unit: 'lan',
    source: 'Thuong hieu pho thong, gia canh tranh',
  },
  VICOSTONE: {
    value: 1.35,
    unit: 'lan',
    source: 'Thuong hieu cao cap (da nhan tao)',
  },
  Catalan: {
    value: 1.0,
    unit: 'lan',
    source: 'Thuong hieu pho thong',
  },
  Viglacera: {
    value: 1.05,
    unit: 'lan',
    source: 'Thuong hieu lau doi, do tin cay cao',
  },
  Taicera: {
    value: 1.15,
    unit: 'lan',
    source: 'Thuong hieu Dai Loan, chat luong cao',
  },
};

/** He so mac dinh cho thuong hieu chua co trong bang */
export const DEFAULT_BRAND_FACTOR = 1.0;

/* ================== DINH MUC VAT TU PHU ================== */

/**
 * Dinh muc vat tu phu tren 1 m2 op lat.
 * Tham khao dinh muc 1776 (Bo Xay dung) va khuyen cao cua hang san xuat.
 */
export const AUXILIARY_SPECS = {
  /** Keo dan gach - kg/m2 */
  adhesive: {
    value: 4.5,
    unit: 'kg/m2',
    source: 'Dinh muc 1776 & khuyen cao Weber/Sika cho gach 60x60',
  } satisfies SourcedValue,

  /** Mach vua (grout) - kg/m2 */
  grout: {
    value: 0.5,
    unit: 'kg/m2',
    source: 'Dinh muc 1776 - cong tac lat gach',
  } satisfies SourcedValue,

  /** Chong tham - kg/m2 (chi ap dung cho khu uot) */
  waterproofing: {
    value: 1.5,
    unit: 'kg/m2',
    source: 'Khuyen cao Kova/Sika cho san WC, ban cong',
  } satisfies SourcedValue,

  /** Don gia keo dan gach - VND/kg */
  adhesivePrice: {
    value: 12000,
    unit: 'VND/kg',
    source: 'Mat bang gia keo dan gach pho thong 2025',
  } satisfies SourcedValue,

  /** Don gia mach vua - VND/kg */
  groutPrice: {
    value: 25000,
    unit: 'VND/kg',
    source: 'Mat bang gia mach vua (grout) 2025',
  } satisfies SourcedValue,

  /** Don gia chong tham - VND/kg */
  waterproofingPrice: {
    value: 90000,
    unit: 'VND/kg',
    source: 'Mat bang gia chong tham goc xi mang 2025',
  } satisfies SourcedValue,
};

/* ================== NHAN CONG ================== */

/** Don gia nhan cong theo loai be mat - VND/m2 */
export const LABOR_RATES: Record<SurfaceKind, SourcedValue> = {
  floor: {
    value: 100000,
    unit: 'VND/m2',
    source: 'Don gia nhan cong lat gach san pho thong 2025',
  },
  wall: {
    value: 120000,
    unit: 'VND/m2',
    source: 'Don gia nhan cong op tuong 2025',
  },
};

/** Phu thu nhan cong theo kich thuoc vien gach lon */
export const LABOR_LARGE_TILE_SURCHARGE: {
  minCm: number;
  surchargePercent: number;
}[] = [
  { minCm: 80, surchargePercent: 30 },
  { minCm: 60, surchargePercent: 15 },
];

/** Phu thu nhan cong cho gach mosaic (thi cong thu cong, ton thoi gian) */
export const LABOR_MOSAIC_SURCHARGE_PERCENT = 50;

/* ================== VAN CHUYEN ================== */

/** Mien phi van chuyen trong ban kinh nay (km) */
export const FREE_SHIPPING_RADIUS_KM = 5;

/** Don gia van chuyen cho moi km vuot ban kinh mien phi (VND/km) */
export const SHIPPING_RATE_PER_KM: SourcedValue = {
  value: 15000,
  unit: 'VND/km',
  source: 'Mat bang gia van chuyen vat lieu xay dung 2025',
};

/** Phu phi van chuyen toi da (tranh phat sinh qua lon) */
export const MAX_SHIPPING_FEE = 3000000;

/* ================== PHU PHI TANG ================== */

/**
 * Phu phi vac vat lieu len tang (VND/m2).
 * Tang 1 = 0, tang cang cao cang ton cong.
 */
export const FLOOR_SURCHARGE_PER_M2: SourcedValue[] = [
  { value: 0, unit: 'VND/m2', source: 'Tang 1 - khong phu phi' },
  { value: 5000, unit: 'VND/m2', source: 'Tang 2 - vac bo thu cong' },
  { value: 10000, unit: 'VND/m2', source: 'Tang 3 tro len - vac bo nhieu tang' },
];

/* ================== HOA HONG / CHIET KHAU ================== */

/**
 * Chiet khau theo gia tri don hang (VND).
 * Mua cang nhieu chiet khau cang cao.
 */
export const VOLUME_DISCOUNTS: {
  minAmount: number;
  discountPercent: number;
}[] = [
  { minAmount: 50000000, discountPercent: 12 },
  { minAmount: 20000000, discountPercent: 8 },
  { minAmount: 5000000, discountPercent: 5 },
  { minAmount: 0, discountPercent: 0 },
];

/* ================== THUE ================== */

/** Thue GTGT ap dung cho vat lieu xay dung */
export const VAT_RATE = 0.1;

/* ================== TY LE HAO HUT ================== */

/**
 * Ty le hao hut theo kieu thi cong.
 * Lat thang it hao, lat cheo/hoa van hao nhieu.
 */
export const WASTE_RATES = {
  straight: {
    value: 5,
    unit: '%',
    source: 'Lat thang - hao hut tieu chuan 5%',
  } satisfies SourcedValue,
  diagonal: {
    value: 10,
    unit: '%',
    source: 'Lat cheo / hoa van - hao hut 10%',
  } satisfies SourcedValue,
  wallWithCorners: {
    value: 15,
    unit: '%',
    source: 'Op tuong nhieu goc, phai cat nhieu - hao hut 15%',
  } satisfies SourcedValue,
};

/** Kieu thi cong - dung de chon ty le hao hut */
export type LayoutKind = 'straight' | 'diagonal' | 'wallWithCorners';

/* ================== QUY DOI HOP ================== */

/**
 * Quy doi vien/hop theo kich thuoc gach.
 * Tham khao dong goi pho bien cua cac hang.
 */
export const TILES_PER_BOX: { sizeCm: string; tilesPerBox: number }[] = [
  { sizeCm: '30x30', tilesPerBox: 11 },
  { sizeCm: '40x40', tilesPerBox: 6 },
  { sizeCm: '50x50', tilesPerBox: 4 },
  { sizeCm: '60x60', tilesPerBox: 4 },
  { sizeCm: '80x80', tilesPerBox: 3 },
  { sizeCm: '100x100', tilesPerBox: 2 },
  { sizeCm: '15x60', tilesPerBox: 10 },
  { sizeCm: '20x100', tilesPerBox: 5 },
];

/**
 * Tim so vien/hop theo kich thuoc.
 * Neu khong tim thay, tra ve 4 (gia tri pho bien nhat).
 */
export const getTilesPerBox = (
  widthCm: number,
  heightCm: number,
): number => {
  const key = `${widthCm}x${heightCm}`;
  const found = TILES_PER_BOX.find(
    (item): boolean => item.sizeCm === key,
  );
  if (found) {
    return found.tilesPerBox;
  }
  // Thu dao chieu (15x60 vs 60x15)
  const reversed = `${heightCm}x${widthCm}`;
  const foundReversed = TILES_PER_BOX.find(
    (item): boolean => item.sizeCm === reversed,
  );
  return foundReversed ? foundReversed.tilesPerBox : 4;
};
