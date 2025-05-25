import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (method === "phone") {
      if (!input.match(/^05\d{8}$/)) {
        setError("מספר טלפון לא תקין");
        return;
      }
    } else {
      if (!input.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError("כתובת מייל לא תקינה");
        return;
      }
    }

    setError("");
    console.log(`מתחבר עם ${method === "phone" ? "טלפון" : "מייל"}:`, input);
    // TODO: המשך תהליך התחברות
  };

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>התחברות</Text>

          <View style={styles.methodSwitch}>
            <TouchableOpacity
              style={[
                styles.switchButton,
                method === "phone" && styles.activeSwitch,
              ]}
              onPress={() => setMethod("phone")}
            >
              <Text>טלפון</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchButton,
                method === "email" && styles.activeSwitch,
              ]}
              onPress={() => setMethod("email")}
            >
              <Text>אימייל</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {method === "phone" ? "מספר טלפון:" : "כתובת אימייל:"}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType={method === "phone" ? "phone-pad" : "email-address"}
              onChangeText={setInput}
              value={input}
              autoCapitalize="none"
            />
            {error !== "" && <Text style={styles.error}>{error}</Text>}
          </View>

          <Button title="התחבר" onPress={handleLogin} />

          <TouchableOpacity onPress={goToRegister} style={styles.registerLink}>
            <Text style={{ color: "#2196F3" }}>אין לך חשבון? הרשם עכשיו</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AdminLogin")}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: "#888", textAlign: "center" }}>אני מנהל</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
    direction: "rtl",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 30,
  },
  methodSwitch: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    marginBottom: 20,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  activeSwitch: {
    backgroundColor: "#add8e6",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    textAlign: "right",
    marginBottom: 5,
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
    marginTop: 5,
    textAlign: "right",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
});
