import { useState, useEffect, useCallback } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import axios from 'axios';
import AppointmentFormPopup from './AppointmentFormPopup';
import 'react-calendar/dist/Calendar.css';
import WelcomingAppointment from './WelcomingAppointment';
import AppointmentActions from './AppointmentActions';


const AppointmentForDoctor = () => {
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentsForDate, setAppointmentsForDate] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [nextAppointment, setNextAppointment] = useState(null);
  const [latestPreviousAppointment, setLatestPreviousAppointment] = useState(null);

  const storedUser = sessionStorage.getItem('user');
  const userObject = JSON.parse(storedUser);
  const doctorId = userObject.id;


  const fetchAvailability = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4025/api/availability/${doctorId}`);
      setAvailability(response.data);
      setNextAppointment(findNextAppointment(response.data));
      setLatestPreviousAppointment(findLatestPreviousAppointment(response.data));
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const formatDate = (date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return utcDate.toISOString().split('T')[0];
  };

  const fetchAvailabilityForDate = (date) => {
    const formattedDate = formatDate(date);
    const filteredAppointments = availability.filter((appointment) => {
      const appointmentDate = formatDate(new Date(appointment.date));
      return appointmentDate === formattedDate;
    });

    setAppointmentsForDate(filteredAppointments);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchAvailabilityForDate(date);
  };

  const findNextAppointment = (appointments) => {
    const now = new Date();
    return appointments.find(app => new Date(app.date) > now && app.is_booked);
  };

  const findLatestPreviousAppointment = (appointments) => {
    const now = new Date();
    const pastAppointments = appointments.filter(app => new Date(app.date) < now && app.is_booked);
    return pastAppointments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  const changeMonth = (increment) => {
    setCurrentDate(prevDate => increment ? addMonths(prevDate, 1) : subMonths(prevDate, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getDayClass = (day) => {
    let classes = "w-8 h-8 rounded-full flex items-center justify-center";
    if (!isSameMonth(day, currentDate)) classes += " text-gray-300";
    if (isSameDay(day, selectedDate)) classes += " bg-blue-500 text-white";
    if (isToday(day)) classes += " border-2 border-blue-500";
    const appointmentForDay = availability.find(app => isSameDay(new Date(app.date), day));
    if (appointmentForDay) {
      if (appointmentForDay.is_booked) {
        classes += " bg-red-300";
      } else {
        classes += " bg-yellow-300";
      }
    }
    return classes;
  };

  const handleEditSuccess = async (updatedAvailability) => {
    await fetchAvailability();
    fetchAvailabilityForDate(selectedDate);
  };

  const handleDeleteSuccess = async (availabilityId) => {
    await fetchAvailability();
    fetchAvailabilityForDate(selectedDate);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <WelcomingAppointment />
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-8">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Manage Your Schedule</h1>
            <button
              onClick={() => setShowPopup(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center hover:bg-blue-600 transition duration-300"
            >
              <Plus className="mr-2 h-5 w-5" /> Add Appointment
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Calendar</h2>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-600">{format(currentDate, 'MMMM yyyy')}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => changeMonth(false)} className="p-1 rounded-full hover:bg-gray-200 transition duration-300">
                    <ChevronLeft size={24} className="text-gray-600" />
                  </button>
                  <button onClick={() => changeMonth(true)} className="p-1 rounded-full hover:bg-gray-200 transition duration-300">
                    <ChevronRight size={24} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-400">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth().map(day => (
                  <button
                    key={day.toString()}
                    className={getDayClass(day)}
                    onClick={() => handleDateChange(day)}
                  >
                    {format(day, 'd')}
                  </button>
                ))}
              </div>
              {nextAppointment && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg relative">
                  <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-2">
                    <CalendarIcon size={16} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-800">Next Appointment</h3>
                  <p className="text-sm text-gray-600">{format(new Date(nextAppointment.date), 'MMMM d, yyyy')}</p>
                  <p className="text-sm font-medium text-gray-700">Dr. {nextAppointment.doctorName || 'Smith'}</p>
                  <p className="text-sm text-gray-600">{nextAppointment.time_slot}</p>
                </div>
              )}
              {latestPreviousAppointment && (
                <div className="mt-6 bg-green-50 p-4 rounded-lg relative">
                  <div className="absolute top-2 right-2 bg-green-400 rounded-full p-2">
                    <CalendarIcon size={16} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-800">Latest Previous Appointment</h3>
                  <p className="text-sm text-gray-600">{format(new Date(latestPreviousAppointment.date), 'MMMM d, yyyy')}</p>
                  <p className="text-sm font-medium text-gray-700">Dr. {latestPreviousAppointment.doctorName || 'Smith'}</p>
                  <p className="text-sm text-gray-600">{latestPreviousAppointment.time_slot}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Appointments for {format(selectedDate, 'MMMM d, yyyy')}</h2>
              <ul className="space-y-4">
                {appointmentsForDate.length > 0 ? (
                  appointmentsForDate.map((appointment) => (
                    <li key={appointment.id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{appointment.time_slot}</h3>
                          <p className="text-sm text-gray-600">Doctor: Dr. {appointment.doctorName || 'Smith'}</p>
                          <p className={`text-sm ${appointment.is_booked ? 'text-red-600' : 'text-green-600'}`}>
                            {appointment.is_booked ? 'Booked' : 'Available'}
                          </p>
                        </div>
                        <AppointmentActions
                          appointment={appointment}
                          onEditSuccess={handleEditSuccess}
                          onDeleteSuccess={handleDeleteSuccess}
                        />
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No appointments available for this day.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <AppointmentFormPopup
          onClose={() => setShowPopup(false)}
          doctorId={doctorId}
          onAddSuccess={(newAppointment) => {
            setAvailability([...availability, newAppointment]);
            fetchAvailabilityForDate(selectedDate);
          }}
        />
      )}
    </div>
  );
};

export default AppointmentForDoctor;