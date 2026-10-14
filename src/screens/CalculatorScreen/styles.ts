/**
 * src/screens/CalculatorScreen/styles.ts
 * Style man May tinh vat tu - theme dark dong bo.
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
  },

  /* ---------- The nhap lieu ---------- */
  card: {
    marginTop: 20,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    padding: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
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
    height: 46,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#E74C3C',
  },

  /* ---------- Chon vat lieu ---------- */
  materialList: {
    marginTop: 4,
  },
  materialOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  materialOptionActive: {
    backgroundColor: 'rgba(230,126,34,0.18)',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  materialSwatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  materialMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  checkIcon: {
    marginLeft: 8,
  },

  /* ---------- Hao hut ---------- */
  wasteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingHorizontal: 14,
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

  /* ---------- Ket qua ---------- */
  resultCard: {
    marginTop: 20,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    padding: 16,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  resultRowLast: {
    borderBottomWidth: 0,
  },
  resultLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  resultHighlight: {
    color: COLORS.accent,
    fontSize: 17,
    fontWeight: 'bold',
  },
  emptyResult: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },

  /* ---------- Nut them vao gio ---------- */
  addButton: {
    marginTop: 20,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  addButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  addButtonTextDisabled: {
    color: COLORS.inactive,
  },
});

export default styles;
