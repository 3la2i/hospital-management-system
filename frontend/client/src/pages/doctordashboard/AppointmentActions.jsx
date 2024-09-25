import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const AppointmentActions = ({ appointment, onEditSuccess, onDeleteSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAppointment, setEditedAppointment] = useState(appointment);


  const storedUser = sessionStorage.getItem('user');  // Get the stored user as a string
  const userObject = JSON.parse(storedUser);  // Convert the string back to an object
  const doctorId = userObject.id;  // Access the doctor's ID


  const handleEdit = async () => {
    if (isEditing) {
      try {
        const response = await axios.patch(`http://localhost:4025/api/availability/${appointment.id}`, editedAppointment);
        if (response.status === 200) {
          onEditSuccess(response.data);
          console.log(response.data)
          setIsEditing(false);
        }
      } catch (error) {
        console.error('Failed to edit doctor availability', error);
        alert('Failed to update appointment. Please try again.');
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:4025/api/availability/${appointment.id}`);
      if (response.status === 200) {
        onDeleteSuccess(appointment.id);
      }
    } catch (error) {
      console.error('Failed to delete doctor availability', error);
      alert('Failed to delete appointment. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAppointment(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center space-x-2">
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <input
            type="date"
            name="date"
            value={editedAppointment.date}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="text"
            name="time_slot"
            value={editedAppointment.time_slot}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
      ) : (
        <div>
          <span className="mr-2">{appointment.date}</span>
          <span>{appointment.time_slot}</span>
        </div>
      )}
      <button
        onClick={handleEdit}
        className="text-blue-500 hover:text-blue-700 transition duration-300"
      >
        <Edit size={20} />
      </button>
      <button
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700 transition duration-300"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default AppointmentActions;