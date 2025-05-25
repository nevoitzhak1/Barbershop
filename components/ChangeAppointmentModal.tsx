import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { db } from "../src/firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import type { Appointment } from "../src/navigation/types"; // מסך בתוך screens/

interface Props {
  visible: boolean;
  onClose: () => void;
  appointmentToChange: Appointment | null;
}

export default function ChangeAppointmentModal({
  visible,
  onClose,
  appointmentToChange,
}: Props) {
  const [availableAppointments, setAvailableAppointments] = useState<{
    [date: string]: string[];
  }>({});

  const [selectedNewSlot, setSelectedNewSlot] = useState<{
    date: string;
    hour: string;
  } | null>(null);

  useEffect(() => {
    const fetchAvailable = async () => {
      const ref = collection(db, "barbers", "RomArlaki", "availableHours");
      const snap = await getDocs(ref);
      const hours: { [date: string]: string[] } = {};
      snap.forEach((doc) => {
        hours[doc.id] = doc.data().hours;
      });
      setAvailableAppointments(hours);
    };

    if (visible) fetchAvailable();
  }, [visible]);

  const handleReplace = async () => {
    if (!selectedNewSlot || !appointmentToChange) return;

    const oldRef = doc(
      db,
      "barbers",
      "RomArlaki",
      "appointments",
      `${appointmentToChange.date}_${appointmentToChange.hour}`
    );

    const newRef = doc(
      db,
      "barbers",
      "RomArlaki",
      "appointments",
      `${selectedNewSlot.date}_${selectedNewSlot.hour}`
    );

    // העתקה לתור החדש
    await setDoc(newRef, appointmentToChange);
    await deleteDoc(oldRef);

    Alert.alert(
      "הצלחה",
      "התור הועבר. האם לקבוע למשתמש המקורי תור חדש או לבטל?",
      [
        {
          text: "קבע תור חדש",
          onPress: () => {
            setSelectedNewSlot(null);
            onClose();
            // כאן אפשר לפתוח ממשק קביעת תור חדש ל־Y
          },
        },
        {
          text: "בטל את התור",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(
              doc(db, "appointments", appointmentToChange.userId)
            );
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>בחר תור להחלפה</Text>
          <ScrollView>
            {Object.entries(availableAppointments).map(([date, hours]) => (
              <View key={date}>
                <Text style={styles.date}>{date}</Text>
                <View style={styles.hourList}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.hourBox,
                        selectedNewSlot?.date === date &&
                          selectedNewSlot?.hour === hour && {
                            backgroundColor: "#2196F3",
                          },
                      ]}
                      onPress={() => setSelectedNewSlot({ date, hour })}
                    >
                      <Text
                        style={{
                          color:
                            selectedNewSlot?.date === date &&
                            selectedNewSlot?.hour === hour
                              ? "#fff"
                              : "#000",
                        }}
                      >
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleReplace}
          >
            <Text style={styles.confirmText}>בצע החלפה</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>סגור</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "90%",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  date: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  hourList: {
    flexDirection: "row",
    flexWrap: "wrap-reverse",
    gap: 6,
  },
  hourBox: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    borderRadius: 5,
    margin: 4,
  },
  confirmButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  confirmText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 10,
    marginTop: 10,
  },
  cancelText: {
    textAlign: "center",
    color: "#444",
  },
});
