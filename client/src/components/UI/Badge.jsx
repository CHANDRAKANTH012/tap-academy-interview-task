import React from "react";
export default function Badge({ children, color='green' }) {
  const bg = color==='green' ? 'bg-green-50 text-green-700' : color==='yellow' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700';
  return <span className={`px-3 py-1 rounded-full text-sm ${bg}`}>{children}</span>;
}
