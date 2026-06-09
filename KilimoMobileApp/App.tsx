import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import {
  LoginScreen,
  SignupScreen,
  OTPVerificationScreen,
  FormScreen,
  DashboardScreen,
} from "./src/screens";

const { width, height } = Dimensions.get("window");

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "landing" | "login" | "signup" | "otp" | "form" | "dashboard"
  >("landing");
  const [userEmail, setUserEmail] = useState("");
  const [otpMode, setOtpMode] = useState<"login" | "signup">("signup");

  // Screen Navigation
  if (currentScreen === "login") {
    return (
      <LoginScreen
        onBack={() => setCurrentScreen("landing")}
        onNavigateSignup={() => setCurrentScreen("signup")}
        onNavigateOTP={(email) => {
          setUserEmail(email);
          setOtpMode("login");
          setCurrentScreen("otp");
        }}
      />
    );
  }

  if (currentScreen === "signup") {
    return (
      <SignupScreen
        onBack={() => setCurrentScreen("landing")}
        onNavigateLogin={() => setCurrentScreen("login")}
        onNavigateOTP={(email) => {
          setUserEmail(email);
          setOtpMode("signup");
          setCurrentScreen("otp");
        }}
      />
    );
  }

  if (currentScreen === "otp") {
    return (
      <OTPVerificationScreen
        email={userEmail}
        mode={otpMode}
        onBack={() =>
          setCurrentScreen(otpMode === "login" ? "login" : "signup")
        }
        onVerifySuccess={() => {
          console.log(
            `${otpMode === "login" ? "Login" : "Signup"} OTP Verified Successfully!`,
          );
          // Navigate to dashboard
          setCurrentScreen("dashboard");
        }}
      />
    );
  }

  if (currentScreen === "form") {
    return (
      <FormScreen
        onBack={() => setCurrentScreen("landing")}
        onSubmitSuccess={() => {
          console.log("Form submitted successfully!");
          setCurrentScreen("landing");
        }}
      />
    );
  }

  if (currentScreen === "dashboard") {
    return (
      <DashboardScreen
        onLogout={() => {
          console.log("User logged out");
          setCurrentScreen("landing");
        }}
      />
    );
  }

  // Landing Page
  return (
    <ImageBackground
      source={require("./assets/maize farm.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🌾</Text>
              <Text style={styles.logo}>KILIMO</Text>
            </View>
            <View style={styles.taglineContainer}>
              <Text style={styles.tagline}>Smart Farming Solutions</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <View style={styles.heroSection}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.appName}>Kilimo</Text>
              <View style={styles.divider} />
              <Text style={styles.description}>
                Your digital companion for modern agriculture.{"\n"}
                Manage your farm, track crops, and grow smarter.
              </Text>
            </View>

            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>📊</Text>
                </View>
                <Text style={styles.featureTitle}>Track</Text>
                <Text style={styles.featureText}>Monitor Progress</Text>
              </View>
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>🌱</Text>
                </View>
                <Text style={styles.featureTitle}>Manage</Text>
                <Text style={styles.featureText}>Crop Control</Text>
              </View>
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>💡</Text>
                </View>
                <Text style={styles.featureTitle}>Insights</Text>
                <Text style={styles.featureText}>Smart Analytics</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => setCurrentScreen("signup")}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Text style={styles.buttonSubtext}>Create your account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.8}
              onPress={() => setCurrentScreen("login")}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => setCurrentScreen("form")}
            >
              <Text style={styles.linkButtonText}>Learn More →</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🌍 Empowering farmers across the globe
            </Text>
          </View>
        </View>
      </View>
      <StatusBar style="light" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoEmoji: {
    fontSize: 40,
    marginRight: 10,
  },
  logo: {
    fontSize: 40,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 4,
  },
  taglineContainer: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  tagline: {
    fontSize: 12,
    color: "#fff",
    letterSpacing: 2.5,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
    fontWeight: "400",
    letterSpacing: 1,
  },
  appName: {
    fontSize: 64,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 20,
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  divider: {
    width: 80,
    height: 5,
    backgroundColor: "#4CAF50",
    borderRadius: 3,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "400",
    paddingHorizontal: 20,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  featuresGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 10,
  },
  featureCard: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 16,
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  featureIcon: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  featureText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 0,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 14,
    width: "100%",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  buttonSubtext: {
    color: "rgba(255, 255, 255, 0.95)",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: "rgba(255, 255, 255, 0.8)",
    width: "100%",
    alignItems: "center",
    marginBottom: 14,
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  linkButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  linkButtonText: {
    color: "rgba(255, 255, 255, 0.95)",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: "center",
    paddingTop: 10,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
});
