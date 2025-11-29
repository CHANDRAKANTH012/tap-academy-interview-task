import React, { useState } from "react";

export default function Reports(){
  const [filters, setFilters] = useState({ start:'', end:'', employeeId:''});
  return (
    <div className="space-y-6">
      <div className="title">Reports</div>
      <div className="card">
        <div className="flex gap-3">
          <input type="date" value={filters.start} onChange={e=>setFilters({...filters,start:e.target.value})} className="p-2 border rounded" />
          <input type="date" value={filters.end} onChange={e=>setFilters({...filters,end:e.target.value})} className="p-2 border rounded" />
          <input placeholder="Employee ID" value={filters.employeeId} onChange={e=>setFilters({...filters,employeeId:e.target.value})} className="p-2 border rounded" />
          <a className="ml-auto px-4 py-2 bg-black text-white rounded" href={`/api/attendance/export?start=${filters.start}&end=${filters.end}&employeeId=${filters.employeeId}`}>Export CSV</a>
        </div>
      </div>
    </div>
  );
}
