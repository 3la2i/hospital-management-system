import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMedicalRecords,
  deleteMedicalRecord,
} from "../redux/slices/admainSlice/MedicalRecords";
import DashboardLayout from "./admin";

const PatientMedicalRecords = () => {
  const dispatch = useDispatch();
  const medicalRecords = useSelector((state) => state.medicalRecords.records);
  const loading = useSelector((state) => state.medicalRecords.loading);
  const error = useSelector((state) => state.medicalRecords.error);

  useEffect(() => {
    dispatch(fetchMedicalRecords());
  }, [dispatch]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Patient Medical Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Visit Date</th>
                <th className="py-3 px-6 text-left">Doctor</th>
                <th className="py-3 px-6 text-left">Hospital</th>
                <th className="py-3 px-6 text-left">Diagnosis</th>
                <th className="py-3 px-6 text-left">Treatment Plan</th>
                <th className="py-3 px-6 text-left">Medications</th>
                <th className="py-3 px-6 text-left">Follow-up Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {medicalRecords.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-6">{record.visit_date}</td>
                  <td className="py-3 px-6">{record.doctor_name}</td>
                  <td className="py-3 px-6">{record.hospital_name}</td>
                  <td className="py-3 px-6">{record.diagnosis}</td>
                  <td className="py-3 px-6">{record.treatment_plan}</td>
                  <td className="py-3 px-6">{record.medications}</td>
                  <td className="py-3 px-6">{record.follow_up_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientMedicalRecords;
