/**
 * src/screens/SurfacePickerScreen/styles.ts
 * Style man keo 4 diem neo xac dinh be mat.
 */
import { StyleSheet } from 'react-native';
import { COLORS } from '../HomeScreen/styles';

/** Kich thuoc cham keo (diem neo) */
export const HANDLE_SIZE = 32;
/** Ban kinh cham de ve duong bao */
export const HANDLE_RADIUS = HANDLE_SIZE / 2;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },

  /* ---------- Vung anh ---------- */
  canvasWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    position: 'relative',
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  /* ---------- Lop phu lam toi vung ngoai ---------- */
  dimOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  /* ---------- Duong vien tu giac ---------- */
  edge: {
    position: 'absolute',
    backgroundColor: COLORS.accent,
    height: 2,
  },

  /* ---------- Diem neo ---------- */
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_RADIUS,
    backgroundColor: 'rgba(230,126,34,0.35)',
    borderWidth: 2.5,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  handleLabel: {
    position: 'absolute',
    top: -20,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent,
  },

  /* ---------- Header noi tren anh ---------- */
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerStep: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  /* ---------- Thanh duoi ---------- */
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
    backgroundColor: '#0D0D0D',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  warningText: {
    fontSize: 12,
    color: '#F39C12',
    marginBottom: 10,
    lineHeight: 17,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  resetButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  nextButton: {
    flex: 1.6,
    height: 48,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  nextButtonTextDisabled: {
    color: COLORS.inactive,
  },
});

export default styles;
