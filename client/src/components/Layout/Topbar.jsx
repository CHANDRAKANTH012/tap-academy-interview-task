// src/components/Layout/Topbar.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/user/userSlice";

export default function Topbar() {
  const { user } = useSelector((s) => s.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  useEffect(() => {
    // keep title logic if you have one
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">AttendanceHub</h2>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees, tasks..."
            className="px-3 py-2 rounded-lg border bg-gray-50"
          />

          <button className="p-2 rounded-full">🔔</button>

          {!user ? (
            <div className="flex gap-2">
              <Link to="/login" className="px-3 py-1 border rounded">
                Sign in
              </Link>
              <Link to="/register" className="px-3 py-1 bg-black text-white rounded">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border">
                <img src={user?.avatar || "https://i.pravatar.cc/100"} alt="avatar" />
              </div>
              <button
                className="px-3 py-1 border rounded bg-white hover:bg-gray-50"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
