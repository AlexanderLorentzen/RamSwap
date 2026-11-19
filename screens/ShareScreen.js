import { ScrollView, View, Text, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles, colors } from '../styles/styles';
import { useApp } from '../context/AppContext';
import { Stepper, Chip, CalcRow, BarChart } from '../components/ui';
import { GPUS, suggestedPrice, calcEarnings, kr, krInt, PLATFORM_FEE } from '../storage/hardware';

// Skærm 2: Udlejer-siden. Vælg hvad du vil dele, sæt en pris og se hvad du REELT tjener.
export default function ShareScreen({ navigation }) {
  const styles = useStyles();
  const { machine, updateMachine, earnings, avgElpris, prices, settings, toggleSharing } = useApp();

  const suggestion = suggestedPrice(machine);

  // Hvilke timer i døgnet kan betale sig? (Smart udlejning, bygger på live elpris)
  const hourly = prices.list.map((p) => {
    const e = calcEarnings({ ...machine, elpris: p.price, utilization: 1, hoursPerDay: 1 });
    return { label: Number(p.label) % 6 === 0 ? p.label : '', value: e.netHour, price: p.price };
  });
  const goodHours = hourly.filter(
    (h) => h.value > 0 && (!settings.smartPause || h.price <= settings.maxElpris),
  ).length;

  const onStart = () => {
    if (earnings.netHour <= 0) {
      Alert.alert(
        'Det kan ikke betale sig',
        'Med den nuværende elpris taber du penge pr. time. Hæv prisen eller vælg kun at udleje om natten.',
      );
      return;
    }
    if (!machine.sharing) toggleSharing();
    navigation.navigate('Forside');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Navn på maskinen</Text>
      <TextInput
        style={styles.input}
        value={machine.nickname}
        onChangeText={(nickname) => updateMachine({ nickname })}
        placeholder="Fx Min gamer-PC"
      />

      <Text style={styles.label}>Grafikkort</Text>
      <View style={styles.chipRow}>
        {GPUS.map((g) => (
          <Chip
            key={g.id}
            label={g.id === 'none' ? 'Ingen GPU' : g.name}
            active={machine.gpuId === g.id}
            onPress={() => updateMachine({ gpuId: g.id })}
          />
        ))}
      </View>

      <Stepper label="CPU-kerner der deles" value={machine.cores} min={1} max={32}
        onChange={(cores) => updateMachine({ cores })} />
      <Stepper label="RAM der deles" value={machine.ramGb} min={4} max={128} step={4}
        display={`${machine.ramGb} GB`} onChange={(ramGb) => updateMachine({ ramGb })} />
      <Stepper label="Timer tilgængelig pr. døgn" value={machine.hoursPerDay} min={1} max={24}
        display={`${machine.hoursPerDay} t`} onChange={(hoursPerDay) => updateMachine({ hoursPerDay })} />
      <Stepper label="Din pris pr. time" value={machine.pricePerHour} min={0.1} max={20} step={0.1}
        display={kr(machine.pricePerHour)} onChange={(pricePerHour) => updateMachine({ pricePerHour })} />

      <TouchableOpacity onPress={() => updateMachine({ pricePerHour: suggestion })} style={{ marginBottom: 12 }}>
        <Text style={[styles.small, { color: colors.primary, fontWeight: '700' }]}>
          Brug markedspris: {kr(suggestion)}/time
        </Text>
      </TouchableOpacity>

      <View style={styles.settingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.settingLabel}>Kun når jeg ikke bruger PC'en</Text>
          <Text style={styles.settingHint}>Udlejning stopper med det samme, når du starter et spil.</Text>
        </View>
        <Switch value={machine.onlyWhenIdle} onValueChange={(v) => updateMachine({ onlyWhenIdle: v })} />
      </View>

      {/* NY FUNKTIONALITET: ærlig indtjeningsberegner med strøm trukket fra */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hvad tjener du reelt pr. lejet time?</Text>
        <CalcRow label="Lejers betaling" value={kr(earnings.grossHour)} />
        <CalcRow label={`RamSwap-gebyr (${PLATFORM_FEE * 100} %)`} value={`- ${kr(earnings.feeHour)}`} />
        <CalcRow label={`Strøm (${earnings.kwhHour.toFixed(2).replace('.', ',')} kWh à ${kr(avgElpris)})`} value={`- ${kr(earnings.powerHour)}`} color={colors.warning} />
        <CalcRow label="Netto til dig" value={kr(earnings.netHour)} total color={earnings.netHour > 0 ? colors.success : colors.danger} />
        <Text style={[styles.small, { marginTop: 8 }]}>
          Ved {Math.round(settings.utilization * 100)} % udnyttelse ≈ {earnings.rentedHoursMonth} lejede timer/md. = {krInt(earnings.netMonth)} netto pr. måned.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Smart udlejning efter elprisen</Text>
        <Text style={styles.small}>
          Grøn = timer hvor udlejning giver overskud{settings.smartPause ? ` og elprisen er højst ${kr(settings.maxElpris)}` : ''}: {goodHours} af {hourly.length} timer kan betale sig.
        </Text>
        <BarChart
          data={hourly}
          color={(d) => (d.value > 0 && (!settings.smartPause || d.price <= settings.maxElpris) ? colors.success : colors.warning)}
          max={Math.max(...hourly.map((h) => Math.abs(h.value)), 0.5)}
        />
        <Text style={[styles.small, { marginTop: 6 }]}>
          {prices.live ? 'Kilde: Energinet, Energi Data Service (live)' : 'Estimeret døgnmønster, live data hentes fra Energinet'}
        </Text>
      </View>

      <TouchableOpacity style={[styles.button, styles.buttonSuccess]} onPress={onStart}>
        <Ionicons name="flash" size={18} color="#fff" />
        <Text style={styles.buttonText}>{machine.sharing ? 'Gem og fortsæt udlejning' : 'Gem og start udlejning'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
