import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

import { loginUser } from '@/services/api';
import { saveAuthSession } from '@/services/authStorage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert(
        'Missing information',
        'Please enter your email and password.'
      );
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(
        email.trim(),
        password
      );

      await saveAuthSession(
        data.token,
        data.user
      );

      router.replace('/(tabs)/home');

    } catch (error) {
      Alert.alert(
        'Login failed',
        error instanceof Error
          ? error.message
          : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>EventHub</Text>

      <Text style={styles.title}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Login to discover and book events
      </Text>

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
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/register')}
      >
        <Text style={styles.registerText}>
          Don't have an account?{' '}
          <Text style={styles.link}>
            Create Account
          </Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    padding: 24,
  },

  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#5B5FEF',
    textAlign: 'center',
    marginBottom: 30,
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

  registerText: {
    textAlign: 'center',
    color: '#6B7280',
  },

  link: {
    color: '#5B5FEF',
    fontWeight: '700',
  },
});