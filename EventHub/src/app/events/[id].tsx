import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    Pressable,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { events } from '@/data/events';

export default function EventDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const event = events.find((item) => item.id === id);

    if (!event) {
        return (
            <View style={styles.notFound}>
                <Ionicons name="alert-circle-outline" size={50} color="#9CA3AF" />

                <Text style={styles.notFoundTitle}>Event not found</Text>

                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: event.image }}
                    style={styles.image}
                />

                <Pressable
                    style={styles.backIcon}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </Pressable>
            </View>

            <View style={styles.content}>
                <View style={styles.categoryContainer}>
                    <Text style={styles.category}>{event.category}</Text>
                </View>

                <Text style={styles.title}>{event.name}</Text>

                <View style={styles.infoRow}>
                    <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#5B5FEF"
                    />

                    <View>
                        <Text style={styles.infoLabel}>Date & Time</Text>
                        <Text style={styles.infoText}>
                            {event.date} • {event.time}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons
                        name="location-outline"
                        size={20}
                        color="#5B5FEF"
                    />

                    <View>
                        <Text style={styles.infoLabel}>Location</Text>
                        <Text style={styles.infoText}>
                            {event.location}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons
                        name="ticket-outline"
                        size={20}
                        color="#5B5FEF"
                    />

                    <View>
                        <Text style={styles.infoLabel}>Availability</Text>
                        <Text style={styles.infoText}>
                            {event.availableSeats} seats available
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>About this event</Text>

                <Text style={styles.description}>
                    {event.description}
                </Text>

                <View style={styles.bottomSection}>
                    <View>
                        <Text style={styles.priceLabel}>Price</Text>
                        <Text style={styles.price}>
                            Rs. {event.price.toLocaleString()}
                        </Text>
                    </View>

                    <Pressable
                        style={styles.bookButton}
                        onPress={() => {
                            router.push({
                                pathname: '/booking/[id]',
                                params: {
                                    id: event.id,
                                },
                            });
                        }}
                    >
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    imageContainer: {
        position: 'relative',
    },

    image: {
        width: '100%',
        height: 280,
    },

    backIcon: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    content: {
        padding: 20,
    },

    categoryContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },

    category: {
        color: '#5B5FEF',
        fontWeight: '600',
        fontSize: 13,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 24,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        gap: 12,
    },

    infoLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },

    infoText: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '500',
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginTop: 12,
        marginBottom: 8,
    },

    description: {
        fontSize: 15,
        lineHeight: 23,
        color: '#4B5563',
    },

    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },

    priceLabel: {
        fontSize: 12,
        color: '#6B7280',
    },

    price: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
    },

    bookButton: {
        backgroundColor: '#5B5FEF',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },

    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    notFoundTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 12,
        marginBottom: 20,
    },

    backButton: {
        backgroundColor: '#5B5FEF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
    },

    backButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});