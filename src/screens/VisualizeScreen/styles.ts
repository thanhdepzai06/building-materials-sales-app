/**
 * src/screens/VisualizeScreen/styles.ts
 * Style man xem truoc ket qua mo phong vat lieu.
 */
import { StyleSheet } from 'react-native';
import { COLORS } from '../HomeScreen/styles';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },

  /* ---------- Header ---------- */
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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

  /* ---------- Vung canvas ---------- */
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

  /* ---------- O texture phu len be mat ---------- */
  /**
   * Moi o la 1 View nho, duoc bien doi bang transform matrix
   * de khop voi tu giac phoi canh.
   */
  textureTile: {
    position: 'absolute',
    overflow: 'hidden',
  },

  /* ---------- Duong chia truot so sanh ---------- */
  divider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#FFFFFF',
    zIndex: 5,
  },
  dividerHandle: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    marginLeft: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---------- Nhan BEFORE / AFTER ---------- */
  compareLabel: {
    position: 'absolute',
    top: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    zIndex: 6,
  },
  compareLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  /* ---------- Bang dieu khien duoi ---------- */
  controlPanel: {
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },

  /* ---------- Chon che do xem ---------- */
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  modeChip: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeChipActive: {
    backgroundColor: COLORS.accent,
  },
  modeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* ---------- Slider do dam ---------- */
  sliderRow: {
    marginBottom: 14,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sliderLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  sliderValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sliderTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  sliderThumb: {
    position: 'absolute',
    top: -7,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: COLORS.accent,
  },

  /* ---------- Thong tin vat lieu dang ap ---------- */
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  materialSwatch: {
    width: 40,
    height: 40,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginRight: 12,
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

  /* ---------- Nut ---------- */
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
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
    height: 48,
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
    marginRight: 6,
  },

  /* ---------- Dang xu ly ---------- */
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  processingText: {
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 12,
  },
});

export default styles;
