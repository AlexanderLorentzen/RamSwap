import { ScrollView, View, Text, Switch, TouchableOpacity, Alert } from 'react-native';
import { useStyles } from '../styles/styles';
import { useApp } from '../context/AppContext';
import { Stepper, Chip } from '../components/ui';
import { kr } from '../storage/hardware';

// Skærm 6: indstillinger for elpris, smart pause, forventet udnyttelse og tilgængelighed
export default function SettingsScreen() {
  const styles = useStyles();
  const { settings, updateSettings, resetEverything, refreshPrices, prices } = useApp();

  const confirmReset = () =>
    Alert.alert('Nulstil appen', 'Maskinopsætning, indtjening, lejemål og indstillinger slettes. Er du sikker?', [
      { text: 'Annuller', style: 'cancel' },
      { text: 'Nulstil', style: 'destructive', onPress: resetEverything },
    ]);

  const onRefresh = async () => {
    const ok = await refreshPrices();
    Alert.alert(ok ? 'Elpriser opdateret' : 'Ingen forbindelse', ok ? 'Priserne er hentet fra Energinet.' : 'Vi bruger de senest gemte priser.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Elpris</Text>
      <Text style={styles.label}>Prisområde</Text>
      <View style={styles.chipRow}>
        <Chip label="DK1 · Jylland/Fyn" active={settings.area === 'DK1'} onPress={() => updateSettings({ area: 'DK1' })} />
        <Chip label="DK2 · Sjælland" active={settings.area === 'DK2'} onPress={() => updateSettings({ area: 'DK2' })} />
      </View>

      <View style={styles.settingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.settingLabel}>Smart pause</Text>
          <Text style={styles.settingHint}>Stop automatisk udlejning, når strømmen er dyr (fx kogespidsen kl. 17-20).</Text>
        </View>
        <Switch value={settings.smartPause} onValueChange={(v) => updateSettings({ smartPause: v })} />
      </View>
      <Stepper label="Pause over elpris" value={settings.maxElpris} min={0.5} max={6} step={0.1}
        display={kr(settings.maxElpris)} onChange={(maxElpris) => updateSettings({ maxElpris })} />

      <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={onRefresh}>
        <Text style={styles.buttonSecondaryText}>Hent elpriser igen</Text>
      </TouchableOpacity>
      <Text style={[styles.small, { marginBottom: 12 }]}>
        {prices.fetchedAt ? `Sidst hentet ${new Date(prices.fetchedAt).toLocaleString('da-DK')}` : 'Endnu ikke hentet live'}
      </Text>

      <Text style={styles.sectionTitle}>Beregning</Text>
      <Stepper label="Forventet udnyttelse" value={settings.utilization} min={0.05} max={1} step={0.05}
        display={`${Math.round(settings.utilization * 100)} %`} onChange={(utilization) => updateSettings({ utilization })} />
      <Text style={[styles.small, { marginBottom: 12 }]}>
        Andel af de timer, din maskine er tilgængelig, hvor nogen faktisk lejer den. 40 % er vores forsigtige standard.
      </Text>

      <Text style={styles.sectionTitle}>Visning</Text>
      <View style={styles.settingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.settingLabel}>Stor tekst</Text>
          <Text style={styles.settingHint}>Gør al tekst i appen større og lettere at læse.</Text>
        </View>
        <Switch value={settings.largeText} onValueChange={(v) => updateSettings({ largeText: v })} />
      </View>

      <TouchableOpacity style={[styles.button, styles.buttonDanger]} onPress={confirmReset}>
        <Text style={styles.buttonText}>Nulstil app og slet data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
