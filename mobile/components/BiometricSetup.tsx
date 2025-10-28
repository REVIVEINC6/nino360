"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { Fingerprint } from "lucide-react-native"
import { isBiometricAvailable, enableBiometricAuth } from "../lib/auth/mobile-auth.service"

export function BiometricSetup() {
  const [available, setAvailable] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkBiometricAvailability()
  }, [])

  async function checkBiometricAvailability() {
    const isAvailable = await isBiometricAvailable()
    setAvailable(isAvailable)
  }

  async function handleEnableBiometric() {
    setLoading(true)
    try {
      const success = await enableBiometricAuth()

      if (success) {
        Alert.alert("Success", "Biometric authentication enabled")
      } else {
        Alert.alert("Error", "Failed to enable biometric authentication")
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!available) {
    return (
      <View style={styles.container}>
        <Text style={styles.unavailableText}>Biometric authentication is not available on this device</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Fingerprint size={64} color="#6366f1" />
      </View>

      <Text style={styles.title}>Enable Biometric Login</Text>
      <Text style={styles.description}>
        Use your fingerprint or face to quickly and securely sign in to your account
      </Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleEnableBiometric}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Setting up..." : "Enable Biometric Login"}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  unavailableText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
})
