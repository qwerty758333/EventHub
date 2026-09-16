import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Event } from '../types/event';

type EventCardProps = {
  event: Event;
  onPress: () => void;
};

export default function EventCard({
  event,
  onPress,
}: EventCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: event.image }}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>
            {event.category}
          </Text>
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {event.name}
        </Text>

        <Text style={styles.info}>
          📅 {event.date} • {event.time}
        </Text>

        <Text style={styles.info}>
          📍 {event.location}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>
            Rs. {event.price.toLocaleString()}
          </Text>

          <Text style={styles.seats}>
            {event.availableSeats} seats left
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  image: {
    width: '100%',
    height: 180,
  },

  content: {
    padding: 16,
  },

  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },

  category: {
    color: '#5B5FEF',
    fontSize: 12,
    fontWeight: '700',
  },

  name: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },

  info: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 5,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  price: {
    fontSize: 17,
    fontWeight: '800',
    color: '#5B5FEF',
  },

  seats: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
  },
});