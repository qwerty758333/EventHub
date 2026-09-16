import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>EventHub</Text>

      <Text style={styles.title}>
        Discover Events
      </Text>

      <Text style={styles.subtitle}>
        Find exciting events and activities near you.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
    padding: 24,
    paddingTop: 70,
  },

  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#5B5FEF',
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});