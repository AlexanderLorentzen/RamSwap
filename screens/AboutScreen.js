import { ScrollView, Text } from 'react-native';
import { useStyles } from '../styles/styles';

// Skærm 7 (stack): om appen og de antagelser, beregningerne bygger på
export default function AboutScreen() {
  const styles = useStyles();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Om RamSwap</Text>
      <Text style={styles.subtitle}>
        RamSwap er en dansk markedsplads, hvor privatpersoner kan udleje ubrugt GPU-, CPU- og RAM-kapacitet til
        studerende, startups og små virksomheder, der har brug for computerkraft i kort tid. Lavet som
        afsluttende gruppeprojekt i Innovation og ny teknologi (INNT), CBS.
      </Text>

      <Text style={styles.sectionTitle}>Sådan virker det</Text>
      <Text style={styles.subtitle}>
        • Udlejer installerer RamSwap-agenten på sin computer og styrer alt fra appen{'\n'}
        • Lejer finder en maskine under Marked og betaler pr. time{'\n'}
        • Jobbet kører i en isoleret container, så ingen kan se hinandens filer{'\n'}
        • RamSwap tager 20 % af lejeprisen, resten går til udlejeren
      </Text>

      <Text style={styles.sectionTitle}>Hvorfor elprisen er med</Text>
      <Text style={styles.subtitle}>
        Et RTX 4090 bruger omkring 0,5 kWh i timen under fuld last. Med danske elpriser kan strømmen æde en stor del af
        indtjeningen, så appen viser altid nettoindtjeningen og kan selv sætte udlejning på pause, når strømmen er dyr.
      </Text>

      <Text style={styles.sectionTitle}>Antagelser i prototypen</Text>
      <Text style={styles.small}>
        Markedspriser: Vast.ai og SaladCloud, efterår 2026 (1 USD = 6,5 kr.). Elpris: Energinet DayAheadPrices + 25 %
        moms + 0,70 kr. i tariffer + 1 øre elafgift. Desktop-agenten og betalingen er ikke bygget endnu, derfor kan job
        simuleres under Aktivitet.
      </Text>
    </ScrollView>
  );
}
