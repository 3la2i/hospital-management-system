import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authslice";
import allPatientsSlice from "./slices/admainSlice/allPatientsSlice";
import allDoctorsSlice from "./slices/admainSlice/allDoctorsSlice";
import MedicalRecords from "./slices/admainSlice/MedicalRecords";
import appointments from "./slices/admainSlice/appointments";
import appointmentsReducer from "../redux/slices/appointmentsSlice"
import profileReducer from "./slices/profileSlice";
import appointmentReducer from "./slices/appointmentReducer";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: allPatientsSlice,
    doctors: allDoctorsSlice,
    Appointments: appointments,
    appointments: appointmentsReducer,
    medicalRecords: MedicalRecords,
    profile: profileReducer,
    appointment: appointmentReducer,


  },
});


export default store;


