import React, { useEffect, useState } from "react";
import API from "../../api/api";
import Badge from "../../components/UI/Badge";

export default function MyHistory(){
  const [entries, setEntries] = useState([]);
  useEffect(()=> {
    (async ()=>{
      try {
        const { data } = await API.get('/attendance/my-history');
        setEntries(data.entries || []);
      } catch(e){ console.error(e); }
    })();
  },[]);
  return (
    <div className="space-y-6">
      <div className="title">My Attendance History</div>
      <div className="card">
        <div className="space-y-3">
          {entries.map(r=>(
            <div key={r._id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{r.date}</div>
                <div className="text-sm text-gray-500">{r.location || '—'}</div>
              </div>
              <div className="text-right">
                <div>{r.totalHours || 0} hrs</div>
                <div className="mt-2"><Badge color={r.status==='present'?'green':r.status==='late'?'yellow':'red'}>{r.status}</Badge></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
