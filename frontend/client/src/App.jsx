
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Signup from '../src/signup';
import Login from '../src/login';
import Home from '../src/home';
import DoctorDashboard from '../src/doctordashboard';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ContactUs from './pages/contactUs';
import AboutUs from './pages/aboutUs';
import PayPalPayment from './components/PayPalPayment';
import CombinedDentalAppointment from './doctordeatils';
import DoctorsList from './ourdoctors';
import DoctorDashboardMain from './pages/doctordashboard/DoctorDashboardMain';
import Appointmentforusertestfile from './pages/Appointmentforusertestfile';
import DashboardLayout from "./admain/admin";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UserProfile from "./pages/UserProfile";
import Patients from "./admain/Patients";
import Doctors from "./admain/Doctors";
import AdminDashboard from "./admain/AdminDashboard";
import AppointmentsDashboard from "./admain/Appointments";
import PatientMedicalRecords from "./admain/MedicalRecords";
import AppointmentsPage from './pages/doctordashboard/AppointmentsPage';
import MedicalReport from './pages/doctordashboard/MedicalReport';
import PatientRecordsCards from './pages/doctordashboard/PatientRecordsCards';
import AppointmentForDoctor from './pages/doctordashboard/AppointmentForrDoctor';
import ChatWindow from './pages/doctordashboard/ChatWindow';
import DoctorChat from './pages/doctordashboard/DoctorChat';
import UserListChat from './pages/doctordashboard/UserListChat';
import DoctorPostsPage from './pages/DoctorPostsPage';
import DoctorsPage from './pages/DoctorsPage';




const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (

    <Router>
      <div className="App">
      <PayPalScriptProvider options={{ "client-id": "AZZnJo9B4ulFid8Kdc6--QozivoXGg7263KyHe5KFomW-t-qQQ4cWR7l2lFScv10s0N_iq-DQpewLwDJ" }}>

        <Routes>
          <Route path="/DoctorsPage" element={<DoctorsPage />} />
          <Route path="/UserListChat" element={<UserListChat />} />
          <Route path="/DoctorChat" element={<DoctorChat />} />
          <Route path="/ChatWindow" element={<ChatWindow />} />
          <Route path="/DoctorPostsPage" element={<DoctorPostsPage />} />
          <Route path="/AppointmentForDoctor" element={<AppointmentForDoctor />} />
          <Route path="/AppointmentsPage" element={<AppointmentsPage />} />
          <Route path="/MedicalReport" element={<MedicalReport />} />
          <Route path="/PatientRecordsCards" element={<PatientRecordsCards />} />
          <Route path="/paypal" element={ <PayPalPayment amount="10.00" userId="123" appointmentId="456" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/appointments" element={<AppointmentsDashboard />} />
          <Route path="/MedicalRecords" element={<PatientMedicalRecords />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<DashboardLayout />} />
          <Route path="/Allpatients" element={<Patients />} />
          <Route path="/Alldoctors" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/header" element={<Header />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/doctor/:id" element={<CombinedDentalAppointment />} />
          <Route path="/ourdoctors" element={<DoctorsList />} />
          <Route path="/" element={ <Home /> } />
          <Route path="/DoctorDashboardMain" element={ <DoctorDashboardMain /> } />
          <Route path="/Appointmentforusertestfile" element={<Appointmentforusertestfile/>} />

        </Routes>
        </PayPalScriptProvider>
      </div>
   
    </Router>
  );
}

export default App;



