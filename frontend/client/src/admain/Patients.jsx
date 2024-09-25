// src/components/Patients.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatients,
  editPatient,
  deletePatient,
} from "../redux/slices/admainSlice/allPatientsSlice";
import DashboardLayout from "./admin";

const Patients = () => {
  const dispatch = useDispatch();
  const { patients, loading, error } = useSelector((state) => state.patients);
  const [editingPatient, setEditingPatient] = useState(null);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const handleEdit = (patient) => {
    setEditingPatient({ ...patient });
  };

  const handleSave = () => {
    dispatch(editPatient(editingPatient));
    setEditingPatient(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      dispatch(deletePatient(id));
    }
  };

  return (
    <DashboardLayout>
      <section id="patients" className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-6 text-blue-800">Patients</h3>
        {loading && <p>Loading...</p>}
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        {patients.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No patients found.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {patients.map((patient) => (
              <li
                key={patient.id}
                className="flex items-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
              >
                {editingPatient && editingPatient.id === patient.id ? (
                  <div className="flex-1">
                    <input
                      className="w-full p-2 mb-2 border rounded"
                      value={editingPatient.name}
                      onChange={(e) =>
                        setEditingPatient({
                          ...editingPatient,
                          name: e.target.value,
                        })
                      }
                    />
                    <input
                      className="w-full p-2 mb-2 border rounded"
                      value={editingPatient.email}
                      onChange={(e) =>
                        setEditingPatient({
                          ...editingPatient,
                          email: e.target.value,
                        })
                      }
                    />
                    <input
                      className="w-full p-2 mb-2 border rounded"
                      value={editingPatient.phone}
                      onChange={(e) =>
                        setEditingPatient({
                          ...editingPatient,
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
                      onClick={() => setEditingPatient(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-800">
                        {patient.name || `Patient ${patient.id}`}
                      </h4>
                      <p className="text-gray-600">ID: {patient.id}</p>
                      <p className="text-gray-600">Email: {patient.email}</p>
                    </div>
                    <div>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => handleEdit(patient)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleDelete(patient.id)}
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

export default Patients;
