import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function BookAppointmentScreen() {
  const [availableHours, setAvailableHours] = useState<{
    [day: string]: string[];
  }>({});
  const [loading, setLoading] = useState(true);
  const barberUsername = "Admin"; // בהמשך נוכל לשנות את זה לפי ספר

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const ref = doc(db, "workHours", barberUsername);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setAvailableHours(data.hours || {});
        } else {
          console.log("📭 אין שעות פנויות לספר זה");
          setAvailableHours({});
        }
      } catch (err) {
        console.error("שגיאה בטעינת השעות:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, []);

  const handleSelect = (day: string, hour: string) => {
    Alert.alert("אישור תור", `לקבוע תור ליום ${day} בשעה ${hour}?`, [
      {
        text: "ביטול",
        style: "cancel",
      },
      {
        text: "אישור",
        onPress: () => {
          console.log(`📅 תור נקבע: ${day} ${hour}`);
          // כאן תוכל לשמור את התור במסד נתונים בהמשך
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>קביעת תור</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : Object.keys(availableHours).length === 0 ? (
          <Text style={styles.noData}>אין שעות פנויות</Text>
        ) : (
          Object.entries(availableHours).map(([day, hours]) => (
            <View key={day} style={styles.daySection}>
              <Text style={styles.dayTitle}>{day}</Text>
              <View style={styles.hoursGrid}>
                {hours.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={styles.hourBox}
                    onPress={() => handleSelect(day, hour)}
                  >
                    <Text style={styles.hourText}>{hour}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
  },
  noData: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
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
    borderColor: "#2196F3",
    margin: 4,
  },
  hourText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
});
