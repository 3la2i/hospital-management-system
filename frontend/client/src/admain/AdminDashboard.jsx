// src/components/admin/AdminDashboard.js
import React from "react";
import DashboardLayout from "./admin";
const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard</h1>
      <p>
        Select an option from the sidebar to manage different aspects of the
        system.
      </p>
    </DashboardLayout>
  );
};

export default AdminDashboard;
