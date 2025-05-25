import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { RootStackParamList } from "./types";
import AdminLoginScreen from "../screens/AdminLoginScreen";
import BarberHomeScreen from "../screens/BarberHomeScreen";
import PublishHoursScreen from "../screens/PublishHoursScreen";
import UserHomeScreen from "../screens/UserHomeScreen"; // ← דוגמה
import BookAppointmentScreen from "../screens/BookAppointmentScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "התחברות" }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "הרשמה" }}
      />
      <Stack.Screen
        name="AdminLogin"
        component={AdminLoginScreen}
        options={{ title: "התחברות למנהלים" }}
      />
      <Stack.Screen
        name="BarberHome"
        component={BarberHomeScreen}
        options={{ title: "דף הבית של הספר" }}
      />
      <Stack.Screen
        name="PublishHours"
        component={PublishHoursScreen}
        options={{ title: "פרסום שעות עבודה" }}
      />
      <Stack.Screen
        name="UserHomeScreen"
        component={UserHomeScreen}
        options={{ title: "דף הבית של המשתמש" }}
      />
      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
        options={{ title: "קביעת תור" }}
      />
    </Stack.Navigator>
  );
}
