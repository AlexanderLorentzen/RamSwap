import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles, colors } from '../styles/styles';
import { useApp } from '../context/AppContext';
import { BarChart } from '../components/ui';
import { getGpu, kr } from '../storage/hardware';

const DAYS = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

// Skærm 5: Aktivitet. Udlejer: indtjening og udbetaling. Lejer: mine lejemål.
export default function ActivityScreen() {
  const styles = useStyles();
  const { sessions, rentals, balance, simulateJob, payout, endRental } = useApp();
  const [tab, setTab] = useState('earn');

  // Netto pr. dag de sidste 7 dage
  const week = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toDateString();
    const value = sessions.filter((s) => new Date(s.date).toDateString() === key).reduce((a, s) => a + s.net, 0);
    return { label: DAYS[d.getDay()], value };
  });
  const weekTotal = week.reduce((a, d) => a + d.value, 0);

  // NY KNAP 1: simulér et job (i den færdige løsning kommer jobbene fra desktop-agenten)
  const onSimulate = () => {
    const s = simulateJob();
    Alert.alert('Nyt job afsluttet', `${s.renter} lejede din maskine i ${s.hours} t. Du tjente ${kr(s.net)} netto.`);
  };

  // NY KNAP 2: udbetal saldoen
  const onPayout = () => {
    if (balance <= 0) {
      Alert.alert('Ingen saldo', 'Du har ikke noget at udbetale endnu.');
      return;
    }
    Alert.alert('Udbetal', `Overfør ${kr(balance)} til din bankkonto?`, [
      { text: 'Annuller', style: 'cancel' },
      { text: 'Udbetal', onPress: payout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.segment}>
        {[{ id: 'earn', label: 'Min indtjening' }, { id: 'rent', label: 'Mine lejemål' }].map((t) => (
          <TouchableOpacity key={t.id} style={[styles.segmentItem, tab === t.id && styles.segmentItemActive]} onPress={() => setTab(t.id)}>
            <Text style={[styles.segmentText, tab === t.id && styles.segmentTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'earn' ? (
        <>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Sidste 7 dage</Text>
              <Text style={[styles.cardTitle, { color: colors.success }]}>{kr(weekTotal)}</Text>
            </View>
            <BarChart data={week} color={colors.success} />
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.flex1]} onPress={onSimulate}>
              <Ionicons name="play-circle" size={18} color="#fff" />
              <Text style={styles.buttonText}>Simulér job</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSuccess, styles.flex1]} onPress={onPayout}>
              <Ionicons name="wallet" size={18} color="#fff" />
              <Text style={styles.buttonText}>Udbetal {kr(balance)}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Seneste job</Text>
          {sessions.slice(0, 12).map((s) => (
            <View key={s.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.listTitle}>{s.renter}</Text>
                <Text style={[styles.listTitle, { color: s.net >= 0 ? colors.success : colors.danger }]}>{kr(s.net)}</Text>
              </View>
              <Text style={styles.small}>
                {new Date(s.date).toLocaleDateString('da-DK')} · {s.hours} t · brutto {kr(s.gross)} · gebyr {kr(s.fee)} · strøm {kr(s.power)}
                {s.paidOut ? ' · udbetalt' : ''}
              </Text>
            </View>
          ))}
        </>
      ) : (
        <>
          {rentals.length === 0 ? (
            <Text style={styles.emptyText}>Du har ikke lejet noget endnu. Find en maskine under Marked.</Text>
          ) : (
            rentals.map((r) => {
              const gpu = getGpu(r.gpuId);
              const active = r.status === 'Aktiv';
              return (
                <View key={r.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.listTitle}>{gpu.id === 'none' ? 'CPU-server' : gpu.name} hos {r.owner}</Text>
                    <View style={[styles.badge, active ? styles.badgeOn : styles.badgeOff]}>
                      <Text style={[styles.badgeText, { color: active ? colors.success : colors.muted }]}>{r.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.small}>{r.hours} timer · {kr(r.total)} · {new Date(r.date).toLocaleString('da-DK')}</Text>
                  {active && (
                    <>
                      <Text style={[styles.small, { marginTop: 6, fontFamily: 'monospace' }]}>ssh job@{r.id.slice(-5)}.ramswap.dk</Text>
                      <TouchableOpacity style={[styles.button, styles.buttonSecondary, { marginTop: 10, marginBottom: 0 }]} onPress={() => endRental(r.id)}>
                        <Text style={styles.buttonSecondaryText}>Afslut lejemål</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              );
            })
          )}
        </>
      )}
    </ScrollView>
  );
}
