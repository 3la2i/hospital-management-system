// src/components/DashboardLayout.js
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-white">
      <aside className="w-64 bg-blue-600 text-white">
        <div className="p-4">
          <h2 className="text-lg font-bold">Admin Dashboard</h2>
          <nav className="mt-4">
            <ul>
             
              <li>
                <button
                  onClick={() => navigate("/Allpatients")}
                  className="block py-2 px-4 hover:bg-blue-700"
                >
                  All Patients
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/Alldoctors")}
                  className="block py-2 px-4 hover:bg-blue-700"
                >
                  All Doctors
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/appointments")}
                  className="block py-2 px-4 hover:bg-blue-700"
                >
                  Appointments
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/MedicalRecords")}
                  className="block py-2 px-4 hover:bg-blue-700"
                >
                  Medical Records
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
