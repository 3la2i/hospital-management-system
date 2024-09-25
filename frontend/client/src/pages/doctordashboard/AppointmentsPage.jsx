import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Calendar, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchAppointments, updateAppointmentStatus } from '../../redux/slices/appointmentReducer'; // Update the import path
import Sidebar from './sidebar';
import Appointment from "../../assets/Appointment.svg";
import UseSweetAlert from '../../components/useSweetAlert';

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccessAlert, showErrorAlert } = UseSweetAlert();
  const doctorId = localStorage.getItem("user_id");
  const { appointments, loading, error } = useSelector(state => state.appointment);


  /******************************* */
  

    const handleSuccessClick = (title, message) => {
      showSuccessAlert(title, message);
    };
  
    const handleErrorClick = (title, message) => {
      showErrorAlert(title, message);
    };
  /*************************************** */

  useEffect(() => {
    dispatch(fetchAppointments(doctorId));
  }, [dispatch, doctorId]);

  const handleStatusUpdate = async (appointmentId, currentStatus) => {
    const confirmation = window.confirm("Are you sure you want to change the status?");
    if (!confirmation) return;

    try {
      await axios.put(`http://localhost:4025/api/doctorAppointmentsRoutes/updateStatus/${appointmentId}`);
      handleSuccessClick(" successfully ", "Status updated successfully!");

      dispatch(updateAppointmentStatus({ appointmentId, currentStatus }));
    } catch (error) {
      handleErrorClick(" error ", "Error updating status");
      console.error('Error updating status:', error);
    }
  };

  
  const handleReport = (appointment) => {
    const { patient_name, date, patient_id } = appointment;
    navigate('/MedicalReport', { state: { patientName: patient_name, doctorId, date, patientId: patient_id } });
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>Error fetching appointments: {error}</p>;

  return (
    <div className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${Appointment})` }}>
    <Sidebar />
    <div className="min-h-screen flex justify-center items-center ">
      <main className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md bg-opacity-80 transition-opacity duration-500 ease-in-out opacity-100">
        <h1 className="text-3xl font-bold mb-6 text-center mb-24 text-[#34a5b1] animate-pulse">Appointment List</h1>
        <div className="overflow-hidden rounded-lg shadow-md">
          <table className="w-full">
            <thead className="bg-[#34a5b1]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-100 transition duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.patient_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {appointment.time_slot}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {appointment.notes || 'No notes'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => handleStatusUpdate(appointment.id, appointment.status)}>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${appointment.status === 'true' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {appointment.status === 'true' ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {appointment.status === 'true' ? (
                        <button
                          className="text-[#34a5b1] hover:text-indigo-900 flex items-center"
                          onClick={() => handleReport(appointment)}
                        >
                          Write Report
                        </button>
                      ) : (
                        <span className="text-gray-400">Cannot write report</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
  
  );
};

export default AppointmentsPage;
