import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "מוצ״ש"];

const generateHalfHourSlots = (day: string) => {
  const slots: string[] = [];
  let start = 9;
  let end = 22;

  if (day === "שישי") end = 19;
  else if (day === "מוצ״ש") start = 18;

  for (let hour = start; hour < end; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  slots.push(`${end}:00`);
  return slots;
};

export default function PublishHoursScreen() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<{ [day: string]: string[] }>({});

  const toggleSlot = (day: string, hour: string) => {
    setSelected((prev) => {
      const daySlots = prev[day] || [];
      const exists = daySlots.includes(hour);
      return {
        ...prev,
        [day]: exists
          ? daySlots.filter((h) => h !== hour)
          : [...daySlots, hour],
      };
    });
  };

  const handlePublish = async () => {
    try {
      const admin = await AsyncStorage.getItem("logged_admin");
      if (!admin) {
        alert("⚠️ לא נמצא שם משתמש מחובר");
        return;
      }

      await setDoc(doc(db, "workHours", admin), {
        hours: selected,
        timestamp: new Date().toISOString(),
      });

      console.log("📆 שעות נשמרו בהצלחה");
      alert("✅ שעות פורסמו בהצלחה");
    } catch (error) {
      console.error("❌ שגיאה בשמירת שעות:", error);
      alert("שגיאה בשמירה ל־Firebase");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
          >
            <Text style={styles.title}>פרסום שעות עבודה</Text>

            {DAYS.map((day) => {
              const hours = generateHalfHourSlots(day);
              return (
                <View key={day} style={styles.daySection}>
                  <Text style={styles.dayTitle}>{day}</Text>
                  <View style={styles.hoursGrid}>
                    {hours.map((hour) => {
                      const selectedForDay = selected[day]?.includes(hour);
                      return (
                        <TouchableOpacity
                          key={hour}
                          style={[
                            styles.hourBox,
                            selectedForDay && styles.hourBoxSelected,
                          ]}
                          onPress={() => toggleSlot(day, hour)}
                        >
                          <Text
                            style={[
                              styles.hourText,
                              selectedForDay && styles.hourTextSelected,
                            ]}
                          >
                            {hour}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handlePublish}
          >
            <Text style={styles.floatingButtonText}>פרסם שעות</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    direction: "rtl",
    backgroundColor: "#fff",
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
  floatingButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
