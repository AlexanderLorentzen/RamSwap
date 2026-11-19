import { StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

// RamSwap-farver: lilla = platformen, grøn = penge du tjener, orange = strømudgift.
export const colors = {
  bg: '#F4F5FA',
  card: '#FFFFFF',
  primary: '#5B4BDB',
  primaryDark: '#3E31A8',
  primarySoft: '#ECE9FD',
  secondary: '#A0A6C0',
  text: '#1C1B2E',
  muted: '#5E5D72',
  border: '#DCDCE8',
  danger: '#C8463D',
  success: '#12A06B',
  successSoft: '#E3F6EE',
  warning: '#E08A1E',
  warningSoft: '#FDF1E1',
};

// Al styling ligger samlet her (krav fra opgaven). Skriftstørrelsen skaleres,
// hvis brugeren har slået "Stor tekst" til under Indstillinger.
export function createStyles(largeText = false) {
  const s = largeText ? 1.25 : 1;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 18, paddingBottom: 40 },
    title: { fontSize: 26 * s, fontWeight: '800', color: colors.text, marginBottom: 6 },
    subtitle: { fontSize: 15 * s, color: colors.muted, marginBottom: 18, lineHeight: 21 * s },
    sectionTitle: { fontSize: 17 * s, fontWeight: '700', color: colors.text, marginBottom: 8, marginTop: 10 },
    body: { fontSize: 15 * s, color: colors.text, lineHeight: 21 * s },
    small: { fontSize: 12.5 * s, color: colors.muted, lineHeight: 17 * s },

    // Knapper
    button: {
      backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12,
      alignItems: 'center', marginBottom: 10, flexDirection: 'row', justifyContent: 'center', gap: 8,
    },
    buttonSecondary: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.primary },
    buttonSecondaryText: { color: colors.primary, fontSize: 16 * s, fontWeight: '700' },
    buttonSuccess: { backgroundColor: colors.success },
    buttonDanger: { backgroundColor: colors.danger },
    buttonWarning: { backgroundColor: colors.warning },
    buttonText: { color: '#FFFFFF', fontSize: 16 * s, fontWeight: '700' },
    row: { flexDirection: 'row', gap: 10 },
    flex1: { flex: 1 },

    // Kort
    card: {
      backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12,
      shadowColor: '#1C1B2E', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    heroCard: { backgroundColor: colors.primary, borderRadius: 18, padding: 18, marginBottom: 14 },
    heroLabel: { color: '#D9D4FF', fontSize: 13 * s, fontWeight: '600' },
    heroValue: { color: '#FFFFFF', fontSize: 34 * s, fontWeight: '800', marginTop: 2 },
    heroSub: { color: '#E8E5FF', fontSize: 13.5 * s, marginTop: 4 },
    cardTitle: { fontSize: 16 * s, fontWeight: '700', color: colors.text, marginBottom: 6 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },

    // Statusbadge
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
    badgeText: { fontSize: 12 * s, fontWeight: '700' },
    badgeOn: { backgroundColor: colors.successSoft },
    badgeOff: { backgroundColor: '#EEEEF4' },

    // Nøgletal i grid
    statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
    statBox: { flexGrow: 1, flexBasis: '45%', backgroundColor: colors.card, borderRadius: 14, padding: 12 },
    statLabel: { fontSize: 12 * s, color: colors.muted, fontWeight: '600' },
    statValue: { fontSize: 20 * s, fontWeight: '800', color: colors.text, marginTop: 2 },

    // Formular-elementer
    label: { fontSize: 14 * s, fontWeight: '700', color: colors.text, marginBottom: 6, marginTop: 6 },
    input: {
      backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
      borderWidth: 1, borderColor: colors.border, fontSize: 16 * s, color: colors.text, marginBottom: 10,
    },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
    chip: {
      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.card,
      borderWidth: 1, borderColor: colors.border,
    },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { fontSize: 13.5 * s, color: colors.text, fontWeight: '600' },
    chipTextActive: { color: '#FFFFFF' },

    stepperRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: colors.card, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 10,
    },
    stepperLabel: { fontSize: 15 * s, color: colors.text, fontWeight: '600', flex: 1 },
    stepperControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    stepperButton: {
      width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primarySoft,
      alignItems: 'center', justifyContent: 'center',
    },
    stepperValue: { fontSize: 16 * s, fontWeight: '800', color: colors.text, minWidth: 64, textAlign: 'center' },

    settingRow: {
      backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 10,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    },
    settingLabel: { fontSize: 16 * s, color: colors.text, fontWeight: '600' },
    settingHint: { fontSize: 13 * s, color: colors.muted, marginTop: 2 },

    // Regnestykke
    calcRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
    calcLabel: { fontSize: 14.5 * s, color: colors.muted },
    calcValue: { fontSize: 14.5 * s, color: colors.text, fontWeight: '700' },
    calcTotal: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 6, paddingTop: 8 },
    calcTotalValue: { fontSize: 18 * s, fontWeight: '800' },

    // Markedsliste
    listItem: {
      backgroundColor: colors.card, padding: 14, borderRadius: 14, marginBottom: 10,
      flexDirection: 'row', alignItems: 'center', gap: 12,
    },
    listIcon: {
      width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primarySoft,
      alignItems: 'center', justifyContent: 'center',
    },
    listTitle: { fontSize: 16 * s, fontWeight: '700', color: colors.text },
    listMeta: { fontSize: 12.5 * s, color: colors.muted, marginTop: 2 },
    listPrice: { fontSize: 16 * s, fontWeight: '800', color: colors.primary, textAlign: 'right' },
    listPriceUnit: { fontSize: 11 * s, color: colors.muted, textAlign: 'right' },
    emptyText: { fontSize: 15 * s, color: colors.muted, textAlign: 'center', marginTop: 24 },

    // Søjlediagram (bygget af Views, ingen ekstra bibliotek)
    chart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 6, marginTop: 6 },
    chartCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
    chartBar: { width: '100%', borderRadius: 6, minHeight: 3 },
    chartLabel: { fontSize: 10.5 * s, color: colors.muted, marginTop: 4 },

    // Segmenteret kontrol
    segment: { flexDirection: 'row', backgroundColor: '#E6E6F0', borderRadius: 12, padding: 4, marginBottom: 12 },
    segmentItem: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
    segmentItemActive: { backgroundColor: colors.card },
    segmentText: { fontSize: 14 * s, fontWeight: '700', color: colors.muted },
    segmentTextActive: { color: colors.primary },

    infoBox: { backgroundColor: colors.warningSoft, borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', gap: 10 },
    infoText: { flex: 1, fontSize: 13.5 * s, color: '#7A4A0C', lineHeight: 19 * s },
  });
}

// Hook så skærmene altid får de rigtige styles ud fra brugerens indstilling
export function useStyles() {
  const { settings } = useApp();
  return useMemo(() => createStyles(settings.largeText), [settings.largeText]);
}
