import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { RootStackParamList } from "./types";
import AdminLoginScreen from "../screens/AdminLoginScreen";
import BarberHomeScreen from "../screens/BarberHomeScreen"; // ניצור אותו בהמשך

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
    </Stack.Navigator>
  );
}
