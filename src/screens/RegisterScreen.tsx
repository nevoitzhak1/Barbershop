import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"זכר" | "נקבה" | "אחר" | null>(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleRegister = () => {
    const newErrors: string[] = [];

    if (!fullName || fullName.trim().length < 2) {
      newErrors.push("יש להזין שם מלא תקין");
    }

    if (!phone.match(/^05\d{8}$/)) {
      newErrors.push("מספר טלפון לא תקין (חייב להיות 10 ספרות ולהתחיל ב־05)");
    }

    if (!gender) {
      newErrors.push("יש לבחור מין");
    }

    if (!birthDate) {
      newErrors.push("יש לבחור תאריך לידה");
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.push("יש להזין כתובת אימייל תקינה");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    Alert.alert("נרשמת בהצלחה!");
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
          <Text style={styles.title}>הרשמה</Text>

          {errors.length > 0 && (
            <View style={styles.errorContainer}>
              {errors.map((err, index) => (
                <Text key={index} style={styles.errorText}>
                  • {err}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>שם מלא:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setFullName}
              value={fullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>מספר טלפון:</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              onChangeText={setPhone}
              value={phone}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>מין:</Text>
            <View style={styles.genderOptions}>
              {["זכר", "נקבה", "אחר"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderButton,
                    gender === option && styles.genderButtonSelected,
                  ]}
                  onPress={() => setGender(option as any)}
                >
                  <Text style={styles.genderText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>תאריך לידה:</Text>
            <TouchableOpacity
              onPress={() => setDatePickerVisibility(true)}
              style={styles.input}
            >
              <Text>
                {birthDate
                  ? birthDate.toLocaleDateString("he-IL")
                  : "בחר תאריך"}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              locale="he-IL"
              maximumDate={new Date()}
              date={birthDate || new Date()}
              onConfirm={(date) => {
                setBirthDate(date);
                setDatePickerVisibility(false);
              }}
              onCancel={() => setDatePickerVisibility(false)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>אימייל:</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
            />
          </View>

          <Button title="הרשם" onPress={handleRegister} />
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
  genderOptions: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  genderButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  genderButtonSelected: {
    backgroundColor: "#add8e6",
    borderColor: "#2196F3",
  },
  genderText: {
    fontSize: 16,
  },
  errorContainer: {
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    textAlign: "right",
    marginBottom: 3,
  },
});
