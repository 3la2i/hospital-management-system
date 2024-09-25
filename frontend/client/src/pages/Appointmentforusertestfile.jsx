import React, { useState, useEffect, useCallback, useRef } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Appointmentforusertestfile = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [doctorId, setDoctorId] = useState(1); // Replace with actual doctor ID
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const paypalRef = useRef();

  // Fetch availabilities for the entire month
  const fetchMonthAvailabilities = useCallback(async (date) => {
    try {
      const startDate = startOfMonth(date);
      const endDate = endOfMonth(date);
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      const response = await axios.get(`http://localhost:4025/api/availability/${doctorId}`, {
        params: { startDate: formattedStartDate, endDate: formattedEndDate }
      });
      const availabilitiesArray = Array.isArray(response.data) ? response.data : [];
      setAvailabilities(availabilitiesArray);
      console.log(availabilitiesArray); // Log all fetched availabilities
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      setAvailabilities([]);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchMonthAvailabilities(currentDate);
  }, [fetchMonthAvailabilities, currentDate]);

  useEffect(() => {
    if (window.paypal && selectedAvailability) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '10.00' // Replace with actual appointment cost
              }
            }]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          await bookAppointment(selectedAvailability, order.id);
        },
        onError: (err) => {
          console.error('PayPal Error:', err);
          alert('An error occurred with the payment. Please try again.');
        }
      }).render(paypalRef.current);
    }
  }, [selectedAvailability]);

  // Handle date change from the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log("Selected Date (onClick):", format(date, 'yyyy-MM-dd'));
  };

  // Change the current month
  const changeMonth = (increment) => {
    const newDate = increment ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
    setCurrentDate(newDate);
    fetchMonthAvailabilities(newDate);
  };

  // Get all days in the current month for the calendar
  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  // Determine the CSS classes for each day in the calendar
  const getDayClass = useCallback((day) => {
    let classes = "w-8 h-8 rounded-full flex items-center justify-center";
    if (!isSameMonth(day, currentDate)) classes += " text-gray-300";
    if (isSameDay(day, selectedDate)) classes += " bg-blue-500 text-white";
    if (isToday(day)) classes += " border-2 border-blue-500";
    
    const dayAvailabilities = availabilities.filter(avail => 
      isSameDay(parseISO(avail.date), day)
    );
    
    if (dayAvailabilities.length > 0) {
      const hasAvailable = dayAvailabilities.some(avail => avail.is_available && !avail.is_booked);
      const allBooked = dayAvailabilities.every(avail => avail.is_booked);
      
      if (allBooked) {
        classes += " bg-red-300"; // All appointments are booked
      } else if (hasAvailable) {
        classes += " bg-yellow-300"; // There are available appointments
      }
    }
    
    return classes;
  }, [availabilities, currentDate, selectedDate]);

  // Book an appointment
  const bookAppointment = async (availability, orderId) => {
    try {
      const patient_id = localStorage.getItem("user_id");
      const response = await axios.post('http://localhost:4025/api/appointments/book', {
        patient_id: patient_id,
        doctor_id: doctorId,
        availability_id: availability.id,
        notes: "Booked via web interface",
        orderId: orderId
      });
      if (response.status === 201) {
        const updatedAvailabilities = availabilities.map(avail =>
          avail.id === availability.id ? { ...avail, is_booked: true } : avail
        );
        setAvailabilities(updatedAvailabilities);
        setSelectedAvailability(null);
        alert('Appointment booked and paid successfully!');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      if (error.response) {
        alert(`Failed to book appointment: ${error.response.data.message}`);
      } else if (error.request) {
        alert('No response received from server. Please try again later.');
      } else {
        alert('An error occurred while booking the appointment. Please try again.');
      }
    }
  };

  // Get availabilities for the selected date
  const getAvailabilitiesForSelectedDate = useCallback(() => {
    return availabilities.filter(avail => 
      isSameDay(parseISO(avail.date), selectedDate)
    );
  }, [availabilities, selectedDate]);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-8">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Available Appointments</h1>
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
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Appointments for {format(selectedDate, 'MMMM d, yyyy')}</h2>
              <ul className="space-y-4">
                {getAvailabilitiesForSelectedDate().length > 0 ? (
                  getAvailabilitiesForSelectedDate().map((availability) => (
                    <li key={availability.id} className={`border p-4 rounded-lg shadow-sm ${availability.is_booked ? 'bg-red-100' : 'bg-green-100'}`}>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {format(parseISO(availability.date), 'MMMM d, yyyy')} at {availability.time_slot}
                        </h3>
                        <p className="text-sm text-gray-600">Doctor ID: {doctorId}</p>
                        {!availability.is_booked && (
                          <button 
                            onClick={() => setSelectedAvailability(availability)}
                            className="mt-2 bg-teal-900 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                          >
                            Select Appointment
                          </button>
                        )}
                        {availability.is_booked && (
                          <p className="mt-2 text-red-600 font-semibold">Booked</p>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No appointments available for this day.</p>
                )}
              </ul>
            </div>
          </div>

          {selectedAvailability && (
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Confirm and Pay</h3>
              <p className="mb-2">Appointment: {format(parseISO(selectedAvailability.date), 'MMMM d, yyyy')} at {selectedAvailability.time_slot}</p>
              <p className="mb-4">Cost: $10.00</p>
              <div ref={paypalRef}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointmentforusertestfile;