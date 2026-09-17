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
import {
  requestNotificationPermission,
  scheduleEventReminder,
  sendLocalNotification,
} from '@/services/notificationService';
import type { Event } from '@/types/event';

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [numberOfSeats, setNumberOfSeats] = useState('1');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const currentEvent = event;

  function getEventStartDate(): Date | null {
    const timeMatch = currentEvent.time
      .trim()
      .toUpperCase()
      .match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);

    if (timeMatch) {
      let hours = Number(timeMatch[1]);
      const minutes = Number(timeMatch[2] || '0');
      const meridiem = timeMatch[3];

      if (meridiem === 'PM' && hours !== 12) {
        hours += 12;
      }

      if (meridiem === 'AM' && hours === 12) {
        hours = 0;
      }

      const normalizedTime = `${String(hours).padStart(2, '0')}:${String(
        minutes
      ).padStart(2, '0')}:00`;
      const eventDate = new Date(
        `${currentEvent.date}T${normalizedTime}`
      );

      return Number.isNaN(eventDate.getTime())
        ? null
        : eventDate;
    }

    const eventDate = new Date(
      `${currentEvent.date}T${currentEvent.time}`
    );

    return Number.isNaN(eventDate.getTime())
      ? null
      : eventDate;
  }

  async function handleBooking() {
    if (!Number.isInteger(seats) || seats < 1) {
      Alert.alert(
        'Invalid seats',
        'Please enter at least 1 seat.'
      );
      return;
    }

    if (seats > currentEvent.availableSeats) {
      Alert.alert(
        'Not enough seats',
        `Only ${currentEvent.availableSeats} seats are available.`
      );
      return;
    }

    try {
      setSaving(true);

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
        Number(currentEvent.id),
        seats
      );

      try {
        const permissionGranted =
          await requestNotificationPermission();

        if (permissionGranted) {
          await sendLocalNotification(
            'Booking Confirmed',
            'Your EventHub booking has been successfully confirmed.'
          );
        }
      } catch (notificationError) {
        console.error(
          'Notification error:',
          notificationError
        );
      }

      try {
        const eventStart = getEventStartDate();
        const now = new Date();

        if (eventStart && eventStart > now) {
          const oneHourBefore = new Date(
            eventStart.getTime() - 60 * 60 * 1000
          );
          const reminderDate = oneHourBefore > now
            ? oneHourBefore
            : new Date(now.getTime() + 1000);

          await scheduleEventReminder(
            'Event Reminder',
            `Your EventHub event "${currentEvent.name}" starts in 1 hour.`,
            reminderDate
          );
        }
      } catch (reminderError) {
        console.error(
          'Event reminder error:',
          reminderError
        );
      }

      setSuccess(true);

    } catch (error) {
      Alert.alert(
        'Booking Failed',
        error instanceof Error
          ? error.message
          : 'Unable to create your booking.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>
            Booking Confirmed!
          </Text>

          <Text style={styles.successText}>
            Your booking has been successfully confirmed.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => {
              router.replace('/(tabs)/bookings');
            }}
          >
            <Text style={styles.buttonText}>
              View My Bookings
            </Text>
          </Pressable>

          <Pressable
            style={styles.backToEventsButton}
            onPress={() => {
              router.replace('/(tabs)/home');
            }}
          >
            <Text style={styles.backToEventsText}>
              Back to Events
            </Text>
          </Pressable>
        </View>
      </View>
    );
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
        disabled={saving}
        style={[styles.button, saving && styles.disabledButton]}
        onPress={() => {
          void handleBooking();
        }}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            Confirm Booking
          </Text>
        )}
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

  successContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F7F8FC',
    padding: 20,
  },

  successCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 24,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#166534',
    textAlign: 'center',
  },

  successText: {
    fontSize: 15,
    color: '#166534',
    marginTop: 10,
    marginBottom: 24,
    textAlign: 'center',
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

  disabledButton: {
    opacity: 0.6,
  },

  backToEventsButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },

  backToEventsText: {
    color: '#374151',
    fontSize: 17,
    fontWeight: '700',
  },
});