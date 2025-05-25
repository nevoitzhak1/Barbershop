import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [identifier, setIdentifier] = useState(""); // טלפון או מייל
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStoredCredentials = async () => {
      try {
        const storedIdentifier = await AsyncStorage.getItem("user_identifier");
        const storedPassword = await AsyncStorage.getItem("user_password");

        if (storedIdentifier && storedPassword) {
          setIdentifier(storedIdentifier);
          setPassword(storedPassword);
          setRememberMe(true);
        }
      } catch (e) {
        console.log("Failed to load user credentials:", e);
      }
    };

    loadStoredCredentials();
  }, []);

  const handleLogin = async () => {
    const isValid =
      (identifier.includes("@") && password.length >= 4) || // מייל
      (/^\d{9,10}$/.test(identifier) && password.length >= 4); // טלפון

    if (!isValid) {
      setError("פרטים לא תקינים");
      return;
    }

    if (rememberMe) {
      await AsyncStorage.setItem("user_identifier", identifier);
      await AsyncStorage.setItem("user_password", password);
    } else {
      await AsyncStorage.removeItem("user_identifier");
      await AsyncStorage.removeItem("user_password");
    }

    console.log("✅ התחברות משתמש:", identifier);
    navigation.navigate("UserHomeScreen"); // ודא שהמסך קיים
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>התחברות</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>טלפון / מייל:</Text>
          <TextInput
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>סיסמה:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.rememberContainer}>
          <Text style={styles.label}>זכור אותי</Text>
          <Switch value={rememberMe} onValueChange={setRememberMe} />
        </View>

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <Button title="התחבר" onPress={handleLogin} />

        <View style={{ marginTop: 20 }}>
          <Button
            title="עדיין אין לך חשבון? הירשם"
            onPress={() => navigation.navigate("Register")}
          />
        </View>
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
  rememberContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  error: {
    color: "red",
    textAlign: "right",
    marginBottom: 10,
  },
});
