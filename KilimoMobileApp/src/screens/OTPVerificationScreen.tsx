import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AuthService } from "../services";
import { formatErrorMessage, maskEmail } from "../utils";

interface OTPVerificationScreenProps {
  email?: string;
  mode?: "login" | "signup";
  onBack?: () => void;
  onVerifySuccess?: () => void;
}

export default function OTPVerificationScreen({
  email = "farm***@gmail.com",
  mode = "signup",
  onBack,
  onVerifySuccess,
}: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChangeText = (text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await AuthService.verifyOTP({
        email,
        otp: otpCode,
      });

      if (response.success) {
        Alert.alert(
          "Success!",
          mode === "login"
            ? "Login successful! Welcome back."
            : "Account verified successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                if (onVerifySuccess) {
                  onVerifySuccess();
                }
              },
            },
          ],
        );
      }
    } catch (error) {
      Alert.alert("Verification Failed", formatErrorMessage(error));
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await AuthService.resendOTP(email);
      if (response.success) {
        Alert.alert(
          "Success",
          "A new verification code has been sent to your email.",
        );
        setTimer(60);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      Alert.alert("Error", formatErrorMessage(error));
    }
  };

  const handleNumberPress = (num: string) => {
    const emptyIndex = otp.findIndex((digit) => digit === "");
    if (emptyIndex !== -1) {
      handleChangeText(num, emptyIndex);
    }
  };

  const handleDelete = () => {
    const lastFilledIndex = otp
      .map((d, i) => (d ? i : -1))
      .filter((i) => i !== -1)
      .pop();
    if (lastFilledIndex !== undefined) {
      const newOtp = [...otp];
      newOtp[lastFilledIndex] = "";
      setOtp(newOtp);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Please enter the 6-digit verification code we've{"\n"}
          sent to your email{" "}
          <Text style={styles.emailText}>{maskEmail(email)}</Text>
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View key={index} style={styles.otpBoxWrapper}>
              <TextInput
                ref={(ref: TextInput | null) => {
                  inputRefs.current[index] = ref;
                  return undefined;
                }}
                style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                value={digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                textAlign="center"
              />
            </View>
          ))}
        </View>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend Code in {formatTime(timer)}
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            otp.every((d) => d) && !isVerifying
              ? styles.verifyButtonActive
              : styles.verifyButtonInactive,
          ]}
          onPress={handleVerify}
          disabled={!otp.every((d) => d) || isVerifying}
          activeOpacity={0.8}
        >
          {isVerifying ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.verifyButtonText}>Verifying...</Text>
            </View>
          ) : (
            <Text style={styles.verifyButtonText}>Verify & Proceed</Text>
          )}
        </TouchableOpacity>

        {/* Custom Number Pad */}
        <View style={styles.numberPad}>
          <View style={styles.numberRow}>
            {["1", "2", "3"].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numberButton}
                onPress={() => handleNumberPress(num)}
                activeOpacity={0.7}
              >
                <Text style={styles.numberText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.numberRow}>
            {["4", "5", "6"].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numberButton}
                onPress={() => handleNumberPress(num)}
                activeOpacity={0.7}
              >
                <Text style={styles.numberText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.numberRow}>
            {["7", "8", "9"].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numberButton}
                onPress={() => handleNumberPress(num)}
                activeOpacity={0.7}
              >
                <Text style={styles.numberText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.numberRow}>
            <View style={styles.numberButton} />
            <TouchableOpacity
              style={styles.numberButton}
              onPress={() => handleNumberPress("0")}
              activeOpacity={0.7}
            >
              <Text style={styles.numberText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberButton}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteIcon}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#757575",
    lineHeight: 22,
    marginBottom: 40,
  },
  emailText: {
    fontWeight: "700",
    color: "#000",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  otpBoxWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  otpBox: {
    width: "100%",
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "#fff",
  },
  otpBoxFilled: {
    borderColor: "#00E676",
    backgroundColor: "#F0FFF4",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  resendText: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 8,
  },
  timerText: {
    fontSize: 14,
    color: "#757575",
    fontWeight: "600",
  },
  resendLink: {
    fontSize: 14,
    color: "#00E676",
    fontWeight: "700",
  },
  verifyButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  verifyButtonActive: {
    backgroundColor: "#00E676",
    ...Platform.select({
      ios: {
        shadowColor: "#00E676",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  verifyButtonInactive: {
    backgroundColor: "#E0E0E0",
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  numberPad: {
    marginTop: "auto",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  numberRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  numberButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  numberText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#000",
  },
  deleteIcon: {
    fontSize: 28,
    color: "#FF3B30",
  },
});
