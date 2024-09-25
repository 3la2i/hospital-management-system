import React, { useState } from 'react';
import axios from 'axios';

const AppointmentFormPopup = ({ onClose, selectedDate }) => {
  const initialDate = typeof selectedDate === 'string' ? selectedDate.split('T')[0] : '';
  const [date, setDate] = useState(initialDate);
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [startPeriod, setStartPeriod] = useState('AM');
  const [endPeriod, setEndPeriod] = useState('AM');
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState('');




  const storedUser = sessionStorage.getItem('user');  // Get the stored user as a string
  const userObject = JSON.parse(storedUser);  // Convert the string back to an object
  const doctorId = userObject.id;  // Access the doctor's ID



  
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const validateTimeSlot = () => {
    const startTime = `${startHour}:${startMinute}${startPeriod}`;
    const endTime = `${endHour}:${endMinute}${endPeriod}`;
    return startTime !== endTime && startHour && startMinute && endHour && endMinute;
  };

  const formatTimeSlot = () => {
    return `${startHour}:${startMinute}${startPeriod}-${endHour}:${endMinute}${endPeriod}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateTimeSlot()) {
      setError('Please enter a valid time slot');
      return;
    }

    setError('');

    try {
      const timeSlot = formatTimeSlot();

      await axios.post('http://localhost:4025/api/availability', {
        doctor_id: doctorId,
        date: date,
        time_slot: timeSlot,
        is_available: isAvailable
      });

      onClose();
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Add Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Time Slot:</label>
            <div className="flex space-x-2">
              <select
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className="p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Hour</option>
                {hours.map(hour => (
                  <option key={`start-${hour}`} value={hour}>{hour}</option>
                ))}
              </select>
              <select
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
                className="p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Minute</option>
                {minutes.map(minute => (
                  <option key={`start-${minute}`} value={minute}>{minute}</option>
                ))}
              </select>
              <div className="flex items-center space-x-2">
                <label>
                  <input
                    type="radio"
                    value="AM"
                    checked={startPeriod === 'AM'}
                    onChange={() => setStartPeriod('AM')}
                  /> AM
                </label>
                <label>
                  <input
                    type="radio"
                    value="PM"
                    checked={startPeriod === 'PM'}
                    onChange={() => setStartPeriod('PM')}
                  /> PM
                </label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">End Time:</label>
            <div className="flex space-x-2">
              <select
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                className="p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Hour</option>
                {hours.map(hour => (
                  <option key={`end-${hour}`} value={hour}>{hour}</option>
                ))}
              </select>
              <select
                value={endMinute}
                onChange={(e) => setEndMinute(e.target.value)}
                className="p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Minute</option>
                {minutes.map(minute => (
                  <option key={`end-${minute}`} value={minute}>{minute}</option>
                ))}
              </select>
              <div className="flex items-center space-x-2">
                <label>
                  <input
                    type="radio"
                    value="AM"
                    checked={endPeriod === 'AM'}
                    onChange={() => setEndPeriod('AM')}
                  /> AM
                </label>
                <label>
                  <input
                    type="radio"
                    value="PM"
                    checked={endPeriod === 'PM'}
                    onChange={() => setEndPeriod('PM')}
                  /> PM
                </label>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700">Available:</label>
            <select
              value={isAvailable}
              onChange={(e) => setIsAvailable(e.target.value === 'true')}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#34a5b1] text-white rounded"
            >
              Add Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentFormPopup;