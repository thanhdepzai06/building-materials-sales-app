/**
 * src/screens/ResultScreen/styles.ts
 * Style man ket qua & du toan sau khi mo phong.
 */
import { StyleSheet } from 'react-native';
import { COLORS } from '../HomeScreen/styles';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 150,
  },

  /* ---------- Header ---------- */
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
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

  /* ---------- Anh ket qua ---------- */
  previewWrap: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 0.85,
  },
  previewBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
  },
  previewBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* ---------- The vat lieu ---------- */
  materialCard: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialSwatch: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginRight: 12,
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  materialMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  materialPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 4,
  },

  /* ---------- Bang du toan ---------- */
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 22,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  tableCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  tableValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  tableValueBig: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.accent,
  },

  /* ---------- Chon hao hut ---------- */
  wasteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
  },
  wasteLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  wasteButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  wasteChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  wasteChipActive: {
    backgroundColor: COLORS.accent,
  },
  wasteChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  wasteChipTextActive: {
    color: '#FFFFFF',
  },

  /* ---------- Ghi chu ---------- */
  noteCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(230,126,34,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(230,126,34,0.3)',
    padding: 12,
    flexDirection: 'row',
  },
  noteText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 8,
    lineHeight: 17,
  },

  /* ---------- Thanh nut duoi = ---------- */
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
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
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
    flex: 1.6,
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
