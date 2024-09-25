import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../redux/slices/profileSlice";
import { fetchUserById } from "../redux/slices/authslice";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaUser,
  FaCalendar,
  FaChartBar,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaFileAlt,
  FaUserMd,
  FaNotesMedical,
} from "react-icons/fa";

const MedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [localLoading, setLocalLoading] = useState(false); // Component-specific loading state
  const [localError, setLocalError] = useState(null); // Component-specific error state

  const dispatch = useDispatch();

  // Access user data and loading/error states from Redux
  const { user, loading: userLoading, error: userError } = useSelector((state) => state.auth);
  const userId = localStorage.getItem("user_id");

  // Fetch user data and medical records when component mounts
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId)); // Fetch user data if userId is available
    }
  }, [dispatch, userId]);

  // Fetch medical records only after user data has been successfully fetched and token is available
  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setLocalLoading(true);
        setLocalError(null); // Clear previous errors

        if (!user || !user.token) {
          throw new Error("User token not available");
        }

        const response = await axios.get(
          `http://localhost:4025/api/medical-records`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`, // Send user token in headers
              "Content-Type": "application/json",
            },
          }
        );

        setMedicalRecords(response.data); // Store fetched medical records
      } catch (err) {
        console.error("Error fetching medical records:", err);
        setLocalError(err.response?.data?.error || "Failed to fetch medical records");
      } finally {
        setLocalLoading(false);
      }
    };

    if (user && user.token) {
      fetchMedicalRecords(); // Trigger fetching medical records only when user token is ready
    }
  }, [user]);

  // Show global loading from Redux (when fetching user)
  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  // Show global error if user fetching failed
  if (userError) {
    return <div className="text-red-600 p-4 bg-red-100 rounded-lg">{userError}</div>;
  }

  // Show local loading state for medical records
  if (localLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  // Show local error state for medical records
  if (localError) {
    return <div className="text-red-600 p-4 bg-red-100 rounded-lg">{localError}</div>;
  }
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Medical Records</h3>
      {medicalRecords.length === 0 ? (
        <p>No medical records found.</p>
      ) : (
        <ul className="space-y-4">
          {medicalRecords.map((record) => (
            <li
              key={record.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold flex items-center">
                    <FaFileAlt className="mr-2 text-blue-500" />
                    {user.role === "Patient" ? "Doctor" : "Patient"}:{" "}
                    {user.role === "Patient"
                      ? record.doctor_name
                      : record.patient_name}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <FaCalendar className="mr-2" />
                    Visit Date:{" "}
                    {new Date(record.visit_date).toLocaleDateString()}
                  </p>
                  {user.role === "Patient" && record.specialization && (
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <FaUserMd className="mr-2" />
                      Specialization: {record.specialization}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    Price: ${record.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Follow-up:{" "}
                    {record.follow_up_date
                      ? new Date(record.follow_up_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold flex items-center">
                  <FaNotesMedical className="mr-2 text-green-500" />
                  Diagnosis:
                </p>
                <p className="text-sm mt-1">{record.diagnosis}</p>
              </div>
              <div className="mt-2">
                <p className="font-semibold">Treatment Plan:</p>
                <p className="text-sm mt-1">{record.treatment_plan}</p>
              </div>
              <div className="mt-2">
                <p className="font-semibold">Medications:</p>
                <p className="text-sm mt-1">{record.medications}</p>
              </div>
              {record.visit_notes && (
                <div className="mt-2">
                  <p className="font-semibold">Visit Notes:</p>
                  <p className="text-sm mt-1">{record.visit_notes}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { loading, error } = useSelector((state) => state.profile);
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    newPassword: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);

  const [report, setReport] = useState({
    score: 33,
    details: "Good oral health, next checkup in 6 months.",
  });

  const [activeTab, setActiveTab] = useState("profile");

  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchAppointments = async () => {
        try {
          setAppointmentsLoading(true);
          const response = await axios.get(
            `http://localhost:4025/api/appointments/user/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          console.log("Fetched appointments:", response.data);
          setAppointments(response.data);
        } catch (err) {
          setAppointmentsError("Failed to fetch appointments");
          console.error("Error fetching appointments:", err);
        } finally {
          setAppointmentsLoading(false);
        }
      };

      fetchAppointments();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(userData)).unwrap();
      alert("Profile updated successfully!");
    } catch (err) {
      alert(`Error updating profile: ${err.message || "Unknown error"}`);
    }
  };

  const handleReschedule = async (appointment) => {
    console.log("Appointment to reschedule:", appointment);
    setCurrentAppointment(appointment);
    try {
      const doctorId = appointment.doctor_id;
      console.log("Doctor ID:", doctorId);

      if (!doctorId) {
        throw new Error("Doctor ID is undefined");
      }

      const response = await axios.get(
        `http://localhost:4025/api/appointments/available-times/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Available times response:", response.data);
      setAvailableTimes(response.data);
      setRescheduleModalOpen(true);
    } catch (err) {
      console.error("Error in handleReschedule:", err);
      alert(`Error fetching available times: ${err.message}`);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedTime) {
      alert("Please select a new time");
      return;
    }

    if (!currentAppointment) {
      console.error("No current appointment selected");
      alert("Error: No appointment selected for rescheduling");
      return;
    }

    console.log("Selected time:", selectedTime);
    console.log("Current appointment:", currentAppointment);

    const appointmentId =
      currentAppointment.id || currentAppointment.appointment_id;
    console.log("Appointment ID to be rescheduled:", appointmentId);

    if (!appointmentId) {
      console.error("Appointment ID is undefined");
      alert("Error: Could not identify the appointment to reschedule");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4025/api/appointments/${appointmentId}/reschedule`,
        { newAvailabilityId: selectedTime.id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Reschedule response:", response.data);

      // Refresh appointments
      const updatedAppointments = await axios.get(
        `http://localhost:4025/api/appointments/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setAppointments(updatedAppointments.data);

      setRescheduleModalOpen(false);
      setSelectedTime(null);
      setCurrentAppointment(null);
      alert("Appointment rescheduled successfully!");
    } catch (err) {
      console.error("Error in handleConfirmReschedule:", err);
      alert(`Error rescheduling appointment: ${err.message}`);
    }
  };

  const handleCancelAppointment = async (appointment) => {
    console.log("Appointment to cancel:", appointment);

    if (!appointment || !appointment.id) {
      console.error("Invalid appointment object");
      alert("Error: Could not identify the appointment to cancel");
      return;
    }

    const appointmentId = appointment.id;
    console.log("Appointment ID to be canceled:", appointmentId);

    try {
      setAppointmentsLoading(true);
      const response = await axios.put(
        `http://localhost:4025/api/appointments/${appointmentId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Cancel response:", response.data);

      const updatedAppointments = await axios.get(
        `http://localhost:4025/api/appointments/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setAppointments(updatedAppointments.data);
      alert("Appointment canceled successfully!");
    } catch (err) {
      console.error("Error in handleCancelAppointment:", err);
      alert(`Error canceling appointment: ${err.message}`);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={userData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={userData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={userData.newPassword}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
              {loading ? "Updating..." : "Update Profile"}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </form>
        );
      case "appointments":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Your Appointments</h3>
            {appointmentsLoading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-blue-500 text-4xl" />
              </div>
            ) : appointmentsError ? (
              <div className="text-red-600">{appointmentsError}</div>
            ) : appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              <ul className="space-y-4">
                {appointments.map((appointment) => (
                  <li
                    key={appointment.id || appointment.appointment_id}
                    className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold">
                          {appointment.user_role === "Patient"
                            ? "Doctor"
                            : "Patient"}
                          : {appointment.other_party_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Date:{" "}
                          {new Date(
                            appointment.appointment_date
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Time: {appointment.appointment_time}
                        </p>
                        <p
                          className={`text-sm ${
                            appointment.status
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          Status: {appointment.status ? "Confirmed" : "Pending"}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
                          onClick={() => handleReschedule(appointment)}
                        >
                          <FaEdit className="inline mr-1" /> Reschedule
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 transition duration-300"
                          onClick={() => handleCancelAppointment(appointment)}
                        >
                          <FaTrash className="inline mr-1" /> Cancel
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {rescheduleModalOpen && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
                    Reschedule Appointment
                  </h3>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    onChange={(e) =>
                      setSelectedTime(
                        availableTimes.find(
                          (time) => time.id === parseInt(e.target.value)
                        )
                      )
                    }
                  >
                    <option value="">Select a new time</option>
                    {availableTimes.map((time) => (
                      <option key={time.id} value={time.id}>
                        {new Date(time.date).toLocaleDateString()} -{" "}
                        {time.time_slot}
                      </option>
                    ))}
                  </select>
                  <div className="mt-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={handleConfirmReschedule}
                    >
                      Confirm Reschedule
                    </button>
                    <button
                      className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      onClick={() => setRescheduleModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "report":
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Your Health Report</h3>
            <p className="text-3xl font-bold mb-4">
              Score: <span className="text-blue-500">{report.score}</span> / 100
            </p>
            <p className="text-gray-700 mb-4">{report.details}</p>
            <div
              className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded"
              role="alert"
            >
              <p className="font-bold">Tip</p>
              <p>
                Regular dental check-ups can improve your oral health score!
              </p>
            </div>
          </div>
        );
      case "medicalRecords":
        return <MedicalRecords />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/4 bg-gray-200 p-4">
              <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
              <nav>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center w-full text-left py-2 px-4 rounded ${
                    activeTab === "profile"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-300"
                  }`}
                >
                  <FaUser className="mr-2" /> Profile
                </button>
                <button
                  onClick={() => setActiveTab("appointments")}
                  className={`flex items-center w-full text-left py-2 px-4 rounded mt-2 ${
                    activeTab === "appointments"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-300"
                  }`}
                >
                  <FaCalendar className="mr-2" /> Appointments
                </button>
                <button
                  onClick={() => setActiveTab("report")}
                  className={`flex items-center w-full text-left py-2 px-4 rounded mt-2 ${
                    activeTab === "report"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-300"
                  }`}
                >
                  <FaChartBar className="mr-2" /> Health Report
                </button>
                <button
                  onClick={() => setActiveTab("medicalRecords")}
                  className={`flex items-center w-full text-left py-2 px-4 rounded mt-2 ${
                    activeTab === "medicalRecords"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-300"
                  }`}
                >
                  <FaFileAlt className="mr-2" /> Medical Records
                </button>
              </nav>
            </div>
            <div className="md:w-3/4 p-6">
              <h3 className="text-2xl font-bold mb-4">
                {activeTab === "profile" && "Profile Information"}
                {activeTab === "appointments" && "Your Appointments"}
                {activeTab === "report" && "Your Health Report"}
                {activeTab === "medicalRecords" && "Your Medical Records"}
              </h3>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
