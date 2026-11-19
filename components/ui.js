// Små genbrugelige komponenter. Al styling hentes fra styles/styles.js.
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles, colors } from '../styles/styles';

export function Stepper({ label, value, display, onChange, step = 1, min = 0, max = 999 }) {
  const styles = useStyles();
  const set = (v) => onChange(Math.min(max, Math.max(min, Math.round(v * 100) / 100)));
  return (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <TouchableOpacity style={styles.stepperButton} onPress={() => set(value - step)} accessibilityLabel={`Mindre ${label}`}>
          <Ionicons name="remove" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{display ?? value}</Text>
        <TouchableOpacity style={styles.stepperButton} onPress={() => set(value + step)} accessibilityLabel={`Mere ${label}`}>
          <Ionicons name="add" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function Chip({ label, active, onPress }) {
  const styles = useStyles();
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// Søjlediagram bygget af Views. color kan være en funktion af værdien.
export function BarChart({ data, color = colors.primary, max }) {
  const styles = useStyles();
  const top = max ?? Math.max(0.01, ...data.map((d) => d.value));
  return (
    <View style={styles.chart}>
      {data.map((d, i) => (
        <View key={i} style={styles.chartCol}>
          <View
            style={[
              styles.chartBar,
              {
                height: `${Math.max(2, (Math.max(0, d.value) / top) * 100)}%`,
                backgroundColor: typeof color === 'function' ? color(d) : color,
              },
            ]}
          />
          {d.label ? <Text style={styles.chartLabel}>{d.label}</Text> : null}
        </View>
      ))}
    </View>
  );
}

export function CalcRow({ label, value, color, total }) {
  const styles = useStyles();
  return (
    <View style={[styles.calcRow, total && styles.calcTotal]}>
      <Text style={[styles.calcLabel, total && { color: colors.text, fontWeight: '700' }]}>{label}</Text>
      <Text style={[styles.calcValue, total && styles.calcTotalValue, color && { color }]}>{value}</Text>
    </View>
  );
}
