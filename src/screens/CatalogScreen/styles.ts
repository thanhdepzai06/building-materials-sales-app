/**
 * src/screens/CatalogScreen/styles.ts
 * Style cua man Catalog - dong bo theme dark voi HomeScreen.
 */
import { StyleSheet } from 'react-native';
import { COLORS } from '../HomeScreen/styles';

/** Kich thuoc the san pham trong luoi 2 cot */
export const CARD_GAP = 12;
export const CARD_RADIUS = 12;

const styles = StyleSheet.create({
  /* ---------- Screen ---------- */
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 12,
  },

  /* ---------- Header ---------- */
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  /* ---------- Search ---------- */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  clearButton: {
    padding: 4,
  },

  /* ---------- Category chips ---------- */
  chipRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: COLORS.accent,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },

  /* ---------- Grid ---------- */
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  card: {
    flex: 1,
    maxWidth: '48.5%',
    borderRadius: CARD_RADIUS,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cardImage: {
    width: '100%',
    aspectRatio: 0.85,
    backgroundColor: '#333333',
  },
  cardBody: {
    padding: 10,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minHeight: 34,
  },
  cardBrand: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 6,
  },
  cardUnit: {
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },

  /* ---------- Badge ton kho ---------- */
  badgeOutOfStock: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(231,76,60,0.92)',
  },
  badgeOutOfStockText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  badgeCount: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  badgeCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default styles;
