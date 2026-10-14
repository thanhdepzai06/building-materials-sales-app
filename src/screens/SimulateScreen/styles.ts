/**
 * src/screens/SimulateScreen/styles.ts
 * Style man Mo phong (Virtual Visualizer) - theme dark dong bo.
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

  /* ---------- The chon nguon anh ---------- */
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionBox: {
    flex: 1,
    height: 140,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBoxText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  /* ---------- Xem truoc anh da chon ---------- */
  previewWrap: {
    marginTop: 24,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: '#333333',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  previewButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  previewButtonPrimary: {
    backgroundColor: COLORS.accent,
  },
  previewButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  previewButtonTextPrimary: {
    color: '#FFFFFF',
  },

  /* ---------- Huong dan tung buoc ---------- */
  stepCard: {
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    padding: 16,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(230,126,34,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  stepBody: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  stepDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },

  /* ---------- Canh bao tinh nang dang phat trien ---------- */
  noticeCard: {
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(230,126,34,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(230,126,34,0.35)',
    padding: 14,
    flexDirection: 'row',
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 10,
    lineHeight: 18,
  },
});

export default styles;
