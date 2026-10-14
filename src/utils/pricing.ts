/**
 * src/utils/pricing.ts
 * THUAT TOAN BAO GIA TRON GOI CONG TRINH.
 *
 * Day la phan "Lap trinh nang cao" cua do an: thuật toan tinh gia nhieu buoc,
 * co xu ly he so, chiet khau bac thang, va tra ve ket qua co cau truc ro rang
 * de UI hien thi thanh bang chi tiet.
 *
 * Toan bo ham o day la PURE FUNCTION (khong side effect, khong phu thuoc React)
 * -> co the viet unit test truc tiep.
 *
 * Cong thuc tong quat:
 *   TONG = VatTuChinh + VatTuPhu + NhanCong + VanChuyen + PhuPhiTang
 *          - ChietKhau + VAT
 */
import {
  AUXILIARY_SPECS,
  BASE_PRICE_PER_M2,
  BRAND_FACTORS,
  DEFAULT_BRAND_FACTOR,
  FINISH_FACTORS,
  FLOOR_SURCHARGE_PER_M2,
  FREE_SHIPPING_RADIUS_KM,
  LABOR_LARGE_TILE_SURCHARGE,
  LABOR_MOSAIC_SURCHARGE_PERCENT,
  LABOR_RATES,
  MAX_SHIPPING_FEE,
  ORIGIN_FACTORS,
  SHIPPING_RATE_PER_KM,
  SIZE_FACTORS,
  VAT_RATE,
  VOLUME_DISCOUNTS,
  WASTE_RATES,
  getTilesPerBox,
} from '../data/pricingConfig';
import type {
  BrandKind,
  FinishKind,
  LayoutKind,
  MaterialKind,
  OriginKind,
  SurfaceKind,
} from '../data/pricingConfig';
import type { Product } from '../types';

/* ================== INPUT / OUTPUT ================== */

/** Du lieu dau vao de tinh bao gia */
export interface QuoteInput {
  /** Dien tich thi cong (m2) */
  area: number;
  /** Vat lieu duoc chon */
  product: Product;
  /** Loai be mat: lat san hay op tuong */
  surface: SurfaceKind;
  /** Kieu thi cong - quyet dinh ty le hao hut */
  layout: LayoutKind;
  /** Tang thi cong (1, 2, 3...) */
  floor: number;
  /** Khoang cach van chuyen (km) */
  distanceKm: number;
  /** Co lam chong tham khong (san WC, ban cong...) */
  needWaterproofing: boolean;
  /** Co lam len chan tuong khong */
  needSkirting: boolean;
  /** Chieu dai len chan tuong (m) - chi dung khi needSkirting = true */
  skirtingLengthM: number;
}

/** Mot dong trong bang bao gia */
export interface QuoteLine {
  /** Nhan hien thi */
  label: string;
  /** Mo ta ngan (dinh muc, don gia) */
  detail: string;
  /** Thanh tien (VND, da lam tron) */
  amount: number;
}

/** Ket qua bao gia day du */
export interface QuoteResult {
  /** Cac dong chi tiet (vat tu, nhan cong, van chuyen...) */
  lines: QuoteLine[];

  /* Cac con so trung gian - de hien thi va kiem chung */
  /** Ty le hao hut da ap dung (%) */
  wastePercent: number;
  /** Dien tich da cong hao hut (m2) */
  areaWithWaste: number;
  /** So luong gach can mua (vien) */
  tilesNeeded: number;
  /** So hop gach can mua */
  boxesNeeded: number;
  /** So vien moi hop */
  tilesPerBox: number;
  /** Dien tich thuc te mua (m2) - lam tron theo hop */
  areaPurchased: number;

  /* Tong ket */
  /** Tong truoc thue va truoc chiet khau */
  subtotal: number;
  /** So tien duoc chiet khau */
  discountAmount: number;
  /** Phan tram chiet khau */
  discountPercent: number;
  /** Tien thue GTGT */
  vatAmount: number;
  /** TONG CONG PHAI TRA */
  grandTotal: number;

  /** Co phai vat lieu dang vien (gach) hay khong */
  isTile: boolean;
}

/* ================== HAM XAC DINH LOAI VAT LIEU ================== */

/**
 * Doan loai vat lieu tu ten + thuong hieu san pham.
 * Dung vi interface Product hien chua co truong `material` rieng.
 */
export const inferMaterialKind = (product: Product): MaterialKind => {
  const name = product.name.toLowerCase();

  if (name.includes('mosaic')) {
    return 'mosaic';
  }
  if (name.includes('giả gỗ') || name.includes('gỗ')) {
    return 'wood-look';
  }
  if (name.includes('porcelain') || name.includes('xuong dai')) {
    return 'porcelain';
  }
  if (name.includes('granite')) {
    return 'granite';
  }
  return 'ceramic';
};

/**
 * Doan be mat hoan thien tu ten san pham.
 */
export const inferFinishKind = (product: Product): FinishKind => {
  const name = product.name.toLowerCase();

  if (name.includes('nhám') || name.includes('chống trơn')) {
    return 'nham';
  }
  if (name.includes('mờ') || name.includes('matte')) {
    return 'mo';
  }
  return 'bong';
};

/**
 * Doan xuong goc tu truong origin cua san pham.
 * LUU Y: phai kiem tra ten dai truoc ten ngan, neu khong se khop sai.
 */
export const inferOriginKind = (product: Product): OriginKind => {
  const origin = product.origin.toLowerCase().trim();

  // Kiem tra ten dai truoc (tranh 'y' khop voi 'Na Uy', 'Tho Nhi Ky'...)
  if (origin.includes('tây ban nha')) {
    return 'tay-ban-nha';
  }
  if (origin.includes('ấn độ')) {
    return 'an-do';
  }
  if (origin.includes('trung quốc')) {
    return 'trung-quoc';
  }
  if (origin.includes('việt nam')) {
    return 'viet-nam';
  }
  // Chi khop khi origin dung CHINH XAC la 'y' hoac 'italia'
  if (origin === 'ý' || origin === 'y' || origin === 'italia') {
    return 'y';
  }
  return 'viet-nam';
};

/**
 * Kiem tra san pham co phai vat lieu dang vien (gach, da) hay khong.
 * Son, xi mang, keo dan KHONG phai dang vien -> cach tinh gia khac.
 */
export const isTileProduct = (product: Product): boolean =>
  product.tileWidth > 0 && product.tileHeight > 0;

/* ================== TINH GIA VAT LIEU ================== */

/**
 * Tinh he so kich thuoc dua tren canh dai nhat cua vien gach.
 */
export const getSizeFactor = (product: Product): number => {
  const maxCm = Math.max(product.tileWidth, product.tileHeight);
  if (maxCm <= 0) {
    // Khong phai vat lieu dang vien (son, xi mang...) -> he so chuan
    return 1.0;
  }
  const matched = SIZE_FACTORS.find(
    (item): boolean => maxCm <= item.maxCm,
  );
  return matched ? matched.factor : 1.0;
};

/**
 * Tinh DON GIA de xuat (VND/m2 hoac VND/don vi) theo cong thuc he so.
 *
 *   DonGia = GiaGoc x HeSo_KichThuoc x HeSo_BeMat x HeSo_XuatXu x HeSo_ThuongHieu
 *
 * Tra ve 2 gia tri:
 *   - suggested: gia tinh theo cong thuc (co the dung de kiem chung)
 *   - actual: gia thuc te dang ban trong mockData (uu tien dung gia nay)
 */
export const calcSuggestedPrice = (
  product: Product,
): { suggested: number; actual: number } => {
  const material = inferMaterialKind(product);
  const finish = inferFinishKind(product);
  const origin = inferOriginKind(product);

  const basePrice = BASE_PRICE_PER_M2[material].value;
  const sizeFactor = getSizeFactor(product);
  const finishFactor = FINISH_FACTORS[finish].value;
  const originFactor = ORIGIN_FACTORS[origin].value;
  const brandFactor =
    BRAND_FACTORS[product.brand as BrandKind]?.value ?? DEFAULT_BRAND_FACTOR;

  const suggested = Math.round(
    basePrice * sizeFactor * finishFactor * originFactor * brandFactor,
  );

  return { suggested, actual: product.price };
};

/* ================== TINH NHAN CONG ================== */

/**
 * Tinh don gia nhan cong (VND/m2) theo be mat, kich thuoc, loai gach.
 */
export const calcLaborRate = (
  product: Product,
  surface: SurfaceKind,
): number => {
  let rate = LABOR_RATES[surface].value;

  const material = inferMaterialKind(product);
  const maxCm = Math.max(product.tileWidth, product.tileHeight);

  // Phu thu gach kho lon
  const largeTileRule = LABOR_LARGE_TILE_SURCHARGE.find(
    (item): boolean => maxCm >= item.minCm,
  );
  if (largeTileRule) {
    rate *= 1 + largeTileRule.surchargePercent / 100;
  }

  // Phu thu mosaic (thi cong thu cong)
  if (material === 'mosaic') {
    rate *= 1 + LABOR_MOSAIC_SURCHARGE_PERCENT / 100;
  }

  return Math.round(rate);
};

/* ================== TINH VAN CHUYEN ================== */

/**
 * Tinh phi van chuyen theo khoang cach.
 */
export const calcShippingFee = (distanceKm: number): number => {
  if (distanceKm <= FREE_SHIPPING_RADIUS_KM) {
    return 0;
  }
  const chargeableKm = distanceKm - FREE_SHIPPING_RADIUS_KM;
  const fee = chargeableKm * SHIPPING_RATE_PER_KM.value;
  return Math.min(Math.round(fee), MAX_SHIPPING_FEE);
};

/* ================== TINH PHU PHI TANG ================== */

/**
 * Tinh phu phi vac vat lieu len tang (VND).
 * Tang 1 = 0, tang 2 = 5.000/m2, tang 3+ = 10.000/m2
 */
export const calcFloorSurcharge = (area: number, floor: number): number => {
  if (floor <= 1) {
    return 0;
  }
  const index = Math.min(floor - 1, FLOOR_SURCHARGE_PER_M2.length - 1);
  return Math.round(area * FLOOR_SURCHARGE_PER_M2[index].value);
};

/* ================== TINH CHIET KHAU ================== */

/**
 * Tinh chiet khau theo gia tri don hang (bac thang).
 */
export const calcDiscount = (
  amount: number,
): { percent: number; amount: number } => {
  const rule = VOLUME_DISCOUNTS.find(
    (item): boolean => amount >= item.minAmount,
  );
  const percent = rule ? rule.discountPercent : 0;
  return { percent, amount: Math.round((amount * percent) / 100) };
};

/* ================== HAM CHINH: TINH BAO GIA ================== */

/**
 * Tinh bao gia tron goi cong trinh.
 *
 * @param input Du lieu dau vao
 * @returns Ket qua bao gia day du, kem bang chi tiet
 */
export const calculateQuote = (input: QuoteInput): QuoteResult => {
  const {
    area,
    product,
    surface,
    layout,
    floor,
    distanceKm,
    needWaterproofing,
    needSkirting,
    skirtingLengthM,
  } = input;

  const safeArea = Math.max(0, area);
  const material = inferMaterialKind(product);
  const isTile = product.tileWidth > 0 && product.tileHeight > 0;

  /* ---- 1. Hao hut ---- */
  const wastePercent = WASTE_RATES[layout].value;
  const areaWithWaste = safeArea * (1 + wastePercent / 100);

  /* ---- 2. Quy doi so luong ---- */
  let tilesNeeded = 0;
  let boxesNeeded = 0;
  let tilesPerBox = 0;
  let areaPurchased = areaWithWaste;

  if (isTile) {
    const tileAreaM2 =
      (product.tileWidth / 100) * (product.tileHeight / 100);
    tilesNeeded = Math.ceil(areaWithWaste / tileAreaM2);

    tilesPerBox = getTilesPerBox(product.tileWidth, product.tileHeight);
    boxesNeeded = Math.ceil(tilesNeeded / tilesPerBox);

    // Dien tich thuc te phai mua (lam tron theo hop)
    areaPurchased = boxesNeeded * tilesPerBox * tileAreaM2;
  } else {
    // Vat lieu khong phai dang vien (son, xi mang): lam tron len
    tilesNeeded = Math.ceil(areaWithWaste);
    areaPurchased = tilesNeeded;
  }

  /* ---- 3. Bang chi tiet ---- */
  const lines: QuoteLine[] = [];

  // 3.1. Vat tu chinh
  const mainAmount = Math.round(areaPurchased * product.price);
  lines.push({
    label: 'Vật tư chính',
    detail: isTile
      ? `${boxesNeeded} hộp (${tilesNeeded} viên) × ${Math.round(areaPurchased * 10) / 10} m²`
      : `${tilesNeeded} ${product.unit} × ${product.price.toLocaleString('vi-VN')}đ`,
    amount: mainAmount,
  });

  // 3.2. Keo dan gach (chi voi vat lieu dang vien)
  if (isTile) {
    const adhesiveKg =
      Math.round(areaWithWaste * AUXILIARY_SPECS.adhesive.value * 10) / 10;
    const adhesiveAmount = Math.round(
      adhesiveKg * AUXILIARY_SPECS.adhesivePrice.value,
    );
    lines.push({
      label: 'Keo dán gạch',
      detail: `${adhesiveKg} kg × ${AUXILIARY_SPECS.adhesivePrice.value.toLocaleString('vi-VN')}đ/kg`,
      amount: adhesiveAmount,
    });

    // 3.3. Mach vua (grout)
    const groutKg =
      Math.round(areaWithWaste * AUXILIARY_SPECS.grout.value * 10) / 10;
    const groutAmount = Math.round(
      groutKg * AUXILIARY_SPECS.groutPrice.value,
    );
    lines.push({
      label: 'Mạch vữa (grout)',
      detail: `${groutKg} kg × ${AUXILIARY_SPECS.groutPrice.value.toLocaleString('vi-VN')}đ/kg`,
      amount: groutAmount,
    });
  }

  // 3.4. Chong tham (tuy chon)
  if (needWaterproofing) {
    const wpKg =
      Math.round(safeArea * AUXILIARY_SPECS.waterproofing.value * 10) / 10;
    const wpAmount = Math.round(
      wpKg * AUXILIARY_SPECS.waterproofingPrice.value,
    );
    lines.push({
      label: 'Chống thấm',
      detail: `${wpKg} kg × ${AUXILIARY_SPECS.waterproofingPrice.value.toLocaleString('vi-VN')}đ/kg`,
      amount: wpAmount,
    });
  }

  // 3.5. Len chan tuong (tuy chon) - tinh theo met dai
  if (needSkirting && skirtingLengthM > 0 && isTile) {
    const skirtingHeightM = 0.1; // 10cm
    const skirtingArea = skirtingLengthM * skirtingHeightM;
    const skirtingTiles = Math.ceil(
      skirtingArea / ((product.tileWidth / 100) * (product.tileHeight / 100)),
    );
    const skirtingAmount = Math.round(skirtingTiles * product.price);
    lines.push({
      label: 'Len chân tường',
      detail: `${skirtingLengthM} m dài (≈${skirtingTiles} viên)`,
      amount: skirtingAmount,
    });
  }

  // 3.6. Nhan cong
  const laborRate = calcLaborRate(product, surface);
  const laborAmount = Math.round(safeArea * laborRate);
  lines.push({
    label: 'Nhân công thi công',
    detail: `${safeArea} m² × ${laborRate.toLocaleString('vi-VN')}đ/m²`,
    amount: laborAmount,
  });

  // 3.7. Van chuyen
  const shippingFee = calcShippingFee(distanceKm);
  lines.push({
    label: 'Vận chuyển',
    detail:
      shippingFee === 0
        ? `Miễn phí (trong ${FREE_SHIPPING_RADIUS_KM} km)`
        : `${distanceKm} km`,
    amount: shippingFee,
  });

  // 3.8. Phu phi tang
  const floorSurcharge = calcFloorSurcharge(safeArea, floor);
  if (floorSurcharge > 0) {
    lines.push({
      label: `Phụ phí vác lên tầng ${floor}`,
      detail: `${safeArea} m² × ${FLOOR_SURCHARGE_PER_M2[Math.min(floor - 1, FLOOR_SURCHARGE_PER_M2.length - 1)].value.toLocaleString('vi-VN')}đ/m²`,
      amount: floorSurcharge,
    });
  }

  /* ---- 4. Tong ket ---- */
  const subtotal = lines.reduce(
    (sum: number, line: QuoteLine): number => sum + line.amount,
    0,
  );

  const discount = calcDiscount(subtotal);
  const afterDiscount = subtotal - discount.amount;
  const vatAmount = Math.round(afterDiscount * VAT_RATE);
  const grandTotal = afterDiscount + vatAmount;

  /* ---- 5. Them dong chiet khau va VAT vao bang ---- */
  if (discount.amount > 0) {
    lines.push({
      label: `Chiết khấu (${discount.percent}%)`,
      detail: 'Giảm theo giá trị đơn hàng',
      amount: -discount.amount,
    });
  }

  lines.push({
    label: `Thuế GTGT (${Math.round(VAT_RATE * 100)}%)`,
    detail: 'Vật liệu xây dựng chịu thuế 10%',
    amount: vatAmount,
  });

  return {
    lines,
    wastePercent,
    areaWithWaste: Math.round(areaWithWaste * 100) / 100,
    tilesNeeded,
    boxesNeeded,
    tilesPerBox,
    areaPurchased: Math.round(areaPurchased * 100) / 100,
    subtotal,
    discountAmount: discount.amount,
    discountPercent: discount.percent,
    vatAmount,
    grandTotal,
    isTile,
  };
};

/* ================== TIEN ICH BO SUNG ================== */

/**
 * Uoc luong nhanh chi phi vat tu (khong can day du thong tin).
 * Dung cho man Catalog khi muon hien gia tham khao.
 */
export const quickEstimate = (
  area: number,
  product: Product,
  wastePercent = 5,
): number => {
  const areaWithWaste = Math.max(0, area) * (1 + wastePercent / 100);
  return Math.round(areaWithWaste * product.price);
};

/**
 * So sanh gia dang ban voi gia de xuat theo cong thuc.
 * Tra ve % lech: duong = dang ban cao hon de xuat.
 */
export const priceDeviationPercent = (product: Product): number => {
  const { suggested, actual } = calcSuggestedPrice(product);
  if (suggested === 0) {
    return 0;
  }
  return Math.round(((actual - suggested) / suggested) * 1000) / 10;
};
