import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";

export default function BarberHomeScreen() {
  const upcomingAppointments = [
    { id: "1", name: "דני כהן", time: "10:30", date: "2025-05-26" },
    { id: "2", name: "נועה לוי", time: "12:00", date: "2025-05-26" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>מסך ספר</Text>

      <Text style={styles.sectionTitle}>📅 תורים קרובים:</Text>
      {upcomingAppointments.length === 0 ? (
        <Text style={styles.noAppointments}>אין תורים קרובים</Text>
      ) : (
        upcomingAppointments.map((appt) => (
          <View key={appt.id} style={styles.appointment}>
            <Text>{appt.name}</Text>
            <Text>
              {appt.date} בשעה {appt.time}
            </Text>
            <View style={styles.appointmentButtons}>
              <Button title="שנה" onPress={() => {}} />
              <Button title="בטל" onPress={() => {}} color="#d9534f" />
            </View>
          </View>
        ))
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>פרסם שעות</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>צפה בנתונים</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>רשימת הזמנות</Text>
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
  appointmentButtons: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 10,
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
