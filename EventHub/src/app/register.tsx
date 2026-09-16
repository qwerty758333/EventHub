import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

import { registerUser } from '@/services/api';
import { saveAuthSession } from '@/services/authStorage';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      Alert.alert(
        'Missing information',
        'Please fill in all required fields.'
      );
      return;
    }

    if (!email.includes('@')) {
      Alert.alert(
        'Invalid email',
        'Please enter a valid email address.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Invalid password',
        'Password must be at least 6 characters.'
      );
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser(
        name.trim(),
        email.trim(),
        password,
        phone.trim()
      );

      await saveAuthSession(
        data.token,
        data.user
      );

      router.replace('/login');

    } catch (error) {
      Alert.alert(
        'Registration failed',
        error instanceof Error
          ? error.message
          : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        Create Account
      </Text>

      <Text style={styles.subtitle}>
        Join EventHub and discover exciting events
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? 'Creating Account...'
            : 'Create Account'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.back()}
      >
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.link}>
            Login
          </Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 30,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#5B5FEF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  loginText: {
    textAlign: 'center',
    color: '#6B7280',
  },

  link: {
    color: '#5B5FEF',
    fontWeight: '700',
  },
});