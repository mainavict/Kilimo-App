// src/screens/OTPScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { authService } from '../services/auth';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function OTPScreen() {
  const { userId, email } = useLocalSearchParams<{ userId: string; email: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
  const router = useRouter();

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOTP(userId!, otp);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔐 Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to {email}</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Expires in:</Text>
        <Text style={[styles.timer, timer < 30 && styles.timerWarning]}>
          {formatTime(timer)}
        </Text>
      </View>

      <TextInput
        style={styles.otpInput}
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="••••••"
        textAlign="center"
        autoFocus
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerify}
        disabled={loading || timer === 0}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      {timer === 0 && (
        <Text style={styles.expiredText}>
          OTP expired. Please log in again to request a new code.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f766e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  timerLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  timer: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f766e',
  },
  timerWarning: {
    color: '#dc2626',
  },
  otpInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 8,
    color: '#1e293b',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#0f766e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  expiredText: {
    textAlign: 'center',
    color: '#dc2626',
    fontSize: 14,
    marginTop: 16,
  },
});