/**
 * scripts/test-pricing.ts
 * Script kiem chung thuat toan tinh gia bang du lieu that.
 * Chay: npx tsx scripts/test-pricing.ts  (hoac bien dich roi chay node)
 *
 * Muc dich: in ra ket qua tinh gia cho vai tinh huong thuc te
 * de doi chieu bang tay truoc khi dua vao bao cao do an.
 */
import { TRENDING_PRODUCTS } from '../src/data/mockData';
import { calculateQuote, calcSuggestedPrice, priceDeviationPercent } from '../src/utils/pricing';
import type { Product } from '../src/types';

const findProduct = (id: string): Product => {
  const p = TRENDING_PRODUCTS.find((item: Product): boolean => item.id === id);
  if (!p) {
    throw new Error(`Khong tim thay san pham ${id}`);
  }
  return p;
};

const line = (): void => console.log('-'.repeat(70));

/* ===== TEST 1: Bang gia de xuat vs gia dang ban ===== */
console.log('\n=== TEST 1: DOI CHIEU GIA DE XUAT THEO CONG THUC ===\n');
TRENDING_PRODUCTS.forEach((p: Product): void => {
  const { suggested, actual } = calcSuggestedPrice(p);
  const dev = priceDeviationPercent(p);
  const sign = dev > 0 ? '+' : '';
  console.log(
    `${p.name.slice(0, 42).padEnd(44)} ban: ${String(actual).padStart(8)}  de xuat: ${String(suggested).padStart(8)}  lech: ${sign}${dev}%`,
  );
});

/* ===== TEST 2: Bao gia tron goi - lat san phong khach ===== */
line();
console.log('\n=== TEST 2: LAT SAN PHONG KHACH 25m2, GACH GRANITE 80x80 ===\n');

const granite = findProduct('prd-02');
const q1 = calculateQuote({
  area: 25,
  product: granite,
  surface: 'floor',
  layout: 'straight',
  floor: 1,
  distanceKm: 3,
  needWaterproofing: false,
  needSkirting: false,
  skirtingLengthM: 0,
});

console.log(`Vat lieu: ${granite.name}`);
console.log(`Hao hut: ${q1.wastePercent}%  |  Dien tich sau hao hut: ${q1.areaWithWaste} m2`);
console.log(`Can mua: ${q1.tilesNeeded} vien = ${q1.boxesNeeded} hop (${q1.tilesPerBox} vien/hop)`);
console.log(`Dien tich thuc mua: ${q1.areaPurchased} m2\n`);
console.log('BANG CHI TIET:');
q1.lines.forEach((l): void => {
  console.log(`  ${l.label.padEnd(24)} ${l.detail.padEnd(34)} ${l.amount.toLocaleString('vi-VN').padStart(12)}d`);
});
line();
console.log(`  ${'TAM TINH'.padEnd(24)} ${''.padEnd(34)} ${q1.subtotal.toLocaleString('vi-VN').padStart(12)}d`);
console.log(`  ${'Chiet khau'.padEnd(24)} ${(q1.discountPercent + '%').padEnd(34)} ${('-' + q1.discountAmount.toLocaleString('vi-VN')).padStart(12)}d`);
console.log(`  ${'VAT'.padEnd(24)} ${'10%'.padEnd(34)} ${q1.vatAmount.toLocaleString('vi-VN').padStart(12)}d`);
console.log(`  ${'TONG CONG'.padEnd(24)} ${''.padEnd(34)} ${q1.grandTotal.toLocaleString('vi-VN').padStart(12)}d`);

/* ===== TEST 3: Op tuong nha ve sinh, co chong tham ===== */
line();
console.log('\n=== TEST 3: OP TUONG WC 12m2, GACH MOSAIC, CO CHONG THAM ===\n');

const mosaic = findProduct('prd-08');
const q2 = calculateQuote({
  area: 12,
  product: mosaic,
  surface: 'wall',
  layout: 'wallWithCorners',
  floor: 2,
  distanceKm: 12,
  needWaterproofing: true,
  needSkirting: false,
  skirtingLengthM: 0,
});

console.log(`Vat lieu: ${mosaic.name}`);
console.log(`Hao hut: ${q2.wastePercent}%  |  Can mua: ${q2.tilesNeeded} vien = ${q2.boxesNeeded} hop`);
console.log(`Nhan cong (mosaic + tuong): cao hon binh thuong\n`);
q2.lines.forEach((l): void => {
  console.log(`  ${l.label.padEnd(26)} ${l.detail.padEnd(32)} ${l.amount.toLocaleString('vi-VN').padStart(12)}d`);
});
line();
console.log(`  TONG CONG: ${q2.grandTotal.toLocaleString('vi-VN')}d`);

/* ===== TEST 4: Don lon - kiem tra chiet khau bac thang ===== */
line();
console.log('\n=== TEST 4: DON LON 300m2 - KIEM TRA CHIET KHAU BAC THANG ===\n');

const ceramic = findProduct('prd-01');
const q3 = calculateQuote({
  area: 300,
  product: ceramic,
  surface: 'floor',
  layout: 'diagonal',
  floor: 1,
  distanceKm: 8,
  needWaterproofing: false,
  needSkirting: true,
  skirtingLengthM: 60,
});

console.log(`Dien tich: 300 m2, lat cheo (hao hut ${q3.wastePercent}%)`);
console.log(`Chiet khau ap dung: ${q3.discountPercent}%  =  ${q3.discountAmount.toLocaleString('vi-VN')}d`);
console.log(`TAM TINH: ${q3.subtotal.toLocaleString('vi-VN')}d`);
console.log(`TONG CONG: ${q3.grandTotal.toLocaleString('vi-VN')}d`);
console.log(`\nDon gia trung binh: ${Math.round(q3.grandTotal / 300).toLocaleString('vi-VN')}d/m2`);

/* ===== TEST 5: So sanh hao hut ===== */
line();
console.log('\n=== TEST 5: ANH HUONG CUA KIEU THI CONG (25m2 granite) ===\n');
(['straight', 'diagonal', 'wallWithCorners'] as const).forEach((layout): void => {
  const q = calculateQuote({
    area: 25,
    product: granite,
    surface: 'floor',
    layout,
    floor: 1,
    distanceKm: 3,
    needWaterproofing: false,
    needSkirting: false,
    skirtingLengthM: 0,
  });
  console.log(
    `  ${layout.padEnd(18)} hao hut ${String(q.wastePercent).padStart(2)}%  ->  ${String(q.tilesNeeded).padStart(3)} vien (${q.boxesNeeded} hop)  ->  ${q.grandTotal.toLocaleString('vi-VN').padStart(12)}d`,
  );
});

line();
console.log('\n=== HOAN TAT KIEM CHUNG ===\n');
