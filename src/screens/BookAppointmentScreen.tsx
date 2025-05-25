import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase"; // ודא שה־firebase מוגדר כראוי

const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "מוצ״ש"];

const generateHalfHourSlots = (day: string) => {
  const slots: string[] = [];
  let start = 9;
  let end = 22;

  if (day === "שישי") {
    end = 19;
  } else if (day === "מוצ״ש") {
    start = 18;
  }

  for (let hour = start; hour < end; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  slots.push(`${end}:00`);
  return slots;
};

export default function BookAppointmentScreen() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("user_name");
        if (storedName) {
          setUserName(storedName);
        }
      } catch (e) {
        console.log("שגיאה בשליפת שם המשתמש:", e);
      }
    };

    fetchUserName();
  }, []);

  const handleConfirm = async () => {
    if (!selectedDay || !selectedHour) {
      Alert.alert("שגיאה", "אנא בחר יום ושעה.");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        userName,
        day: selectedDay,
        hour: selectedHour,
        barber: "Admin", // ניתן לשנות בהתאם
        timestamp: new Date().toISOString(),
        status: "ממתין",
      });

      Alert.alert("הצלחה", "התור נקבע בהצלחה!");
      navigation.goBack();
    } catch (error) {
      console.error("שגיאה בשמירת התור:", error);
      Alert.alert("שגיאה", "אירעה שגיאה בעת קביעת התור.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>קביעת תור</Text>

        {DAYS.map((day) => {
          const hours = generateHalfHourSlots(day);
          return (
            <View key={day} style={styles.daySection}>
              <TouchableOpacity
                onPress={() =>
                  setSelectedDay((prev) => (prev === day ? null : day))
                }
              >
                <Text
                  style={[
                    styles.dayTitle,
                    selectedDay === day && styles.selectedDayTitle,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
              {selectedDay === day && (
                <View style={styles.hoursGrid}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.hourBox,
                        selectedHour === hour && styles.hourBoxSelected,
                      ]}
                      onPress={() =>
                        setSelectedHour((prev) => (prev === hour ? null : hour))
                      }
                    >
                      <Text
                        style={[
                          styles.hourText,
                          selectedHour === hour && styles.hourTextSelected,
                        ]}
                      >
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>אישור תור</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    direction: "rtl",
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  daySection: {
    marginBottom: 24,
  },
  dayTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  selectedDayTitle: {
    fontWeight: "bold",
    color: "#2196F3",
  },
  hoursGrid: {
    flexDirection: "row",
    flexWrap: "wrap-reverse",
    gap: 8,
  },
  hourBox: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 4,
  },
  hourBoxSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  hourText: {
    color: "#000",
  },
  hourTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
