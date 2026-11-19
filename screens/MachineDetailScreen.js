import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles, colors } from '../styles/styles';
import { useApp } from '../context/AppContext';
import { Stepper, CalcRow } from '../components/ui';
import { getGpu, kr } from '../storage/hardware';
import { USE_CASES } from '../storage/marketplace';

// Skærm 4 (stack): detaljer om én maskine + book et antal timer
export default function MachineDetailScreen({ route, navigation }) {
  const styles = useStyles();
  const { listings, rentMachine } = useApp();
  const listing = listings.find((l) => l.id === route.params?.id);
  const [hours, setHours] = useState(3);

  if (!listing) {
    return <View style={styles.container}><Text style={styles.emptyText}>Maskinen er ikke længere til leje.</Text></View>;
  }
  const gpu = getGpu(listing.gpuId);
  const tier = gpu.vram >= 24 ? 'high' : gpu.vram >= 12 ? 'mid' : 'low';
  const total = listing.price * hours;

  const onRent = () => {
    if (listing.own) {
      Alert.alert('Det er din egen maskine', 'Du kan ikke leje din egen computer.');
      return;
    }
    rentMachine(listing, hours);
    Alert.alert('Lejet!', `Du har lejet ${gpu.name === 'Ingen GPU (kun CPU/RAM)' ? 'maskinen' : gpu.name} i ${hours} timer. Forbindelsesoplysninger ligger under Aktivitet.`);
    navigation.navigate('Tabs', { screen: 'Aktivitet' });
  };

  const onShare = () =>
    Share.share({ message: `Se denne maskine på RamSwap: ${gpu.name}, ${listing.ramGb} GB RAM i ${listing.city} for ${kr(listing.price)}/time.` });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{gpu.id === 'none' ? `${listing.cores}-kernet CPU-server` : gpu.name}</Text>
      <Text style={styles.subtitle}>Udlejes af {listing.owner} · {listing.city}</Text>

      <View style={styles.statGrid}>
        <View style={styles.statBox}><Text style={styles.statLabel}>VRAM</Text><Text style={styles.statValue}>{gpu.vram ? `${gpu.vram} GB` : '-'}</Text></View>
        <View style={styles.statBox}><Text style={styles.statLabel}>CPU-kerner</Text><Text style={styles.statValue}>{listing.cores}</Text></View>
        <View style={styles.statBox}><Text style={styles.statLabel}>RAM</Text><Text style={styles.statValue}>{listing.ramGb} GB</Text></View>
        <View style={styles.statBox}><Text style={styles.statLabel}>Oppetid</Text><Text style={styles.statValue}>{listing.uptime} %</Text></View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>God til</Text>
        <Text style={styles.body}>{USE_CASES[tier]}</Text>
        <View style={{ height: 8 }} />
        <Text style={styles.small}>
          ⭐ {listing.rating.toFixed(1)} fra {listing.jobs} job · {listing.verified ? 'Verificeret udlejer (MitID)' : 'Ikke verificeret endnu'}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="shield-checkmark" size={20} color={colors.warning} />
        <Text style={styles.infoText}>
          Dit job kører i en isoleret container. Udlejeren kan ikke se dine filer, og data slettes, når lejemålet slutter.
        </Text>
      </View>

      <Stepper label="Antal timer" value={hours} min={1} max={48} display={`${hours} t`} onChange={setHours} />
      <View style={styles.card}>
        <CalcRow label="Pris pr. time" value={kr(listing.price)} />
        <CalcRow label="Antal timer" value={`${hours}`} />
        <CalcRow label="I alt" value={kr(total)} total color={colors.primary} />
      </View>

      <TouchableOpacity style={styles.button} onPress={onRent}>
        <Ionicons name="flash" size={18} color="#fff" />
        <Text style={styles.buttonText}>Lej nu for {kr(total)}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={onShare}>
        <Ionicons name="share-outline" size={18} color={colors.primary} />
        <Text style={styles.buttonSecondaryText}>Del maskinen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
