import { StyleSheet, Text, View } from 'react-native';

export default function BookingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      <Text style={styles.subtitle}>
        Your event bookings will appear here.
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