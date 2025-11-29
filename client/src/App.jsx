// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import Attendance from "./pages/attendance/Attendance";
import PrivateRoute from "./components/PrivateRoute";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import AllAttendance from "./pages/manager/AllAttendance";
import Reports from "./pages/manager/Reports";
import MyHistory from "./pages/employee/MyHistory";
import Profile from "./pages/Profile";
import Employees from "./pages/employee/Employees";
import CalendarView from "./pages/attendance/CalendarView";

// small helper to route to appropriate dashboard
function DashboardSwitcher() {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  if (user?.role === "manager") return <ManagerDashboard />;
  return <EmployeeDashboard />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardSwitcher />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="/attendance/calendar" element={<CalendarView />} />
        <Route path="my-history" element={<MyHistory />} />
        <Route path="profile" element={<Profile />} />
        <Route
          path="manager"
          element={
            <PrivateRoute roles={["manager"]}>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        <Route path="employees" element={<Employees />} />
        <Route path="manager/all" element={<AllAttendance />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}
