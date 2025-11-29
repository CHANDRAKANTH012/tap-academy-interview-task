import React, { useEffect, useState } from "react";
import API from "../../api/api";
import StatCard from "../../components/UI/StatCard";
import ActivityItem from "../../components/UI/ActivityItem";
import Badge from "../../components/UI/Badge";

export default function EmployeeDashboard(){
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(()=>{
    (async ()=>{
      try {
        const s = await API.get('/dashboard/employee');
        setStats(s.data);
        if (s.data.recent) setRecent(s.data.recent);
      } catch (err){ console.error(err); }
    })();
  },[]);

  return (
    <div className="space-y-6">
      <div>
        <div className="title">Welcome back, {stats?.user?.name || 'John'}!</div>
        <div className="kicker">Here's your attendance overview for today.</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Hours Today" value="7.5 hrs" />
        <StatCard title="This Week" value="38 hrs" />
        <StatCard title="Tasks Done" value="12 tasks" />
        <StatCard title="Pending Leave" value="2 requests" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="font-semibold mb-2">Current Status</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="kicker">Status</div>
              <div className="font-medium">Active</div>
              <div className="kicker mt-3">Clock In Time</div>
              <div>09:00 AM</div>
            </div>
            <div>
              <div className="kicker">Time Elapsed</div>
              <div className="font-medium">7:30:45</div>
              <div className="kicker mt-3">Daily Progress</div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-black" style={{width:'94%'}} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="font-semibold mb-3">Recent Activity</div>
          <div className="space-y-2">
            {recent.map((r)=>(
              <ActivityItem key={r._id || Math.random()} name={r.userId?.name || 'You'} action={`${r.checkInTime ? 'Clocked In' : 'No action'}`} time={r.date} />
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-3">This Week Overview</div>
        <div className="flex gap-3 overflow-x-auto py-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>(
            <div key={d} className={`min-w-[120px] p-4 rounded-lg ${i===3?'bg-black text-white':''} bg-gray-100`}>
              <div className="kicker">{d}</div>
              <div className="font-semibold mt-2">8h</div>
              <div className="text-sm text-center mt-2">●</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
