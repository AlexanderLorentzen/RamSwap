import { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles, colors } from '../styles/styles';
import { useApp } from '../context/AppContext';
import { Chip } from '../components/ui';
import { getGpu, kr } from '../storage/hardware';

const FILTERS = [
  { id: 'all', label: 'Alle' },
  { id: 'vram', label: '24 GB+ VRAM' },
  { id: 'cheap', label: 'Under 2 kr.' },
  { id: 'verified', label: 'Verificeret' },
];
const SORTS = [
  { id: 'price', label: 'Pris' },
  { id: 'rating', label: 'Bedømmelse' },
];

// Skærm 3: Lejer-siden. Søg og filtrér i maskiner, der er til leje lige nu.
export default function MarketScreen({ navigation }) {
  const styles = useStyles();
  const { listings } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('price');

  // NY FUNKTIONALITET: søgning på GPU, by eller udlejer + filtre og sortering
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings
      .filter((l) => {
        const gpu = getGpu(l.gpuId);
        const hay = `${gpu.name} ${l.city} ${l.owner} ${l.ramGb}gb`.toLowerCase();
        if (q && !hay.includes(q)) return false;
        if (filter === 'vram') return gpu.vram >= 24;
        if (filter === 'cheap') return l.price < 2;
        if (filter === 'verified') return l.verified;
        return true;
      })
      .sort((a, b) => (sort === 'price' ? a.price - b.price : b.rating - a.rating));
  }, [listings, query, filter, sort]);

  return (
    <View style={[styles.container, { padding: 18, paddingBottom: 0 }]}>
      <TextInput
        style={styles.input}
        placeholder="🔍 Søg fx 4090, Aarhus eller 64 GB"
        value={query}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
      />
      <View style={styles.chipRow}>
        {FILTERS.map((f) => (
          <Chip key={f.id} label={f.label} active={filter === f.id} onPress={() => setFilter(f.id)} />
        ))}
      </View>
      <View style={[styles.row, { alignItems: 'center', marginBottom: 10 }]}>
        <Text style={styles.small}>{visible.length} maskiner · sorter efter</Text>
        {SORTS.map((s) => (
          <TouchableOpacity key={s.id} onPress={() => setSort(s.id)}>
            <Text style={[styles.small, { fontWeight: '700', color: sort === s.id ? colors.primary : colors.muted }]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={visible}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          const gpu = getGpu(item.gpuId);
          return (
            <TouchableOpacity
              style={[styles.listItem, item.own && { borderWidth: 1.5, borderColor: colors.primary }]}
              onPress={() => navigation.navigate('MachineDetail', { id: item.id })}
            >
              <View style={styles.listIcon}>
                <Ionicons name={gpu.vram ? 'hardware-chip' : 'server'} size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>
                  {gpu.id === 'none' ? `${item.cores}-kernet CPU` : gpu.name}
                  {item.verified ? '  ✓' : ''}
                </Text>
                <Text style={styles.listMeta}>
                  {gpu.vram ? `${gpu.vram} GB VRAM · ` : ''}{item.ramGb} GB RAM · {item.city}
                </Text>
                <Text style={styles.listMeta}>⭐ {item.rating.toFixed(1)} · {item.uptime} % oppetid · {item.owner}</Text>
              </View>
              <View>
                <Text style={styles.listPrice}>{kr(item.price)}</Text>
                <Text style={styles.listPriceUnit}>pr. time</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>Ingen maskiner matcher din søgning.</Text>}
      />
    </View>
  );
}
