// src/pages/attendance/CalendarView.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "./calendarHelpers";

export default function CalendarView({ employeeId }) {
  // If employeeId provided, show only that employee; otherwise show company-wide markers
  const [date, setDate] = useState(new Date());
  const [entriesMap, setEntriesMap] = useState({}); // key = yyyy-mm-dd -> entry
  const [loading, setLoading] = useState(false);
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days = eachDayOfInterval(monthStart, monthEnd);

  useEffect(() => {
    fetchMonth();
    // eslint-disable-next-line
  }, [date, employeeId]);

  const fetchMonth = async () => {
    setLoading(true);
    try {
      // Backend endpoint expected: GET /attendance/my-history?start=YYYY-MM-DD&end=YYYY-MM-DD&employeeId=...
      const start = format(monthStart);
      const end = format(monthEnd);
      const params = { start, end };
      if (employeeId) params.employeeId = employeeId;
      const res = await API.get("/attendance/my-history", { params });
      // res.data.entries expected array with date field
      const map = {};
      (res.data?.entries || []).forEach((e) => {
        const d = e.date ? e.date.split("T")[0] : e.date;
        map[d] = e;
      });
      setEntriesMap(map);
    } catch (err) {
      console.error("Calendar fetch failed", err?.response?.data || err.message);
      setEntriesMap({});
    }
    setLoading(false);
  };

  const prevMonth = () => setDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{date.toLocaleString(undefined, { month: "long", year: "numeric" })}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="px-3 py-1 border rounded">Prev</button>
          <button onClick={nextMonth} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {/* weekday headers */}
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((wd) => (
            <div className="text-sm font-medium text-gray-600 text-center" key={wd}>{wd}</div>
          ))}

          {/* blank leading cells for first day offset */}
          {Array.from({ length: days[0].getDay() }).map((_, i) => (
            <div key={"b"+i} />
          ))}

          {days.map((d) => {
            const key = format(d); // yyyy-mm-dd
            const entry = entriesMap[key];
            const status = (entry?.status || "").toLowerCase();
            const badge =
              status === "present" ? "bg-emerald-100" :
              status === "absent" ? "bg-red-100" :
              (status === "on leave" || status === "sick") ? "bg-yellow-100" : "bg-gray-100";
            return (
              <div key={key} className="border rounded p-2 h-20 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="text-sm">{d.getDate()}</div>
                  {entry && <div className={`px-2 py-0.5 rounded-full text-xs ${badge}`}>{entry.status}</div>}
                </div>

                <div className="text-xs text-gray-500">
                  {entry ? `${entry.checkInTime ? new Date(entry.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'} - ${entry.checkOutTime ? new Date(entry.checkOutTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'}` : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
