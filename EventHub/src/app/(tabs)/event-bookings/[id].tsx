import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { getEventBookings } from '@/services/api';
import { getAuthSession } from '@/services/authStorage';

type EventBooking = {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string | null;
  numberOfSeats: number;
  totalPrice: number;
  bookingDate: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
};

export default function EventBookingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bookings, setBookings] = useState<EventBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void loadBookings();
  }, [id]);

  async function loadBookings() {
    try {
      setLoading(true);
      setError('');

      const session = await getAuthSession();

      if (!session) {
        router.replace('/login');
        return;
      }

      const eventId = Number(id);

      if (!Number.isInteger(eventId)) {
        setError('Invalid event ID.');
        return;
      }

      const data = await getEventBookings(
        session.token,
        eventId
      );

      setBookings(data);
    } catch (error) {
      console.error('Error loading event bookings:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load bookings.'
      );
    } finally {
      setLoading(false);
    }
  }

  function renderBooking({ item }: { item: EventBooking }) {
    return (
      <View style={styles.card}>
        <Text style={styles.attendee}>
          Attendee: {item.userName}
        </Text>

        <Text style={styles.info}>
          Email: {item.userEmail}
        </Text>

        <Text style={styles.info}>
          Phone: {item.userPhone || 'Not provided'}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.info}>
          Seats: {item.numberOfSeats}
        </Text>

        <Text style={styles.total}>
          Total: Rs. {item.totalPrice}
        </Text>

        <Text style={styles.info}>
          Booking Date: {item.bookingDate}
        </Text>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>
            Status:
          </Text>

          <Text
            style={[
              styles.status,
              item.status === 'CONFIRMED' && styles.confirmed,
              item.status === 'CANCELLED' && styles.cancelled,
              item.status === 'COMPLETED' && styles.completed,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5B5FEF" />

        <Text style={styles.loadingText}>
          Loading bookings...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>
          Back
        </Text>
      </Pressable>

      <Text style={styles.title}>
        Event Bookings
      </Text>

      {error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorTitle}>
            Failed to load bookings
          </Text>

          <Text style={styles.errorMessage}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => {
              void loadBookings();
            }}
          >
            <Text style={styles.retryButtonText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.emptyTitle}>
            No bookings yet
          </Text>

          <Text style={styles.emptyText}>
            There are no bookings for this event.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
    padding: 20,
    paddingTop: 50,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F8FC',
    padding: 20,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },

  backButtonText: {
    color: '#5B5FEF',
    fontSize: 15,
    fontWeight: '600',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },

  attendee: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },

  info: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },

  total: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  statusLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginRight: 8,
  },

  status: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '700',
  },

  confirmed: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },

  cancelled: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },

  completed: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },

  list: {
    paddingBottom: 20,
  },

  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  loadingText: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B91C1C',
    textAlign: 'center',
  },

  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#5B5FEF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 18,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
