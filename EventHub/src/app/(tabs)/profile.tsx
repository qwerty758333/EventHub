import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  getProfile,
  updateProfile,
} from '@/services/api';

import{ router } from 'expo-router';

import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from '@/services/authStorage';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const session = await getAuthSession();

      if (!session) {
        setError('Please login to view your profile.');
        return;
      }

      const profile = await getProfile(
        session.token
      );

      setName(profile.name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setRole(profile.role || '');
    } catch (error) {
      console.error(
        'Error loading profile:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load profile.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const session = await getAuthSession();

      if (!session) {
        setError('Please login to update your profile.');
        return;
      }

      const result = await updateProfile(
        session.token,
        name.trim(),
        phone.trim()
      );

      await saveAuthSession(
        session.token,
        result.user
      );

      setName(result.user.name || '');
      setPhone(result.user.phone || '');

      setMessage(
        'Profile updated successfully.'
      );
    } catch (error) {
      console.error(
        'Error updating profile:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to update profile.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await clearAuthSession();
    router.replace('/login');
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        My Profile
      </Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {name.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>

        <Text style={styles.name}>
          {name}
        </Text>

        <Text style={styles.role}>
          {role}
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>
            Name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            style={styles.input}
          />

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            value={email}
            editable={false}
            style={[
              styles.input,
              styles.disabledInput,
            ]}
          />

          <Text style={styles.label}>
            Phone
          </Text>

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            style={styles.input}
          />

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          {message ? (
            <Text style={styles.success}>
              {message}
            </Text>
          ) : null}

          <Pressable
            disabled={saving}
            style={[
              styles.saveButton,
              saving && styles.disabledButton,
            ]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </Pressable>
        </View>
      </View>
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

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5B5FEF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },

  role: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
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

  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },

  saveButton: {
    marginTop: 22,
    backgroundColor: '#5B5FEF',
    borderRadius: 10,
    paddingVertical: 13,
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

  logoutButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },

  logoutText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },

  error: {
    marginTop: 12,
    color: '#DC2626',
    fontSize: 14,
  },

  success: {
    marginTop: 12,
    color: '#15803D',
    fontSize: 14,
  },
});