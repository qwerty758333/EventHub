import { useState } from 'react';
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

import { router } from 'expo-router';

import { createEvent } from '@/services/api';
import { getAuthSession } from '@/services/authStorage';

export default function CreateEventScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [totalSeats, setTotalSeats] = useState('');

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleCreateEvent() {
        if (
            !name.trim() ||
            !description.trim() ||
            !date.trim() ||
            !time.trim() ||
            !location.trim() ||
            !category.trim() ||
            !price.trim() ||
            !totalSeats.trim()
        ) {
            Alert.alert(
                'Missing Information',
                'Please fill in all required fields.'
            );

            return;
        }

        const priceNumber = Number(price);
        const seatsNumber = Number(totalSeats);

        if (Number.isNaN(priceNumber) || priceNumber < 0) {
            Alert.alert(
                'Invalid Price',
                'Please enter a valid price.'
            );

            return;
        }

        if (
            !Number.isInteger(seatsNumber) ||
            seatsNumber < 1
        ) {
            Alert.alert(
                'Invalid Seats',
                'Total seats must be at least 1.'
            );

            return;
        }

        try {
            setSaving(true);

            const session = await getAuthSession();

            if (!session) {
                Alert.alert(
                    'Login Required',
                    'Please login as an organizer.'
                );

                return;
            }

            await createEvent(
                session.token,
                {
                    name: name.trim(),
                    description: description.trim(),
                    image: image.trim(),
                    date: date.trim(),
                    time: time.trim(),
                    location: location.trim(),
                    category: category.trim(),
                    price: priceNumber,
                    totalSeats: seatsNumber,
                }
            );

            setSuccess(true);

            setName('');
            setDescription('');
            setImage('');
            setDate('');
            setTime('');
            setLocation('');
            setCategory('');
            setPrice('');
            setTotalSeats('');

            Alert.alert(
                'Event Created',
                'Your event has been created successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.replace('/(tabs)/organizer');
                        },
                    },
                ]
            );

        } catch (error) {
            console.error(
                'Create event error:',
                error
            );

            Alert.alert(
                'Creation Failed',
                error instanceof Error
                    ? error.message
                    : 'Unable to create event.'
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>
                Create Event
            </Text>

            <Text style={styles.subtitle}>
                Add a new event for students to discover.
            </Text>

            <View style={styles.card}>

                {success ? (
                    <View style={styles.successBox}>
                        <Text style={styles.successTitle}>
                            Event Created Successfully
                        </Text>

                        <Text style={styles.successText}>
                            Your event has been added to EventHub.
                        </Text>

                        <Pressable
                            style={styles.viewEventsButton}
                            onPress={() => {
                                router.replace('/(tabs)/organizer');
                            }}
                        >
                            <Text style={styles.viewEventsButtonText}>
                                Back to Organizer
                            </Text>
                        </Pressable>
                    </View>
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
                    style={[
                        styles.input,
                        styles.textArea,
                    ]}
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
                        styles.createButton,
                        saving && styles.disabledButton,
                    ]}
                    onPress={handleCreateEvent}
                >
                    {saving ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.createButtonText}>
                            Create Event
                        </Text>
                    )}
                </Pressable>

                <Pressable
                    disabled={saving}
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>
                        Cancel
                    </Text>
                </Pressable>
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
        paddingTop: 60,
        paddingBottom: 40,
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

    createButton: {
        marginTop: 24,
        backgroundColor: '#5B5FEF',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },

    disabledButton: {
        opacity: 0.6,
    },

    createButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },

    cancelButton: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
    },

    cancelButtonText: {
        color: '#374151',
        fontSize: 15,
        fontWeight: '600',
    },

    successBox: {
        backgroundColor: '#ECFDF5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 18,
    },

    successTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#166534',
    },

    successText: {
        fontSize: 14,
        color: '#15803D',
        marginTop: 4,
        marginBottom: 14,
    },

    viewEventsButton: {
        backgroundColor: '#166534',
        borderRadius: 10,
        paddingVertical: 11,
        alignItems: 'center',
    },

    viewEventsButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});