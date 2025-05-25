import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function UserHomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  // בהמשך נחליף את זה בנתונים אמיתיים מ־Firebase
  const upcomingAppointments: { id: string; date: string; time: string }[] = [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ברוך הבא</Text>

      <Text style={styles.sectionTitle}>📅 תורים עתידיים:</Text>
      {upcomingAppointments.length === 0 ? (
        <Text style={styles.noAppointments}>אין תורים עתידיים</Text>
      ) : (
        upcomingAppointments.map((appt) => (
          <View key={appt.id} style={styles.appointment}>
            <Text>
              {appt.date} בשעה {appt.time}
            </Text>
            {/* כאן נוסיף אפשרות לבטל/לשנות */}
          </View>
        ))
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("BookAppointment")}
        >
          <Text style={styles.actionText}>קביעת תור</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  noAppointments: {
    textAlign: "center",
    color: "#888",
    marginBottom: 20,
  },
  appointment: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  actions: {
    marginTop: 30,
  },
  actionButton: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  actionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
