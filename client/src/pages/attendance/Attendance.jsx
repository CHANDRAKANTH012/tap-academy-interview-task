// src/pages/attendance/Attendance.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

const SAMPLE_APPROVALS = [
  { id: 1, title: "Leave Request", employee: "Sarah Johnson", days: 2, status: "pending" },
  { id: 2, title: "Expense Report", employee: "Mike Chen", days: 0, status: "pending" }
];

const SAMPLE_EVENTS = [
  { id: 1, title: "Team Building Workshop", time: "Today, 2:00 PM", tag: "workshop" },
  { id: 2, title: "Performance Reviews Due", time: "Tomorrow", tag: "deadline" }
];

export default function Attendance() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadSummary();
    loadApprovalsEvents();
  }, []);

  // Load summary (backend → fallback)
  async function loadSummary() {
    try {
      const sumRes = await API.get("/dashboard/employee");
      const hisRes = await API.get("/attendance/my-history");

      setSummary({
        attendanceRate: sumRes.data?.attendanceRate ?? "94.2%",
        hoursWorked: sumRes.data?.hoursWorked ?? "168h",
        avgHours: sumRes.data?.avgHours ?? "8.4h",
        leaveRequests: sumRes.data?.leaveRequests ?? 1,
      });

      setRecent(hisRes.data?.entries || []);
    } catch (err) {
      // fallback
      setSummary({
        attendanceRate: "94.2%",
        hoursWorked: "168h",
        avgHours: "8.4h",
        leaveRequests: 1,
      });
      setRecent([]);
    }
  }

  // Load approvals + events (backend → fallback)
  async function loadApprovalsEvents() {
    try {
      const appr = await API.get("/approvals"); // if backend missing → fallback
      const ev = await API.get("/events");

      setApprovals(Array.isArray(appr.data) ? appr.data : SAMPLE_APPROVALS);
      setEvents(Array.isArray(ev.data) ? ev.data : SAMPLE_EVENTS);
    } catch (err) {
      // fallback to demo data
      setApprovals(SAMPLE_APPROVALS);
      setEvents(SAMPLE_EVENTS);
    }
  }

  // UI-only approve/reject
  const approve = (id) =>
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a)));

  const reject = (id) =>
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)));

  return (
    <div className="container-max py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Attendance & Leave</h1>
          <p className="kicker">Track attendance and manage leave requests</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded">Export Report</button>
          <button className="px-4 py-2 bg-black text-white rounded">Request Leave</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="card">
          <div className="kicker">Attendance Rate</div>
          <div className="title mt-2">{summary?.attendanceRate}</div>
        </div>
        <div className="card">
          <div className="kicker">Hours Worked</div>
          <div className="title mt-2">{summary?.hoursWorked}</div>
          <div className="text-sm text-gray-500 mt-1">This month</div>
        </div>
        <div className="card">
          <div className="kicker">Avg Hours/Day</div>
          <div className="title mt-2">{summary?.avgHours}</div>
          <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
        </div>
        <div className="card">
          <div className="kicker">Leave Requests</div>
          <div className="title mt-2">{summary?.leaveRequests}</div>
          <div className="text-sm text-gray-500 mt-1">Pending approval</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-4">
        <button className="px-4 py-2 rounded-full bg-gray-100">Attendance</button>
        <button className="px-4 py-2 rounded-full">Leave Requests</button>
        <button className="px-4 py-2 rounded-full">Calendar</button>
      </div>

      {/* Recent attendance */}
      <div className="card mt-6">
        <h3 className="font-medium">Recent Attendance</h3>
        <div className="mt-4 text-sm text-gray-500">
          {recent.length ? null : "No records yet"}
        </div>
        {recent.map((r, i) => (
          <div key={i} className="mt-3 border rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{r.date || "—"}</div>
              <div className="text-xs text-gray-500">{r.in ? `In: ${r.in}` : "In: -"}</div>
            </div>
            <div className="text-sm text-gray-600">{r.status || "Present"}</div>
          </div>
        ))}
      </div>

      {/* Approvals & Events */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Approvals */}
        <div className="card">
          <h4 className="font-medium">Pending Approvals</h4>
          <div className="mt-4 space-y-3">
            {approvals.map((item) => (
              <div key={item.id} className="flex justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.employee}</div>
                </div>
                <div className="flex gap-2">
                  {item.status === "pending" ? (
                    <>
                      <button onClick={() => reject(item.id)} className="px-3 py-1 border rounded">
                        Reject
                      </button>
                      <button
                        onClick={() => approve(item.id)}
                        className="px-3 py-1 bg-black text-white rounded"
                      >
                        Approve
                      </button>
                    </>
                  ) : item.status === "approved" ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded">
                      Approved
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="card">
          <h4 className="font-medium">Upcoming Events</h4>
          <div className="mt-4 space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="p-3 border rounded flex justify-between">
                <div>
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-xs text-gray-500">{ev.time}</div>
                </div>
                <span className="px-3 py-1 border rounded text-sm">{ev.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
