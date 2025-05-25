import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import ChangeAppointmentModal from "../../components/ChangeAppointmentModal";
import type { Appointment } from "../navigation/types"; // מסך בתוך screens/

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BarberHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, "barbers", "RomArlaki", "appointments")
      );
      const data: Appointment[] = [];
      querySnapshot.forEach((docSnap) => {
        const item = docSnap.data();
        data.push({
          id: docSnap.id,
          userId: item.userId,
          date: item.date,
          hour: item.hour,
          notes: item.notes || "",
        });
      });

      data.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.hour}`);
        const dateB = new Date(`${b.date}T${b.hour}`);
        return dateA.getTime() - dateB.getTime();
      });

      setAppointments(data);
    } catch (e) {
      console.error("שגיאה בטעינת התורים:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appt: Appointment) => {
    try {
      await deleteDoc(doc(db, "barbers", "RomArlaki", "appointments", appt.id));
      await deleteDoc(doc(db, "appointments", appt.userId));
      Alert.alert("❌ התור בוטל");
      fetchAppointments();
    } catch (e) {
      console.error("שגיאה בביטול תור:", e);
      Alert.alert("שגיאה בביטול תור");
    }
  };

  const openChangeModal = (appt: Appointment) => {
    setSelectedAppt(appt);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>מסך ספר</Text>

      <Text style={styles.sectionTitle}>📅 תורים קרובים:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : appointments.length === 0 ? (
        <Text style={styles.noAppointments}>אין תורים קרובים</Text>
      ) : (
        appointments.map((appt) => (
          <View key={appt.id} style={styles.appointment}>
            <Text style={styles.name}>{appt.userId}</Text>
            <Text>
              {appt.date} בשעה {appt.hour}
            </Text>
            {appt.notes && (
              <Text style={styles.notes}>הערות: {appt.notes}</Text>
            )}

            <View style={styles.appointmentButtons}>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => openChangeModal(appt)}
              >
                <Text style={styles.buttonText}>שנה</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancel(appt)}
              >
                <Text style={styles.buttonText}>בטל</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <ChangeAppointmentModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          fetchAppointments(); // רענון אחרי שינוי
        }}
        appointmentToChange={selectedAppt}
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("PublishHours")}
        >
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
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  notes: {
    marginTop: 4,
    color: "#444",
  },
  appointmentButtons: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 10,
  },
  changeButton: {
    backgroundColor: "#f0ad4e",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  cancelButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
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
