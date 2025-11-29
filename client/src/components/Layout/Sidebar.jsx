import React from "react";
import { NavLink } from "react-router-dom";
const items = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/attendance", label: "Attendance", icon: "⏱" },
  { to: "/employees", label: "Employees", icon: "👥" },
  { to: "/reports", label: "Reports", icon: "📊" },
  { to: "/profile", label: "Profile", icon: "⚙️" },
  { to: "/attendance/calendar", label: "Calendar", icon: "📅" },
];

export default function Sidebar(){
  return (
    <aside className="w-64 bg-white border-r border-muted-100 min-h-screen sticky top-0">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-orange-500 to-rose-400 flex items-center justify-center text-white font-bold">AH</div>
          <div>
            <div className="font-semibold">AttendanceHub</div>
            <div className="text-xs text-gray-400">Employee Management</div>
          </div>
        </div>

        <nav className="space-y-1">
          {items.map((it) => (
            <NavLink
              to={it.to}
              key={it.to}
              className={({isActive}) =>
                `flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive ? 'bg-black text-white' : ''}`
              }
            >
              <div className="text-xl">{it.icon}</div>
              <div className="font-medium text-sm">{it.label}</div>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center">JD</div>
          <div>
            <div className="text-sm font-medium">John Doe</div>
            <div className="text-xs text-gray-500">Employee</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
