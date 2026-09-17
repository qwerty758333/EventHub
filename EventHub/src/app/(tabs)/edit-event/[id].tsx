import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import { getEvent, updateEvent } from '@/services/api';
import { getAuthSession } from '@/services/authStorage';

export default function EditEventScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [totalSeats, setTotalSeats] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        void loadEvent();
    }, [id]);

    async function loadEvent() {
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
                setError('Unable to load this event.');
                return;
            }

            const event = await getEvent(
                eventId as unknown as string
            );

            setName(event.name);
            setDescription(event.description);
            setImage(event.image || '');
            setDate(event.date);
            setTime(event.time);
            setLocation(event.location);
            setCategory(event.category);
            setPrice(String(event.price));
            setTotalSeats(String(event.totalSeats));
        } catch (error) {
            console.error('Edit event load error:', error);

            setError(
                error instanceof Error
                    ? error.message
                    : 'Unable to load event.'
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateEvent() {
        setError('');

        if (
            !name.trim() ||
            !description.trim() ||
            !date.trim() ||
            !time.trim() ||
            !location.trim() ||
            !category.trim()
        ) {
            setError('Please fill in all required fields.');
            return;
        }

        const priceNumber = Number(price);
        const seatsNumber = Number(totalSeats);

        if (
            !price.trim() ||
            !Number.isFinite(priceNumber) ||
            priceNumber < 0
        ) {
            setError('Please enter a valid non-negative price.');
            return;
        }

        if (
            !totalSeats.trim() ||
            !Number.isInteger(seatsNumber) ||
            seatsNumber < 1
        ) {
            setError('Total seats must be a whole number greater than 0.');
            return;
        }

        const eventId = Number(id);

        if (!Number.isInteger(eventId)) {
            setError('Unable to update this event.');
            return;
        }

        try {
            setSaving(true);

            const session = await getAuthSession();

            if (!session) {
                router.replace('/login');
                return;
            }

            const eventData = {
                name: name.trim(),
                description: description.trim(),
                image: image.trim(),
                date: date.trim(),
                time: time.trim(),
                location: location.trim(),
                category: category.trim(),
                price: Number(price),
                totalSeats: Number(totalSeats),
            };

            await updateEvent(
                session.token,
                eventId,
                eventData
            );

            setSuccess(true);
        } catch (error) {
            console.error('Update event error:', error);

            setError(
                error instanceof Error
                    ? error.message
                    : 'Unable to update event.'
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#5B5FEF" />

                <Text style={styles.loadingText}>
                    Loading event...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Pressable
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={styles.backButtonText}>
                    Back
                </Text>
            </Pressable>

            <Text style={styles.title}>
                Edit Event
            </Text>

            <Text style={styles.subtitle}>
                Update your event details.
            </Text>

            <View style={styles.card}>
                {success ? (
                    <View style={styles.successBox}>
                        <Text style={styles.successTitle}>
                            Event Updated Successfully
                        </Text>

                        <Text style={styles.successText}>
                            Your event has been updated.
                        </Text>

                        <Pressable
                            style={styles.organizerButton}
                            onPress={() => {
                                router.replace('/(tabs)/organizer');
                            }}
                        >
                            <Text style={styles.organizerButtonText}>
                                Back to Organizer
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <>
                        {error ? (
                            <Text style={styles.error}>
                                {error}
                            </Text>
                        ) : null}

                        <Text style={styles.label}>
                            Event Name *
                        </Text>

                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g. Colombo Tech Conference"
                            style={styles.input}
                        />

                        <Text style={styles.label}>
                            Description *
                        </Text>

                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe your event"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            style={[styles.input, styles.textArea]}
                        />

                        <Text style={styles.label}>
                            Image URL
                        </Text>

                        <TextInput
                            value={image}
                            onChangeText={setImage}
                            placeholder="https://example.com/image.jpg"
                            autoCapitalize="none"
                            keyboardType="url"
                            style={styles.input}
                        />

                        <Text style={styles.label}>
                            Date *
                        </Text>

                        <TextInput
                            value={date}
                            onChangeText={setDate}
                            placeholder="2026-10-15"
                            style={styles.input}
                        />

                        <Text style={styles.label}>
                            Time *
                        </Text>

                        <TextInput
                            value={time}
                            onChangeText={setTime}
                            placeholder="10:00 AM"
                            style={styles.input}
                        />

                        <Text style={styles.label}>
                            Location *
                        </Text>

                        <TextInput
                            value={location}
                            onChangeText={setLocation}
                            placeholder="University of Colombo"
                            style={styles.input}
                        />

                        <Text style={styles.label}>
                            Category *
                        </Text>

                        <TextInput
                            value={category}
                            onChangeText={setCategory}
                            placeholder="Technology"
                            style={styles.input}
                        />

                        <Text style={styles.label}>
                            Price (Rs.) *
                        </Text>

                        <TextInput
                            value={price}
                            onChangeText={setPrice}
                            placeholder="2500"
                            keyboardType="numeric"
                            style={styles.input}
                        />

                        <Text style={styles.label}>
                            Total Seats *
                        </Text>

                        <TextInput
                            value={totalSeats}
                            onChangeText={setTotalSeats}
                            placeholder="100"
                            keyboardType="numeric"
                            style={styles.input}
                        />

                        <Pressable
                            disabled={saving}
                            style={[
                                styles.saveButton,
                                saving && styles.disabledButton,
                            ]}
                            onPress={() => {
                                void handleUpdateEvent();
                            }}
                        >
                            {saving ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.saveButtonText}>
                                    Save Changes
                                </Text>
                            )}
                        </Pressable>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FC',
    },

    content: {
        padding: 20,
        paddingTop: 50,
        paddingBottom: 40,
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
    },

    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        marginTop: 6,
        marginBottom: 20,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginTop: 12,
        marginBottom: 6,
    },

    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
        backgroundColor: '#FFFFFF',
    },

    textArea: {
        minHeight: 100,
    },

    saveButton: {
        marginTop: 24,
        backgroundColor: '#5B5FEF',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },

    disabledButton: {
        opacity: 0.6,
    },

    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },

    loadingText: {
        fontSize: 15,
        color: '#6B7280',
        marginTop: 12,
    },

    error: {
        backgroundColor: '#FEF2F2',
        borderRadius: 10,
        color: '#B91C1C',
        fontSize: 14,
        padding: 12,
        marginBottom: 8,
    },

    successBox: {
        backgroundColor: '#ECFDF5',
        borderRadius: 12,
        padding: 16,
    },

    successTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#166534',
    },

    successText: {
        fontSize: 14,
        color: '#166534',
        marginTop: 8,
    },

    organizerButton: {
        backgroundColor: '#5B5FEF',
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
        marginTop: 16,
    },

    organizerButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
