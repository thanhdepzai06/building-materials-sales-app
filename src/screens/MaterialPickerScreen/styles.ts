/**
 * src/screens/MaterialPickerScreen/styles.ts
 * Style man chon vat lieu de ap len be mat.
 */
import { StyleSheet } from 'react-native';
import { COLORS } from '../HomeScreen/styles';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  /* ---------- Header ---------- */
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerStep: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  /* ---------- Xem truoc vung da chon ---------- */
  previewWrap: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1.4,
    backgroundColor: '#333333',
  },
  previewCaption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  /* ---------- Chip loc be mat ---------- */
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* ---------- Luoi vat lieu ---------- */
  gridContent: {
    paddingHorizontal: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  materialCard: {
    flex: 1,
    maxWidth: '48.5%',
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  materialCardActive: {
    borderColor: COLORS.accent,
  },
  materialImage: {
    width: '100%',
    aspectRatio: 1.15,
    backgroundColor: '#333333',
  },
  /** O mau mo phong texture vat lieu (thay cho anh texture that) */
  swatchFill: {
    width: '100%',
    aspectRatio: 1.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchGridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  materialBody: {
    padding: 9,
  },
  materialName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minHeight: 32,
  },
  materialMeta: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  materialPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 4,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---------- Thanh duoi ---------- */
  bottomBar: {
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
  selectedInfo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  selectedName: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  nextButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  nextButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 6,
  },
  nextButtonTextDisabled: {
    color: COLORS.inactive,
  },
});

export default styles;
