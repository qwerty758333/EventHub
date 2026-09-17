import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getMyBookings, cancelBooking } from '@/services/api';
import { getAuthSession } from '@/services/authStorage';
import {
  requestNotificationPermission,
  sendLocalNotification,
} from '@/services/notificationService';
import type { Booking } from '@/types/booking';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null);
  const [bookingToCancel, setBookingToCancel] =
  useState<number | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      setError('');

      const session = await getAuthSession();

      if (!session) {
        setError('Please login to view your bookings.');
        return;
      }

      const data = await getMyBookings(session.token);

      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load bookings.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelBooking(bookingId: number) {
  try {
    setCancellingBookingId(bookingId);

    const session = await getAuthSession();

    if (!session) {
      setError('Please login to cancel a booking.');
      return;
    }

    await cancelBooking(
      session.token,
      bookingId
    );

    console.log(
      'Booking cancelled successfully:',
      bookingId
    );

    try {
      const permissionGranted =
        await requestNotificationPermission();

      if (permissionGranted) {
        await sendLocalNotification(
          'Booking Cancelled',
          'Your EventHub booking has been successfully cancelled.'
        );
      }
    } catch (notificationError) {
      console.error(
        'Notification error:',
        notificationError
      );
    }

    await loadBookings();

  } catch (error) {
    console.error(
      'Cancellation failed:',
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : 'Unable to cancel the booking.'
    );

  } finally {
    setCancellingBookingId(null);
  }
}

  function confirmCancelBooking(bookingId: number) {
  setBookingToCancel(bookingId);
}

  function renderBooking({ item }: { item: Booking }) {
    return (
      <View style={styles.card}>
        <Text style={styles.eventName}>
          {item.eventName}
        </Text>

        <Text style={styles.category}>
          {item.category}
        </Text>

        <Text style={styles.info}>
          📅 {item.date}
        </Text>

        <Text style={styles.info}>
          🕐 {item.time}
        </Text>

        <Text style={styles.info}>
          📍 {item.location}
        </Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>
            Seats
          </Text>

          <Text style={styles.value}>
            {item.numberOfSeats}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Total
          </Text>

          <Text style={styles.price}>
            Rs. {item.totalPrice}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.status}>
            {item.status}
          </Text>
        </View>
        {String(item.status).trim().toUpperCase() === 'CONFIRMED' && (
          <Pressable
            disabled={cancellingBookingId === item.id}
            hitSlop={8}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
              cancellingBookingId === item.id && styles.cancelButtonDisabled,
            ]}
            onPress={() => {
              console.log('Cancel button onPress fired:', item.id);
              confirmCancelBooking(item.id);
            }}
          >
            <Text style={styles.cancelButtonText}>
              {cancellingBookingId === item.id
                ? 'Cancelling...'
                : 'Cancel Booking'}
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading your bookings...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error}
        </Text>
      </View>
    );
  }

  return (
  <View style={styles.container}>
    <Text style={styles.title}>
      My Bookings
    </Text>

    {bookings.length === 0 ? (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>
          No bookings yet
        </Text>

        <Text style={styles.emptyText}>
          Your event bookings will appear here.
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

    <Modal
      visible={bookingToCancel !== null}
      transparent
      animationType="fade"
      onRequestClose={() => {
        setBookingToCancel(null);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>

          <Text style={styles.modalTitle}>
            Cancel Booking
          </Text>

          <Text style={styles.modalMessage}>
            Are you sure you want to cancel this booking?
          </Text>

          <View style={styles.modalButtons}>

            <Pressable
              style={styles.keepButton}
              onPress={() => {
                setBookingToCancel(null);
              }}
            >
              <Text style={styles.keepButtonText}>
                Keep Booking
              </Text>
            </Pressable>

            <Pressable
              style={styles.confirmCancelButton}
              onPress={() => {
                if (bookingToCancel !== null) {
                  const id = bookingToCancel;

                  setBookingToCancel(null);

                  void handleCancelBooking(id);
                }
              }}
            >
              <Text style={styles.confirmCancelButtonText}>
                Cancel Booking
              </Text>
            </Pressable>

          </View>

        </View>
      </View>
    </Modal>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
    padding: 20,
    paddingTop: 60,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F7F8FC',
  },

  loadingText: {
    marginTop: 10,
    color: '#6B7280',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  eventName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },

  category: {
    fontSize: 13,
    color: '#5B5FEF',
    fontWeight: '600',
    marginBottom: 14,
  },

  info: {
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  label: {
    fontSize: 15,
    color: '#6B7280',
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },

  statusContainer: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  status: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },

  error: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },

  cancelButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },

  cancelButtonPressed: {
    opacity: 0.7,
  },

  cancelButtonDisabled: {
    opacity: 0.5,
  },

  cancelButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },

  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 24,
},

modalCard: {
  width: '100%',
  maxWidth: 420,
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  padding: 24,
},

modalTitle: {
  fontSize: 22,
  fontWeight: '700',
  color: '#1F2937',
  marginBottom: 10,
},

modalMessage: {
  fontSize: 15,
  lineHeight: 22,
  color: '#6B7280',
  marginBottom: 24,
},

modalButtons: {
  flexDirection: 'row',
  gap: 10,
},

keepButton: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#D1D5DB',
  borderRadius: 10,
  paddingVertical: 12,
  alignItems: 'center',
},

keepButtonText: {
  fontSize: 14,
  fontWeight: '700',
  color: '#374151',
},

confirmCancelButton: {
  flex: 1,
  backgroundColor: '#DC2626',
  borderRadius: 10,
  paddingVertical: 12,
  alignItems: 'center',
},

confirmCancelButtonText: {
  fontSize: 14,
  fontWeight: '700',
  color: '#FFFFFF',
},
});