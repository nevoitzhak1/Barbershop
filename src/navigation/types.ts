export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AdminLogin: undefined;
  BarberHome: undefined;
  PublishHours: undefined;
  UserHomeScreen: undefined;
  BookAppointment: undefined;
};

export type Appointment = {
  id?: string;
  date: string;
  hour: string;
  userId: string;
  notes?: string;
};
