import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { createBooking, getEvent } from '@/services/api';
import { getAuthSession } from '@/services/authStorage';
import type { Event } from '@/types/event';

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [numberOfSeats, setNumberOfSeats] = useState('1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function loadEvent() {
    try {
      setLoading(true);

      setEvent(await getEvent(id));
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to load event details.'
      );
    } finally {
      setLoading(false);
    }
  }

  const seats = Number(numberOfSeats) || 0;
  const totalPrice = event ? event.price * seats : 0;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading booking details...
        </Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  async function handleBooking() {
    if (!Number.isInteger(seats) || seats < 1) {
      Alert.alert(
        'Invalid seats',
        'Please enter at least 1 seat.'
      );
      return;
    }

    if (seats > event.availableSeats) {
      Alert.alert(
        'Not enough seats',
        `Only ${event.availableSeats} seats are available.`
      );
      return;
    }

    try {
      const session = await getAuthSession();

      if (!session) {
        Alert.alert(
          'Login required',
          'Please login before booking an event.',
          [
            {
              text: 'Login',
              onPress: () => router.replace('/login'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );

        return;
      }

      await createBooking(
        session.token,
        event.id,
        seats
      );

      Alert.alert(
        'Booking Confirmed',
        `Your booking for ${event.name} has been confirmed.\n\nSeats: ${seats}\nTotal: Rs. ${totalPrice}`,
        [
          {
            text: 'View My Bookings',
            onPress: () => {
              router.replace('/(tabs)/bookings');
            },
          },
        ]
      );

    } catch (error) {
      Alert.alert(
        'Booking Failed',
        error instanceof Error
          ? error.message
          : 'Unable to create your booking.'
      );
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        Book Event
      </Text>

      <View style={styles.card}>
        <Text style={styles.eventName}>
          {event.name}
        </Text>

        <Text style={styles.info}>
          📅 {event.date}
        </Text>

        <Text style={styles.info}>
          🕐 {event.time}
        </Text>

        <Text style={styles.info}>
          📍 {event.location}
        </Text>

        <Text style={styles.price}>
          Rs. {event.price} per seat
        </Text>

        <Text style={styles.available}>
          {event.availableSeats} seats available
        </Text>
      </View>

      <Text style={styles.label}>
        Number of Seats
      </Text>

      <TextInput
        style={styles.input}
        value={numberOfSeats}
        onChangeText={setNumberOfSeats}
        keyboardType="numeric"
        placeholder="Enter number of seats"
      />

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>
          Total Price
        </Text>

        <Text style={styles.totalPrice}>
          Rs. {totalPrice}
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={handleBooking}
      >
        <Text style={styles.buttonText}>
          Confirm Booking
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
  },

  eventName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
  },

  info: {
    fontSize: 15,
    marginBottom: 8,
    color: '#555',
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },

  available: {
    marginTop: 5,
    color: '#666',
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },

  totalCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    marginBottom: 20,
  },

  totalLabel: {
    fontSize: 15,
    color: '#555',
  },

  totalPrice: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 5,
  },

  button: {
    backgroundColor: '#5B5FEF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});