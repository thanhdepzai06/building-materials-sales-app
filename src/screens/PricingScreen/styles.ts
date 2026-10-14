/**
 * src/screens/PricingScreen/styles.ts
 * Style man Bao gia tron goi cong trinh.
 */
import { StyleSheet } from 'react-native';
import { COLORS } from '../HomeScreen/styles';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* ---------- Header ---------- */
  header: {
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
    lineHeight: 19,
  },

  /* ---------- Buoc ---------- */
  stepCard: {
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    padding: 14,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(230,126,34,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  /* ---------- Nhap lieu ---------- */
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  /* ---------- Chon vat lieu ---------- */
  materialScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  materialChip: {
    width: 130,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 10,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  materialChipActive: {
    borderColor: COLORS.accent,
  },
  materialSwatch: {
    width: '100%',
    height: 40,
    borderRadius: 6,
    marginBottom: 8,
  },
  materialChipName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minHeight: 28,
  },
  materialChipPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 3,
  },

  /* ---------- Chip lua chon ---------- */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chipActive: {
    backgroundColor: COLORS.accent,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  /* ---------- Toggle ---------- */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  toggleLabel: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
  },
  toggleHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  toggleButton: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 3,
    justifyContent: 'center',
  },
  toggleButtonOn: {
    backgroundColor: COLORS.accent,
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },

  /* ---------- Bang bao gia ---------- */
  quoteCard: {
    marginTop: 20,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  quoteHeader: {
    backgroundColor: 'rgba(230,126,34,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230,126,34,0.3)',
  },
  quoteHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  quoteRowLast: {
    borderBottomWidth: 0,
  },
  quoteLeft: {
    flex: 1,
    paddingRight: 10,
  },
  quoteLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  quoteDetail: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  quoteAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  quoteAmountNegative: {
    color: '#2ECC71',
  },

  /* ---------- Tong cong ---------- */
  totalCard: {
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    padding: 16,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  totalUnitPrice: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
  },

  /* ---------- Canh bao ---------- */
  warningCard: {
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(243,156,18,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(243,156,18,0.35)',
    padding: 12,
    flexDirection: 'row',
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 8,
    lineHeight: 17,
  },

  /* ---------- Nut ---------- */
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  secondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  primaryButton: {
    flex: 1.5,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});

export default styles;
