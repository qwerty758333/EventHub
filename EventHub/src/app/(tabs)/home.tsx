import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import{router} from 'expo-router';
import EventCard from '../../components/EventCard';
import { getEvents } from '@/services/api';
import type { Event } from '@/types/event';
import { events } from '@/data/events';

const categories = [
  'All',
  'Technology',
  'Music',
  'Business',
  'Sports',
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('All');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  loadEvents();
}, []);

async function loadEvents() {
  try {
    setLoading(true);
    setError('');

    const data = await getEvents();

    setEvents(data);
  } catch (error) {
    console.error('Error loading events:', error);
    setError('Unable to load events.');
  } finally {
    setLoading(false);
  }
}

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        event.location
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  if (loading) {
  return (
    <View style={styles.center}>
      <Text style={styles.loadingText}>
        Loading events...
      </Text>
    </View>
  );
}

    if (error) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>
        {error}
      </Text>

      <Pressable
        style={styles.retryButton}
        onPress={loadEvents}
      >
        <Text style={styles.retryText}>
          Try Again
        </Text>
      </Pressable>
    </View>
  );
}

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => {
  router.push({
    pathname: '/events/[id]',
    params: {
      id: item.id,
    },
  });
}}
          />
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.greeting}>
              Good morning 👋
            </Text>

            <Text style={styles.title}>
              Discover amazing events
            </Text>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search events..."
              placeholderTextColor="#9CA3AF"
              style={styles.search}
            />

            <Text style={styles.sectionTitle}>
              Categories
            </Text>

            <FlatList
              horizontal
              data={categories}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.categories}
              renderItem={({ item }) => {
                const selected =
                  selectedCategory === item;

                return (
                  <Text
                    onPress={() => {
                      setSelectedCategory(item);
                      setSearch('');
                    }}
                    style={[
                      styles.category,
                      selected &&
                        styles.categorySelected,
                    ]}
                  >
                    {item}
                  </Text>
                );
              }}
            />

            <Text style={styles.sectionTitle}>
              Popular Events
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No events found
            </Text>

            <Text style={styles.emptyText}>
              Try another search or category.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  greeting: {
    marginTop: 20,
    fontSize: 15,
    color: '#6B7280',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 4,
    marginBottom: 20,
  },

  search: {
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
  },

  categories: {
    gap: 10,
  },

  category: {
    backgroundColor: '#FFFFFF',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    fontWeight: '600',
  },

  categorySelected: {
    backgroundColor: '#5B5FEF',
    color: '#FFFFFF',
  },

  empty: {
    alignItems: 'center',
    paddingTop: 50,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  emptyText: {
    marginTop: 8,
    color: '#6B7280',
  },

  center: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},

loadingText: {
  fontSize: 16,
  color: '#6B7280',
},

errorText: {
  fontSize: 16,
  color: '#DC2626',
  marginBottom: 15,
},

retryButton: {
  backgroundColor: '#5B5FEF',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 10,
},

retryText: {
  color: '#FFFFFF',
  fontWeight: '600',
},
});