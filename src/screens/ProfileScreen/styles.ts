/**
 * src/screens/ProfileScreen/styles.ts
 * Style man Ho so - lich su mo phong & yeu thich.
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

  /* ---------- The thong ke ---------- */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    padding: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },

  /* ---------- Bo loc ---------- */
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  filterChipActive: {
    backgroundColor: COLORS.accent,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  /* ---------- Danh sach ban ghi ---------- */
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 22,
    marginBottom: 12,
  },
  recordCard: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    padding: 10,
    marginBottom: 10,
  },
  recordImageWrap: {
    width: 72,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#333333',
    position: 'relative',
  },
  recordImage: {
    width: '100%',
    height: '100%',
  },
  recordBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  recordName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  recordMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  recordBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  recordArea: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  recordActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },

  /** Nhan bao ban ghi la yeu thich */
  favoriteBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(231,76,60,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---------- Trong ---------- */
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 14,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 12,
    color: COLORS.inactive,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  browseButton: {
    marginTop: 18,
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

  /* ---------- Nut xoa lich su ---------- */
  clearButton: {
    marginTop: 20,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(231,76,60,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E74C3C',
    marginLeft: 6,
  },

  /* ---------- Chi tiet modal ---------- */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalImage: {
    width: '100%',
    aspectRatio: 0.85,
    borderRadius: 14,
    backgroundColor: '#333333',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 14,
  },
  modalMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },
  modalCloseButton: {
    marginTop: 18,
    height: 48,
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
