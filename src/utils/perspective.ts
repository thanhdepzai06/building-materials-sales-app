/**
 * src/utils/perspective.ts
 * Toan hoc cho Virtual Visualizer: tinh ma tran bien doi phoi canh
 * tu 4 diem neo (perspective transform / homography).
 *
 * Y tuong: nguoi dung keo 4 diem neo vao 4 goc cua mang tuong/san trong anh.
 * Ta can bien doi mot hinh chu nhat (texture vat lieu) sao cho 4 goc cua no
 * roi dung vao 4 diem neo do -> texture "nam" dung mat phang phoi canh.
 *
 * Cach bieu dien: trong React Native, transform cua View chi ho tro
 * ma tran 2D affine (3x3 voi hang cuoi [0,0,1]) qua thuoc tinh `matrix`.
 * Vi khong co 3D that, ta chia texture thanh NHIEU O NHO (grid) va bien doi
 * tung o theo noi suy song tuyen tinh (bilinear interpolation). Cach nay
 * cho ket qua phoi canh tot voi chi phi tinh toan thap.
 *
 * Tat ca ham o day la ham thuan (pure) -> de unit test.
 */
import type { ImageCorners, Point } from '../types';

/**
 * Noi suy song tuyen tinh: tim diem P nam trong tu giac ABCD
 * ung voi toa do chuan hoa (u, v) trong khoang [0, 1].
 *
 *   u = 0 -> canh trai (AB),  u = 1 -> canh phai (DC)
 *   v = 0 -> canh tren (AD),  v = 1 -> canh duoi (BC)
 *
 * @param corners 4 diem neo cua tu giac
 * @param u Toa do ngang chuan hoa [0, 1]
 * @param v Toa do doc chuan hoa [0, 1]
 */
export const bilinearInterpolate = (
  corners: ImageCorners,
  u: number,
  v: number,
): Point => {
  const { topLeft, topRight, bottomRight, bottomLeft } = corners;

  // Noi suy theo chieu ngang truoc (tren va duoi)
  const topX = topLeft.x + (topRight.x - topLeft.x) * u;
  const topY = topLeft.y + (topRight.y - topLeft.y) * u;
  const bottomX = bottomLeft.x + (bottomRight.x - bottomLeft.x) * u;
  const bottomY = bottomLeft.y + (bottomRight.y - bottomLeft.y) * u;

  // Roi noi suy theo chieu doc
  return {
    x: topX + (bottomX - topX) * v,
    y: topY + (bottomY - topY) * v,
  };
};

/** Khoang cach giua 2 diem */
export const distance = (a: Point, b: Point): number =>
  Math.hypot(b.x - a.x, b.y - a.y);

/**
 * Uoc luong dien tich be mat (don vi: pixel^2) cua tu giac 4 diem.
 * Dung cong thuc Shoelace (Gauss) - chinh xac cho da giac bat ky.
 */
export const polygonArea = (corners: ImageCorners): number => {
  const pts: Point[] = [
    corners.topLeft,
    corners.topRight,
    corners.bottomRight,
    corners.bottomLeft,
  ];

  let sum = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const current = pts[i];
    const next = pts[(i + 1) % pts.length];
    sum += current.x * next.y - next.x * current.y;
  }
  return Math.abs(sum) / 2;
};

/**
 * Do lech chuan hoa cua tu giac so voi hinh chu nhat.
 * Tra ve 0 neu la hinh chu nhat hoan hao, cang lon cang "meo".
 * Dung de canh bao nguoi dung khi keo diem neo qua le.
 */
export const perspectiveSkew = (corners: ImageCorners): number => {
  const top = distance(corners.topLeft, corners.topRight);
  const bottom = distance(corners.bottomLeft, corners.bottomRight);
  const left = distance(corners.topLeft, corners.bottomLeft);
  const right = distance(corners.topRight, corners.bottomRight);

  if (top === 0 || bottom === 0 || left === 0 || right === 0) {
    return 1;
  }

  const horizontalRatio = Math.max(top, bottom) / Math.min(top, bottom);
  const verticalRatio = Math.max(left, right) / Math.min(left, right);

  // 1.0 = vuong ven, > 1.5 = meo nhieu
  return Math.max(horizontalRatio, verticalRatio);
};

/**
 * Kiem tra 4 diem co tao thanh tu giac loi (khong tu cat) hay khong.
 * Dung tich co huong cua cac canh lien tiep.
 */
export const isValidQuad = (corners: ImageCorners): boolean => {
  const pts: Point[] = [
    corners.topLeft,
    corners.topRight,
    corners.bottomRight,
    corners.bottomLeft,
  ];

  let sign = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const c = pts[(i + 2) % pts.length];

    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (cross === 0) {
      continue;
    }
    const currentSign = cross > 0 ? 1 : -1;
    if (sign === 0) {
      sign = currentSign;
    } else if (sign !== currentSign) {
      return false;
    }
  }
  return true;
};

/**
 * Tinh ma tran affine (2x3) bien doi mot hinh chu nhat don vi
 * thanh mot o nho trong tu giac phoi canh.
 *
 * Tra ve 6 gia tri theo thu tu cua React Native `transform: [{ matrix }]`:
 *   [a, b, c, d, tx, ty]
 * Tuong ung phep bien doi:
 *   x' = a*x + c*y + tx
 *   y' = b*x + d*y + ty
 *
 * @param corners 4 diem neo
 * @param u0,v0 Toa do chuan hoa goc tren-trai cua o
 * @param u1,v1 Toa do chuan hoa goc duoi-phai cua o
 */
export const tileMatrix = (
  corners: ImageCorners,
  u0: number,
  v0: number,
  u1: number,
  v1: number,
): number[] => {
  // 4 goc cua o trong khong gian texture (don vi chuan hoa 0..1)
  const origin = bilinearInterpolate(corners, u0, v0);
  const right = bilinearInterpolate(corners, u1, v0);
  const down = bilinearInterpolate(corners, u0, v1);

  // Vector canh cua o trong khong gian anh
  const edgeU: Point = { x: right.x - origin.x, y: right.y - origin.y };
  const edgeV: Point = { x: down.x - origin.x, y: down.y - origin.y };

  return [
    edgeU.x, // a
    edgeU.y, // b
    edgeV.x, // c
    edgeV.y, // d
    origin.x, // tx
    origin.y, // ty
  ];
};

/**
 * Tao 4 diem neo mac dinh: hinh chu nhat o giua anh,
 * chiem 80% chieu rong va 70% chieu cao.
 * Dung lam gia tri khoi tao cho man keo diem neo.
 */
export const defaultCorners = (
  width: number,
  height: number,
): ImageCorners => {
  const marginX = width * 0.1;
  const marginY = height * 0.15;

  return {
    topLeft: { x: marginX, y: marginY },
    topRight: { x: width - marginX, y: marginY },
    bottomRight: { x: width - marginX, y: height - marginY },
    bottomLeft: { x: marginX, y: height - marginY },
  };
};

/**
 * Gioi han 1 diem nam trong bien anh.
 */
export const clampPoint = (
  point: Point,
  width: number,
  height: number,
): Point => ({
  x: Math.min(Math.max(point.x, 0), width),
  y: Math.min(Math.max(point.y, 0), height),
});

/**
 * Uoc luong dien tich thuc te (m2) cua be mat.
 *
 * Can mot "vật chuẩn" de quy doi: gia dinh nguoi dung chup mot be mat
 * co chieu cao thuc te khoang 2.8m (chieu cao tuong nha o Viet Nam).
 * Tu do suy ra ty le pixel -> met.
 *
 * @param corners 4 diem neo (pixel)
 * @param assumedRealHeight Chieu cao thuc te gia dinh cua be mat (m)
 */
export const estimateRealArea = (
  corners: ImageCorners,
  assumedRealHeight = 2.8,
): number => {
  const pixelHeight =
    (distance(corners.topLeft, corners.bottomLeft) +
      distance(corners.topRight, corners.bottomRight)) /
    2;

  if (pixelHeight <= 0) {
    return 0;
  }

  const metersPerPixel = assumedRealHeight / pixelHeight;
  const pixelArea = polygonArea(corners);

  return pixelArea * metersPerPixel * metersPerPixel;
};
