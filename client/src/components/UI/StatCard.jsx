import React from "react";

export default function StatCard({ title, value, subtitle, children }) {
  return (
    <div className="card flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <div className="kicker">{title}</div>
          <div className="text-2xl font-semibold mt-2">{value}</div>
          {subtitle && <div className="text-sm text-gray-400 mt-1">{subtitle}</div>}
        </div>
        <div className="ml-4">{children}</div>
      </div>
    </div>
  );
}
