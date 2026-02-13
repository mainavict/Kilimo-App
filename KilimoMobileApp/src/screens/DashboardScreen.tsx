import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { StorageService } from "../services";

interface DashboardScreenProps {
  onLogout?: () => void;
}

export default function DashboardScreen({ onLogout }: DashboardScreenProps) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await StorageService.getUserData();
      if (user) {
        setUserName(user.fullName || user.email || "User");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await StorageService.removeTokens();
            await StorageService.removeUserData();
            if (onLogout) {
              onLogout();
            }
          } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Dashboard Cards */}
          <View style={styles.cardsContainer}>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>🌾</Text>
              </View>
              <Text style={styles.cardTitle}>My Farms</Text>
              <Text style={styles.cardDescription}>
                View and manage your farms
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>📊</Text>
              </View>
              <Text style={styles.cardTitle}>Analytics</Text>
              <Text style={styles.cardDescription}>
                Track your farm performance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>🌤️</Text>
              </View>
              <Text style={styles.cardTitle}>Weather</Text>
              <Text style={styles.cardDescription}>Check weather updates</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>💰</Text>
              </View>
              <Text style={styles.cardTitle}>Market Prices</Text>
              <Text style={styles.cardDescription}>
                View current market rates
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>📚</Text>
              </View>
              <Text style={styles.cardTitle}>Resources</Text>
              <Text style={styles.cardDescription}>Access farming guides</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>👤</Text>
              </View>
              <Text style={styles.cardTitle}>Profile</Text>
              <Text style={styles.cardDescription}>Manage your account</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Quick Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel}>Active Farms</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>5.2 Ha</Text>
                <Text style={styles.statLabel}>Total Area</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>85%</Text>
                <Text style={styles.statLabel}>Health Score</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: "#27ae60",
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#27ae60",
  },
  greeting: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  card: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    color: "#7f8c8d",
    lineHeight: 16,
  },
  statsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
  },
});
