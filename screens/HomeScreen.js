import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles, colors } from '../styles/styles';
import { useApp } from '../context/AppContext';
import { getGpu, kr, krInt } from '../storage/hardware';

// Skærm 1: Forside med status, saldo og genveje
export default function HomeScreen({ navigation }) {
  const styles = useStyles();
  const { machine, balance, earnings, currentElpris, pausedByPrice, toggleSharing, prices, settings } = useApp();
  const gpu = getGpu(machine.gpuId);

  let status = { text: 'På pause', on: false };
  if (machine.sharing && pausedByPrice) status = { text: 'Venter på billigere strøm', on: false };
  else if (machine.sharing) status = { text: 'Udlejes nu', on: true };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hej 👋</Text>
      <Text style={styles.subtitle}>
        Tjen penge på den computerkraft, du alligevel ikke bruger, mens du sover, er på arbejde eller til forelæsning.
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Klar til udbetaling</Text>
        <Text style={styles.heroValue}>{kr(balance)}</Text>
        <Text style={styles.heroSub}>
          Forventet netto pr. måned: {krInt(earnings.netMonth)} efter strøm og gebyr
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{machine.nickname}</Text>
          <View style={[styles.badge, status.on ? styles.badgeOn : styles.badgeOff]}>
            <Text style={[styles.badgeText, { color: status.on ? colors.success : colors.muted }]}>{status.text}</Text>
          </View>
        </View>
        <Text style={styles.small}>
          {gpu.name} · {machine.cores} kerner · {machine.ramGb} GB RAM · {kr(machine.pricePerHour)}/time
        </Text>
        <View style={{ height: 12 }} />
        <TouchableOpacity
          style={[styles.button, machine.sharing ? styles.buttonDanger : styles.buttonSuccess, { marginBottom: 0 }]}
          onPress={toggleSharing}
        >
          <Ionicons name={machine.sharing ? 'pause' : 'play'} size={18} color="#fff" />
          <Text style={styles.buttonText}>{machine.sharing ? 'Sæt udlejning på pause' : 'Start udlejning'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Elpris lige nu ({settings.area})</Text>
          <Text style={[styles.statValue, { color: pausedByPrice ? colors.warning : colors.text }]}>{kr(currentElpris)}</Text>
          <Text style={styles.small}>{prices.live ? 'Live fra Energinet' : 'Estimeret døgnpris'}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Netto pr. lejet time</Text>
          <Text style={[styles.statValue, { color: earnings.netHour > 0 ? colors.success : colors.danger }]}>
            {kr(earnings.netHour)}
          </Text>
          <Text style={styles.small}>Taber penge over {kr(earnings.breakEvenElpris)}/kWh</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Udlej')}>
        <Ionicons name="hardware-chip-outline" size={18} color="#fff" />
        <Text style={styles.buttonText}>Indstil min maskine</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => navigation.navigate('Marked')}>
        <Ionicons name="search" size={18} color={colors.primary} />
        <Text style={styles.buttonSecondaryText}>Find computerkraft at leje</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => navigation.navigate('About')}>
        <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
        <Text style={styles.buttonSecondaryText}>Om RamSwap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
