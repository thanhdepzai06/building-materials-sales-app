/**
 * src/utils/format.ts
 * Cac ham tien ich dung chung: dinh dang tien te, dien tich, tinh vat tu.
 * Ham thuan (pure function) - de unit test, khong phu thuoc React.
 */
import type { Product } from '../types';

/**
 * Dinh dang tien VND: 285000 -> "285.000đ"
 * @param value So tien (VND)
 */
export const formatVnd = (value: number): string =>
  `${value.toLocaleString('vi-VN')}đ`;

/**
 * Dinh dang tien rut gon cho the nho: 1180000 -> "1,18 tr"
 * Dung o man Catalog khi khong du cho hien thi day du.
 */
export const formatVndShort = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace('.', ',')} tỷ`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2).replace('.', ',')} tr`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k`;
  }
  return `${value}đ`;
};

/**
 * Tinh dien tich hinh chu nhat (m2).
 * @param width Chieu rong (m)
 * @param height Chieu dai (m)
 */
export const calcArea = (width: number, height: number): number =>
  Math.max(0, width) * Math.max(0, height);

/**
 * Tinh so luong vat lieu can mua cho mot dien tich.
 * Tra ve so luong da lam tron len (khong the mua nua vien gach).
 *
 * @param area Dien tich can thi cong (m2)
 * @param product Vat lieu su dung
 * @param wastePercent Ty le hao hut (%) - mac dinh 5%
 */
export const calcMaterialQuantity = (
  area: number,
  product: Product,
  wastePercent = 5,
): number => {
  if (area <= 0) {
    return 0;
  }
  const areaWithWaste = area * (1 + wastePercent / 100);

  // Vat lieu dang vien (gach, da): quy doi tu cm2 sang m2
  if (product.tileWidth > 0 && product.tileHeight > 0) {
    const tileAreaM2 = (product.tileWidth / 100) * (product.tileHeight / 100);
    if (tileAreaM2 <= 0) {
      return 0;
    }
    return Math.ceil(areaWithWaste / tileAreaM2);
  }

  // Vat lieu tinh theo m2 (son, chong tham...)
  return Math.ceil(areaWithWaste);
};

/**
 * Tinh tong chi phi = so luong * don gia.
 */
export const calcTotalPrice = (quantity: number, unitPrice: number): number =>
  Math.max(0, quantity) * Math.max(0, unitPrice);
