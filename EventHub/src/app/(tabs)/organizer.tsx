import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { deleteEvent, getMyEvents } from '@/services/api';
import { getAuthSession } from '@/services/authStorage';
import type { Event } from '@/types/event';

export default function OrganizerScreen() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
  
    useEffect(() => {
      void loadEvents();
    }, []);
  
    async function loadEvents(isRefreshing = false) {
      try {
        if (isRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
  
        setError('');
  
        const session = await getAuthSession();
  
        if (!session) {
          setError('Please login as an organizer.');
          return;
        }
  
        const data = await getMyEvents(session.token);
  
        setEvents(data);
      } catch (error) {
        console.error('Error loading organizer events:', error);
  
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load your events.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }

    async function handleDeleteEvent() {
      if (deleteId === null) {
        return;
      }

      try {
        setDeleting(true);

        const session = await getAuthSession();

        if (!session) {
          setDeleteId(null);
          router.replace('/login');
          return;
        }

        await deleteEvent(session.token, deleteId);

        setDeleteId(null);
        await loadEvents();
      } catch (error) {
        console.error('Error deleting organizer event:', error);

        setDeleteId(null);
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to delete event.'
        );
      } finally {
        setDeleting(false);
      }
    }
  
    function renderEvent({ item }: { item: Event }) {
      return (
        <View style={styles.card}>
          <Text style={styles.eventName}>
            {item.name}
          </Text>
  
          <Text style={styles.category}>
            {item.category}
          </Text>
  
          <Text style={styles.info}>
            {'\uD83D\uDCC5'} {item.date}
          </Text>
  
          <Text style={styles.info}>
            {'\uD83D\uDD50'} {item.time}
          </Text>
  
          <Text style={styles.info}>
            {'\uD83D\uDCCD'} {item.location}
          </Text>
  
          <View style={styles.divider} />
  
          <Text style={styles.price}>
            Rs. {item.price}
          </Text>
  
          <Text style={styles.seats}>
            {item.availableSeats} / {item.totalSeats} seats available
          </Text>

          <View style={styles.actionButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.editButtonPressed,
              ]}
              onPress={() => {
                router.push({
                  pathname: '/(tabs)/edit-event/[id]' as any,
                  params: {
                    id: item.id.toString(),
                  },
                });
              }}
            >
              <Text style={styles.editButtonText}>
                Edit
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.deleteButtonPressed,
              ]}
              onPress={() => {
                setDeleteId(Number(item.id));
              }}
            >
              <Text style={styles.deleteButtonText}>
                Delete
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.bookingsButton,
              pressed && styles.bookingsButtonPressed,
            ]}
            onPress={() => {
              router.push({
                pathname: '/(tabs)/event-bookings/[id]',
                params: {
                  id: item.id.toString(),
                },
              });
            }}
          >
            <Text style={styles.bookingsButtonText}>
              View Bookings
            </Text>
          </Pressable>
        </View>
      );
    }
  
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#5B5FEF" />
  
          <Text style={styles.loadingText}>
            Loading your events...
          </Text>
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              My Events
            </Text>
  
            <Text style={styles.subtitle}>
              Manage the events you have created
            </Text>
          </View>
  
          <Pressable
            style={({ pressed }) => [
              styles.createButton,
              pressed && styles.createButtonPressed,
            ]}
            onPress={() => {
              router.push('/(tabs)/create-event');
            }}
          >
            <Text style={styles.createButtonText}>
              Create Event
            </Text>
          </Pressable>
        </View>
  
        {error ? (
          <View style={styles.messageContainer}>
            <Text style={styles.error}>
              {error}
            </Text>
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEvent}
            contentContainerStyle={
              events.length === 0
                ? styles.emptyList
                : styles.list
            }
            showsVerticalScrollIndicator={false}
            onRefresh={() => {
              void loadEvents(true);
            }}
            refreshing={refreshing}
            ListEmptyComponent={(
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>
                  You haven't created any events yet.
                </Text>
  
                <Text style={styles.emptyText}>
                  Create an event to see it listed here.
                </Text>
              </View>
            )}
          />
        )}
        <Modal
          visible={deleteId !== null}
          transparent
          animationType="fade"
          onRequestClose={() => {
            if (!deleting) {
              setDeleteId(null);
            }
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                Delete Event?
              </Text>

              <Text style={styles.modalMessage}>
                Are you sure you want to delete "{events.find(
                  (event) => Number(event.id) === deleteId
                )?.name}"?
              </Text>

              <Text style={styles.modalWarning}>
                This action cannot be undone.
              </Text>

              <View style={styles.modalButtons}>
                <Pressable
                  disabled={deleting}
                  style={styles.cancelDeleteButton}
                  onPress={() => {
                    setDeleteId(null);
                  }}
                >
                  <Text style={styles.cancelDeleteButtonText}>
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  disabled={deleting}
                  style={[
                    styles.confirmDeleteButton,
                    deleting && styles.disabledButton,
                  ]}
                  onPress={() => {
                    void handleDeleteEvent();
                  }}
                >
                  {deleting ? (
                    <Text style={styles.confirmDeleteButtonText}>
                      Deleting...
                    </Text>
                  ) : (
                    <Text style={styles.confirmDeleteButtonText}>
                      Delete
                    </Text>
                  )}
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
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F7F8FC',
      padding: 20,
    },
  
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
  
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: '#1F2937',
    },
  
    subtitle: {
      fontSize: 15,
      color: '#6B7280',
      marginTop: 6,
    },
  
    createButton: {
      backgroundColor: '#5B5FEF',
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 11,
      marginLeft: 12,
    },
  
    createButtonPressed: {
      opacity: 0.8,
    },
  
    createButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
  
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    },
  
    eventName: {
      fontSize: 19,
      fontWeight: '700',
      color: '#1F2937',
    },
  
    category: {
      fontSize: 14,
      color: '#5B5FEF',
      fontWeight: '600',
      marginTop: 6,
      marginBottom: 16,
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
  
    price: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1F2937',
    },
  
    seats: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 6,
    },

    editButton: {
      backgroundColor: '#5B5FEF',
      borderRadius: 10,
      alignItems: 'center',
      paddingVertical: 11,
      flex: 1,
    },

    editButtonPressed: {
      opacity: 0.8,
    },

    editButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },

    actionButtons: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 16,
    },

    deleteButton: {
      backgroundColor: '#DC2626',
      borderRadius: 10,
      alignItems: 'center',
      paddingVertical: 11,
      flex: 1,
    },

    deleteButtonPressed: {
      opacity: 0.8,
    },

    deleteButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },

    bookingsButton: {
      backgroundColor: '#EEF2FF',
      borderRadius: 10,
      alignItems: 'center',
      paddingVertical: 11,
      marginTop: 10,
    },

    bookingsButtonPressed: {
      opacity: 0.8,
    },

    bookingsButtonText: {
      color: '#4F46E5',
      fontSize: 14,
      fontWeight: '700',
    },
  
    list: {
      paddingBottom: 20,
    },
  
    emptyList: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingBottom: 20,
    },
  
    empty: {
      alignItems: 'center',
      paddingHorizontal: 20,
    },
  
    emptyTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: '#1F2937',
      textAlign: 'center',
    },
  
    emptyText: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 8,
      textAlign: 'center',
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
  
    error: {
      fontSize: 15,
      color: '#B91C1C',
      textAlign: 'center',
    },

    disabledButton: {
      opacity: 0.6,
    },

    modalOverlay: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      padding: 20,
    },

    modalCard: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
    },

    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1F2937',
    },

    modalMessage: {
      fontSize: 15,
      color: '#374151',
      marginTop: 14,
      lineHeight: 22,
    },

    modalWarning: {
      fontSize: 14,
      color: '#B91C1C',
      marginTop: 8,
    },

    modalButtons: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 22,
    },

    cancelDeleteButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 10,
      alignItems: 'center',
      paddingVertical: 12,
    },

    cancelDeleteButtonText: {
      color: '#374151',
      fontSize: 14,
      fontWeight: '600',
    },

    confirmDeleteButton: {
      flex: 1,
      backgroundColor: '#DC2626',
      borderRadius: 10,
      alignItems: 'center',
      paddingVertical: 12,
    },

    confirmDeleteButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
  });