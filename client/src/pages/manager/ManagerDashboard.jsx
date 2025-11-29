import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/user/userSlice";

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/dashboard/manager");
        setStats(data);
      } catch (err) {
        console.error("Manager dashboard failed:", err);
      }
    })();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header Row with Logout */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manager Dashboard</h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-100"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">Total Employees: {stats.totalEmployees}</div>
        <div className="card">Present Today: {stats.presentToday}</div>
        <div className="card">Late Today: {stats.lateToday}</div>
      </div>

      <Link className="text-blue-600 underline" to="/manager/all">
        View All Attendance
      </Link>

      <div className="card">
        <h3 className="font-semibold mb-2">Weekly Trend</h3>
        <ul>
          {stats.trend.map((t) => (
            <li key={t.date}>
              {t.date}: {t.present}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Department-wise Attendance</h3>
        <ul>
          {stats.deptAgg.map((d) => (
            <li key={d._id}>
              {d._id}: {d.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
