import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";

const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "מוצ״ש"];

const generateHalfHourSlots = (day: string) => {
  const slots: string[] = [];
  let start = 9;
  let end = 22;

  if (day === "שישי") end = 19;
  if (day === "מוצ״ש") start = 18;

  for (let hour = start; hour < end; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  slots.push(`${end}:00`);
  return slots;
};

export default function PublishHoursScreen() {
  const [selected, setSelected] = useState<{ [day: string]: string[] }>({});
  const [adminUser, setAdminUser] = useState<string>("");

  const selectingRef = useRef<boolean>(false);
  const currentDayRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      const stored = await AsyncStorage.getItem("admin_username");
      if (stored) setAdminUser(stored);
    };
    fetchAdmin();
  }, []);

  const toggleHour = (day: string, hour: string) => {
    setSelected((prev) => {
      const hours = prev[day] || [];
      const exists = hours.includes(hour);
      return {
        ...prev,
        [day]: exists ? hours.filter((h) => h !== hour) : [...hours, hour],
      };
    });
  };

  const handlePublish = async () => {
    try {
      await setDoc(doc(db, "publishedHours", adminUser), selected);
      alert("✅ שעות פורסמו בהצלחה!");
    } catch (e) {
      console.error("שגיאה בפרסום השעות:", e);
      alert("שגיאה בפרסום השעות");
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        selectingRef.current = true;
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;

        const elements = document.elementsFromPoint?.(
          locationX,
          locationY
        ) as HTMLElement[];

        if (elements) {
          elements.forEach((el) => {
            const hour = el?.getAttribute?.("data-hour");
            const day = el?.getAttribute?.("data-day");
            if (hour && day && selectingRef.current) {
              toggleHour(day, hour);
            }
          });
        }
      },
      onPanResponderRelease: () => {
        selectingRef.current = false;
        currentDayRef.current = null;
      },
    })
  ).current;

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
                  <View style={styles.hoursGrid} {...panResponder.panHandlers}>
                    {hours.map((hour) => {
                      const isSelected = selected[day]?.includes(hour);
                      return (
                        <TouchableOpacity
                          key={hour}
                          onPress={() => toggleHour(day, hour)}
                          data-hour={hour}
                          data-day={day}
                          style={[
                            styles.hourBox,
                            isSelected && styles.hourBoxSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.hourText,
                              isSelected && styles.hourTextSelected,
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
