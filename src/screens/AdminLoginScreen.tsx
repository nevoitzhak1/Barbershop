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

const adminCredentials = [
  { username: "Admin", password: "Zaq1Xsw2" },
  { username: "RomArlaki", password: "Rom1234" },
];

export default function AdminLoginScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStoredCredentials = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("admin_username");
        const storedPassword = await AsyncStorage.getItem("admin_password");

        if (storedUsername && storedPassword) {
          setUsername(storedUsername);
          setPassword(storedPassword);
          setRememberMe(true);
        }
      } catch (e) {
        console.log("Failed to load saved credentials:", e);
      }
    };

    loadStoredCredentials();
  }, []);

  // בתוך handleLogin – גרסה מלאה עם השינוי:
  const handleLogin = async () => {
    const matched = adminCredentials.find(
      (admin) => admin.username === username && admin.password === password
    );

    if (matched) {
      setError("");

      // 🟢 שמירת שם המנהל שהתחבר
      await AsyncStorage.setItem("logged_admin", username);

      if (rememberMe) {
        await AsyncStorage.setItem("admin_username", username);
        await AsyncStorage.setItem("admin_password", password);
      } else {
        await AsyncStorage.removeItem("admin_username");
        await AsyncStorage.removeItem("admin_password");
      }

      console.log("✅ התחברות כמנהל:", username);
      navigation.navigate("BarberHome");
    } else {
      setError("שם משתמש או סיסמה שגויים");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>התחברות למנהלים</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>שם משתמש:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
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
