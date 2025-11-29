// src/pages/manager/AllAttendance.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

// ----------------- HELPERS -----------------

const formatTime = (t) =>
  t ? new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

const calcDuration = (inTs, outTs) => {
  if (!inTs || !outTs) return "-";
  try {
    const start = new Date(inTs);
    const end = new Date(outTs);
    const diff = Math.max(0, end - start);
    const minutes = Math.floor(diff / 60000);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  } catch {
    return "-";
  }
};

// -------------------------------------------

export default function AllAttendance() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ employeeId: "", start: "", end: "" });
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/attendance/all", { params: filters });
      setEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch (err) {
      console.error("Attendance fetch failed:", err?.response?.data || err.message);
      setEntries([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // ---- Check-In / Check-Out (API stub) ----
  const handleCheckIn = async (entry) => {
    try {
      // await API.post("/attendance/checkin", { employeeId: entry.userId._id });
      console.log("CHECK-IN:", entry._id);
      await fetchEntries();
    } catch (err) {
      console.error("Check-in failed:", err);
    }
  };

  const handleCheckOut = async (entry) => {
    try {
      // await API.post("/attendance/checkout", { employeeId: entry.userId._id });
      console.log("CHECK-OUT:", entry._id);
      await fetchEntries();
    } catch (err) {
      console.error("Check-out failed:", err);
    }
  };

  // -----------------------------------------

  return (
    <div className="space-y-6">
      <div className="title">All Attendance</div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <input
            placeholder="Employee ID"
            value={filters.employeeId}
            onChange={(e) =>
              setFilters({ ...filters, employeeId: e.target.value })
            }
            className="p-2 border rounded"
          />

          <input
            type="date"
            value={filters.start}
            onChange={(e) =>
              setFilters({ ...filters, start: e.target.value })
            }
            className="p-2 border rounded"
          />

          <input
            type="date"
            value={filters.end}
            onChange={(e) => setFilters({ ...filters, end: e.target.value })}
            className="p-2 border rounded"
          />

          <button
            onClick={fetchEntries}
            className="px-3 py-2 bg-black text-white rounded"
          >
            Filter
          </button>

          <a
            href={`${
              import.meta.env.VITE_API_URL || "http://localhost:5000/api"
            }/attendance/export?start=${filters.start}&end=${filters.end}&employeeId=${filters.employeeId}`}
            className="ml-auto px-3 py-2 border rounded"
          >
            Export CSV
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Employee</th>
                <th>Emp ID</th>
                <th>Date</th>
                <th>In</th>
                <th>Out</th>
                <th>Status</th>
                <th>Hours</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                entries.map((e) => {
                  const user = e.userId || {};
                  const checkIn = e.checkInTime || null;
                  const checkOut = e.checkOutTime || null;
                  const total =
                    e.totalHours || calcDuration(checkIn, checkOut);

                  const status = (e.status || "").toLowerCase();
                  const statusClass =
                    status === "present"
                      ? "bg-emerald-100 text-emerald-700"
                      : status === "absent"
                      ? "bg-red-100 text-red-700"
                      : status === "on leave" || status === "sick"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800";

                  return (
                    <tr key={e._id} className="border-b">
                      <td className="py-2">
                        <div className="font-medium">{user.name ?? "—"}</div>
                        <div className="text-xs text-gray-500">
                          {user.email ?? ""}
                        </div>
                      </td>

                      <td>{user.employeeId ?? "—"}</td>
                      <td>{formatDate(e.date)}</td>
                      <td>{formatTime(checkIn)}</td>
                      <td>{formatTime(checkOut)}</td>

                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${statusClass}`}
                        >
                          {e.status ?? "—"}
                        </span>
                      </td>

                      <td>{total}</td>

                      <td>
                        <div className="flex gap-2">
                          {!checkIn && (
                            <button
                              onClick={() => handleCheckIn(e)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                            >
                              Check In
                            </button>
                          )}

                          {checkIn && !checkOut && (
                            <button
                              onClick={() => handleCheckOut(e)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                            >
                              Check Out
                            </button>
                          )}

                          {checkIn && checkOut && (
                            <button
                              className="px-3 py-1 border rounded text-sm"
                              disabled
                            >
                              Done
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
