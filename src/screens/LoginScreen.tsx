import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isPhone = (value: string) => /^05\d{8}$/.test(value);

  const handleLogin = () => {
    if (isPhone(input) || isEmail(input)) {
      setError("");
      console.log("🔐 התחברות עם:", input);
      // כאן תוכל להוסיף שלב אימות אמיתי
      navigation.navigate("UserHomeScreen");
    } else {
      setError("יש להזין מייל תקין או מספר טלפון חוקי");
    }
  };

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  const goToAdminLogin = () => {
    navigation.navigate("AdminLogin");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>התחברות</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>מספר טלפון או מייל:</Text>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            keyboardType="default"
            autoCapitalize="none"
            placeholder="הכנס מייל או טלפון"
          />
        </View>

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.outlinedButton} onPress={handleLogin}>
          <Text style={styles.outlinedButtonText}>התחבר</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.outlinedButton, { marginTop: 10 }]}
          onPress={goToAdminLogin}
        >
          <Text style={styles.outlinedButtonText}>התחבר כמנהל</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToRegister}>
          <Text style={styles.linkText}>אין לך חשבון? הרשם כאן</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
    direction: "rtl",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    textAlign: "right",
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    textAlign: "right",
    marginBottom: 10,
  },
  outlinedButton: {
    borderWidth: 1.5,
    borderColor: "#2196F3",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  outlinedButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 20,
    color: "#2196F3",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
