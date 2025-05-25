import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayRemove,
  collection,
  addDoc,
} from "firebase/firestore";

export default function BookAppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [userId, setUserId] = useState<string>("");

  const daysMap = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "מוצ״ש"];

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAvailableHours();
    }
  }, [selectedDate, userId]);

  const loadUser = async () => {
    const stored = await AsyncStorage.getItem("user_phone_or_email");
    if (stored) {
      setUserId(stored);
    }
  };

  const getDayName = (date: Date) => {
    const day = date.getDay(); // 0 = Sunday
    return daysMap[day];
  };

  const fetchAvailableHours = async () => {
    try {
      const docRef = doc(db, "publishedHours", "RomArlaki");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const dayName = getDayName(selectedDate);
        const hours = data[dayName] || [];
        setAvailableHours(hours);
        setSelectedHour(null);
      } else {
        setAvailableHours([]);
      }
    } catch (error) {
      console.error("שגיאה בשליפת שעות:", error);
    }
  };

  const handleBook = async () => {
    if (!selectedHour) {
      Alert.alert("בחר שעה לפני קביעת תור");
      return;
    }

    const dateKey = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD

    try {
      // 1. שמירה בתור האישי
      await setDoc(doc(db, "appointments", userId), {
        date: dateKey,
        hour: selectedHour,
        notes,
      });

      // 2. הוספה לספר
      await addDoc(collection(db, "barbers", "RomArlaki", "appointments"), {
        userId,
        date: dateKey,
        hour: selectedHour,
        notes,
      });

      // 3. הסרה מהשעות הפנויות
      const pubRef = doc(db, "publishedHours", "RomArlaki");
      const dayName = getDayName(selectedDate);
      await updateDoc(pubRef, {
        [dayName]: arrayRemove(selectedHour),
      });

      Alert.alert("✅ התור נקבע בהצלחה");
    } catch (e) {
      console.error("שגיאה בקביעת תור:", e);
      Alert.alert("שגיאה בקביעת תור");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>קביעת תור</Text>

        <Text style={styles.label}>בחר תאריך:</Text>
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, date) => {
            if (date) setSelectedDate(date);
          }}
          minimumDate={new Date()}
        />

        <Text style={[styles.label, { marginTop: 20 }]}>
          שעות זמינות ליום {getDayName(selectedDate)}:
        </Text>

        {availableHours.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            אין שעות זמינות ליום זה
          </Text>
        ) : (
          <ScrollView contentContainerStyle={styles.hoursContainer}>
            {availableHours.map((hour) => (
              <TouchableOpacity
                key={hour}
                style={[
                  styles.hourBox,
                  hour === selectedHour && styles.hourBoxSelected,
                ]}
                onPress={() => setSelectedHour(hour)}
              >
                <Text
                  style={[
                    styles.hourText,
                    hour === selectedHour && styles.hourTextSelected,
                  ]}
                >
                  {hour}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={[styles.label, { marginTop: 20 }]}>הערות לספר:</Text>
        <TextInput
          placeholder="לדוגמה: דירוג בצדדים קצר..."
          value={notes}
          onChangeText={setNotes}
          style={styles.notesInput}
          multiline
        />

        <TouchableOpacity style={styles.floatingButton} onPress={handleBook}>
          <Text style={styles.floatingButtonText}>קבע תור</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    direction: "rtl",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "right",
  },
  hoursContainer: {
    flexDirection: "row",
    flexWrap: "wrap-reverse",
    gap: 10,
    marginTop: 10,
    paddingBottom: 100,
  },
  hourBox: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
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
  notesInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    textAlignVertical: "top",
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
