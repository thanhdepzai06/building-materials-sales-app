/**
 * src/screens/QuoteScreen/styles.ts
 * Style man Gio hang & Bao gia - theme dark dong bo.
 */
import { StyleSheet } from 'react-native';
import { COLORS } from '../HomeScreen/styles';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 200,
  },

  /* ---------- Header ---------- */
  header: {
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(231,76,60,0.15)',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E74C3C',
  },

  /* ---------- Dong san pham ---------- */
  itemRow: {
    flexDirection: 'row',
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    padding: 10,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#333333',
  },
  itemBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  itemBrand: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 4,
  },

  /* ---------- Bo dem so luong ---------- */
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    minWidth: 52,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemSubtotal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },

  /* ---------- Trong ---------- */
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 14,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 13,
    color: COLORS.inactive,
    marginTop: 6,
    textAlign: 'center',
  },
  browseButton: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* ---------- Thanh tong ket duoi cung ---------- */
  summaryBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    backgroundColor: COLORS.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 6,
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  quoteButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  quoteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  /* ---------- Modal bao gia ---------- */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 14,
  },
  quoteText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textPrimary,
  },
  modalCloseButton: {
    marginTop: 18,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default styles;
