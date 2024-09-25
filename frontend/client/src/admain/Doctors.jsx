// src/components/Doctors.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctors,
  editDoctor,
  deleteDoctor,
} from "../redux/slices/admainSlice/allDoctorsSlice";
import DashboardLayout from "./admin";

const Doctors = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector((state) => state.doctors);
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const handleEdit = (doctor) => {
    setEditingDoctor({ ...doctor });
  };

  const handleSave = () => {
    dispatch(editDoctor(editingDoctor));
    setEditingDoctor(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      dispatch(deleteDoctor(id));
    }
  };

  return (
    <DashboardLayout>
      <section id="doctors" className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-6 text-blue-800">Doctors</h3>
        {loading && <p>Loading...</p>}
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        {doctors.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No doctors found.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {doctors.map((doctor) => (
              <li
                key={doctor.id}
                className="flex items-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
              >
                {editingDoctor && editingDoctor.id === doctor.id ? (
                  <div className="flex-1">
                    <input
                      className="w-full p-2 mb-2 border rounded"
                      value={editingDoctor.name}
                      onChange={(e) =>
                        setEditingDoctor({
                          ...editingDoctor,
                          name: e.target.value,
                        })
                      }
                    />
                    <input
                      className="w-full p-2 mb-2 border rounded"
                      value={editingDoctor.email}
                      onChange={(e) =>
                        setEditingDoctor({
                          ...editingDoctor,
                          email: e.target.value,
                        })
                      }
                    />
                    <input
                      className="w-full p-2 mb-2 border rounded"
                      value={editingDoctor.phone}
                      onChange={(e) =>
                        setEditingDoctor({
                          ...editingDoctor,
                          phone: e.target.value,
                        })
                      }
                    />
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditingDoctor(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-800">
                        {doctor.name || `Doctor ${doctor.id}`}
                      </h4>
                      <p className="text-gray-600">ID: {doctor.id}</p>
                      <p className="text-gray-600">Email: {doctor.email}</p>
                    </div>
                    <div>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => handleEdit(doctor)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleDelete(doctor.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </DashboardLayout>
  );
};

export default Doctors;
